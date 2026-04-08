import type { Env, UserRecord } from "../types.js";

/**
 * 从请求头中提取 relay token。
 * 支持: Authorization: Bearer <token>
 */
export function extractBearerToken(request: Request): string | null {
  const auth = request.headers.get("Authorization") ?? "";
  if (!auth.startsWith("Bearer ")) return null;
  const token = auth.slice(7).trim();
  return token.length > 0 ? token : null;
}

/** KV key 前缀 */
const USER_PREFIX = "user:";

/**
 * 根据 relay token 查找用户记录。
 * 如果找不到，返回 null。
 */
export async function getUserRecord(
  kv: KVNamespace,
  token: string
): Promise<UserRecord | null> {
  // 安全检查：token 不得包含 KV key 中的危险字符
  if (!isValidToken(token)) return null;
  return kv.get<UserRecord>(`${USER_PREFIX}${token}`, "json");
}

/**
 * 写入/更新用户记录。
 */
export async function setUserRecord(
  kv: KVNamespace,
  token: string,
  record: UserRecord
): Promise<void> {
  await kv.put(`${USER_PREFIX}${token}`, JSON.stringify(record));
}

/**
 * 用户提交 API Key 注册接口处理器。
 * POST /api/keys/submit
 * Body: { apiKey: string, provider: "openai"|"anthropic"|"gemini", refCode?: string }
 * 返回: { token: string }
 */
export async function handleKeySubmit(
  request: Request,
  env: Env
): Promise<Response> {
  let body: { apiKey?: string; provider?: string; refCode?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { apiKey, provider, refCode } = body;

  if (!apiKey || typeof apiKey !== "string" || apiKey.length < 10) {
    return jsonError("apiKey is required and must be a valid string", 400);
  }

  const validProviders = ["openai", "anthropic", "gemini"] as const;
  if (!provider || !validProviders.includes(provider as (typeof validProviders)[number])) {
    return jsonError("provider must be one of: openai, anthropic, gemini", 400);
  }

  // 防止 SSRF：校验 apiKey 格式
  if (!validateApiKeyFormat(apiKey, provider as UserRecord["provider"])) {
    return jsonError("apiKey format appears invalid for the specified provider", 400);
  }

  // 生成唯一的 relay token
  const token = generateToken();

  const record: UserRecord = {
    apiKey,
    provider: provider as UserRecord["provider"],
    quota: -1, // 转发模式：用户自己的 Key，无额度限制
    usedQuota: 0,
    refCode: refCode && isValidRefCode(refCode) ? refCode : undefined,
    createdAt: Date.now(),
  };

  await setUserRecord(env.RELAY_KV, token, record);

  // 如果有推广码，记录转化
  if (refCode && isValidRefCode(refCode)) {
    await recordReferralConversion(env.RELAY_KV, refCode, token);
  }

  // 更新用户总数统计
  await incrementStat(env.RELAY_KV, "stats:totalUsers");

  return new Response(
    JSON.stringify({
      token,
      message: "API Key registered successfully. Use this token as your Bearer token.",
      endpoint: "https://relay.wordok.top",
    }),
    {
      status: 201,
      headers: { "Content-Type": "application/json" },
    }
  );
}

/** 更新用户已使用配额 */
export async function incrementUsedQuota(
  kv: KVNamespace,
  token: string,
  record: UserRecord,
  amount = 1
): Promise<void> {
  record.usedQuota += amount;
  await setUserRecord(kv, token, record);
}

// ─── 工具函数 ────────────────────────────────────────────────────

function generateToken(): string {
  // 生成 32 字节随机 token，base64url 编码
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function isValidToken(token: string): boolean {
  // relay token 只允许 base64url 字符，长度 20-60
  return /^[A-Za-z0-9\-_]{20,60}$/.test(token);
}

function isValidRefCode(code: string): boolean {
  return /^[A-Za-z0-9]{4,16}$/.test(code);
}

/** 简单检验 apiKey 格式，防止明显错误输入 */
function validateApiKeyFormat(key: string, provider: UserRecord["provider"]): boolean {
  if (provider === "openai") return key.startsWith("sk-");
  if (provider === "anthropic") return key.startsWith("sk-ant-");
  if (provider === "gemini") return key.length >= 20; // Google API Key 无固定前缀
  return false;
}

async function recordReferralConversion(
  kv: KVNamespace,
  refCode: string,
  _newUserId: string
): Promise<void> {
  const kvKey = `ref:${refCode}`;
  const record = await kv.get<{ ownerId: string; clicks: number; conversions: number }>(
    kvKey,
    "json"
  );
  if (!record) return;
  record.conversions += 1;
  await kv.put(kvKey, JSON.stringify(record));
}

async function incrementStat(kv: KVNamespace, key: string): Promise<void> {
  const val = await kv.get<number>(key, "json");
  await kv.put(key, JSON.stringify((val ?? 0) + 1));
}

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
