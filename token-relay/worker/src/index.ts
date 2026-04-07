import type { Env } from "./types.js";
import { handlePreflight, withCors } from "./cors.js";
import { Errors } from "./utils/error.js";
import { extractBearerToken, getUserRecord, handleKeySubmit } from "./auth/keyManager.js";
import { checkRateLimit, getClientIp } from "./ratelimit/limiter.js";
import { proxyOpenAI } from "./proxy/openai.js";
import { proxyAnthropic } from "./proxy/anthropic.js";
import { proxyGemini } from "./proxy/gemini.js";
import { handleRefClick, handleRefCreate, handleRefStats } from "./referral/tracker.js";

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    // OPTIONS preflight
    if (request.method === "OPTIONS") {
      return handlePreflight();
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      const response = await route(request, path, env);
      return withCors(response);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      return withCors(Errors.internal(msg));
    }
  },
};

// ─── 路由分发 ─────────────────────────────────────────────────────

async function route(request: Request, path: string, env: Env): Promise<Response> {
  // ── 公开路由（无需鉴权）──────────────────────────────────────

  if (path === "/health") {
    return handleHealth();
  }

  if (path === "/api/stats") {
    return handleStats(env);
  }

  if (path === "/v1/models" && request.method === "GET") {
    return handleModelList();
  }

  if (path === "/api/keys/submit" && request.method === "POST") {
    return handleKeySubmit(request, env);
  }

  // 推广跳转 /api/ref/:code
  const refMatch = path.match(/^\/api\/ref\/([A-Za-z0-9]{4,16})$/);
  if (refMatch && request.method === "GET") {
    return handleRefClick(request, refMatch[1]!, env);
  }

  // ── 需要鉴权的代理路由 ────────────────────────────────────────

  // IP 级速率限制（宽松，用于防爬）
  const ip = getClientIp(request);
  const ipLimit = await checkRateLimit(env.RELAY_KV, `ip:${ip}`, 60);
  if (!ipLimit.allowed) {
    return Errors.rateLimited(0);
  }

  // 提取并验证 relay token
  const token = extractBearerToken(request);
  if (!token) {
    return Errors.unauthorized();
  }

  const user = await getUserRecord(env.RELAY_KV, token);
  if (!user) {
    return Errors.unauthorized();
  }

  // Token 级速率限制（管理类接口与代理共用同一配额）
  const rateLimit = parseInt(env.RATE_LIMIT_PER_MIN || "20", 10);
  const tokenLimit = await checkRateLimit(env.RELAY_KV, `token:${token}`, rateLimit);
  if (!tokenLimit.allowed) {
    return Errors.rateLimited(0);
  }

  // 管理类路由（不转发上游）
  if (path === "/api/ref/create" && request.method === "POST") {
    return handleRefCreate(request, env, token);
  }
  if (path === "/api/ref/stats" && request.method === "GET") {
    return handleRefStats(request, env, token);
  }

  // 更新全局请求计数（异步，不阻塞响应）
  incrementStat(env.RELAY_KV, "stats:totalRequests").catch(() => {});

  // ── OpenAI 路由 ──────────────────────────────────────────────
  if (path.startsWith("/v1/") && user.provider === "openai") {
    return proxyOpenAI(request, user.apiKey, env);
  }

  // ── Anthropic 路由 ───────────────────────────────────────────
  if (
    (path.startsWith("/v1/messages") || path.startsWith("/messages")) &&
    user.provider === "anthropic"
  ) {
    return proxyAnthropic(request, user.apiKey, env);
  }

  // ── Gemini 路由 ──────────────────────────────────────────────
  if (path.startsWith("/gemini/") && user.provider === "gemini") {
    return proxyGemini(request, user.apiKey, env);
  }

  // 路由不匹配
  return Errors.notFound(path);
}

// ─── 内置处理器 ────────────────────────────────────────────────────

function handleHealth(): Response {
  return new Response(
    JSON.stringify({ status: "ok", service: "token-relay", ts: Date.now() }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

async function handleStats(env: Env): Promise<Response> {
  const [totalRequests, totalUsers] = await Promise.all([
    env.RELAY_KV.get<number>("stats:totalRequests", "json"),
    env.RELAY_KV.get<number>("stats:totalUsers", "json"),
  ]);

  return new Response(
    JSON.stringify({
      totalRequests: totalRequests ?? 0,
      totalUsers: totalUsers ?? 0,
      service: "relay.wordok.top",
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

function handleModelList(): Response {
  const models = {
    object: "list",
    data: [
      { id: "gpt-4o", object: "model", owned_by: "openai" },
      { id: "gpt-4-turbo", object: "model", owned_by: "openai" },
      { id: "gpt-4", object: "model", owned_by: "openai" },
      { id: "gpt-3.5-turbo", object: "model", owned_by: "openai" },
      { id: "claude-3-5-sonnet-20241022", object: "model", owned_by: "anthropic" },
      { id: "claude-3-opus-20240229", object: "model", owned_by: "anthropic" },
      { id: "claude-3-haiku-20240307", object: "model", owned_by: "anthropic" },
      { id: "gemini-1.5-pro", object: "model", owned_by: "google" },
      { id: "gemini-1.5-flash", object: "model", owned_by: "google" },
      { id: "gemini-pro", object: "model", owned_by: "google" },
    ],
  };
  return new Response(JSON.stringify(models), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

async function incrementStat(kv: KVNamespace, key: string): Promise<void> {
  const val = await kv.get<number>(key, "json");
  await kv.put(key, JSON.stringify((val ?? 0) + 1));
}
