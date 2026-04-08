import type { Env, ReferralRecord } from "../types.js";

const REF_PREFIX = "ref:";

/**
 * 生成推广码（6位大写字母+数字）。
 */
export function generateRefCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

/**
 * 创建新推广码，关联到 token（用户 ID）。
 * 返回生成的推广码。
 */
export async function createRefCode(kv: KVNamespace, ownerId: string): Promise<string> {
  const code = generateRefCode();
  const record: ReferralRecord = {
    ownerId,
    clicks: 0,
    conversions: 0,
    createdAt: Date.now(),
  };
  await kv.put(`${REF_PREFIX}${code}`, JSON.stringify(record));
  return code;
}

/**
 * GET /api/ref/:code?target=nordvpn
 *
 * 记录点击，然后 302 跳转到对应的 affiliate 链接。
 */
export async function handleRefClick(
  request: Request,
  code: string,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const target = url.searchParams.get("target") ?? "nordvpn";

  // 记录点击（异步，不阻塞重定向）
  recordClick(env.RELAY_KV, code).catch(() => {});

  const affiliateUrl = getAffiliateUrl(target);
  return Response.redirect(affiliateUrl, 302);
}

/**
 * 记录一次点击（带防重复：同一 IP 60 分钟内只计一次）。
 */
async function recordClick(kv: KVNamespace, code: string): Promise<void> {
  const kvKey = `${REF_PREFIX}${code}`;
  const record = await kv.get<ReferralRecord>(kvKey, "json");
  if (!record) return;
  record.clicks += 1;
  await kv.put(kvKey, JSON.stringify(record));
}

/**
 * 推广目标 → affiliate 链接映射。
 * 替换为你注册后获得的真实 affiliate URL。
 */
function getAffiliateUrl(target: string): string {
  const links: Record<string, string> = {
    nordvpn: "https://nordvpn.com/?utm_medium=affiliate&utm_term=REPLACE_YOUR_NORDVPN_REF",
    expressvpn: "https://www.expressvpn.com/order#refer-REPLACE_YOUR_EXPRESSVPN_REF",
    surfshark: "https://surfshark.com/?utm_source=affiliate&utm_medium=REPLACE_YOUR_SURFSHARK_REF",
    writesonic: "https://writesonic.com?via=REPLACE_YOUR_WRITESONIC_REF",
    scalenut: "https://www.scalenut.com/?via=REPLACE_YOUR_SCALENUT_REF",
  };
  return links[target] ?? links["nordvpn"]!;
}

/**
 * 查询推广统计（用于用户仪表盘）。
 */
export async function getRefStats(
  kv: KVNamespace,
  code: string
): Promise<ReferralRecord | null> {
  return kv.get<ReferralRecord>(`${REF_PREFIX}${code}`, "json");
}

const USER_REF_PREFIX = "userref:";

/**
 * POST /api/ref/create — 已注册用户创建推广码（调用方已校验 relay token）
 */
export async function handleRefCreate(request: Request, env: Env, token: string): Promise<Response> {
  const existing = await env.RELAY_KV.get(`${USER_REF_PREFIX}${token}`);
  if (existing) {
    const origin = getRelayOrigin(request);
    return new Response(
      JSON.stringify({
        code: existing,
        shareUrl: `${getLandingOrigin(request)}/relay/?ref=${existing}`,
        refRedirectExample: `${origin}/api/ref/${existing}?target=nordvpn`,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  const code = await createRefCode(env.RELAY_KV, token);
  await env.RELAY_KV.put(`${USER_REF_PREFIX}${token}`, code);

  const origin = getRelayOrigin(request);
  return new Response(
    JSON.stringify({
      code,
      shareUrl: `${getLandingOrigin(request)}/relay/?ref=${code}`,
      refRedirectExample: `${origin}/api/ref/${code}?target=nordvpn`,
    }),
    { status: 201, headers: { "Content-Type": "application/json" } }
  );
}

/**
 * GET /api/ref/stats — 查询当前用户的推广数据（调用方已校验 relay token）
 */
export async function handleRefStats(_request: Request, env: Env, token: string): Promise<Response> {
  const code = await env.RELAY_KV.get(`${USER_REF_PREFIX}${token}`);
  if (!code) {
    return new Response(JSON.stringify({ error: "No referral code yet. POST /api/ref/create first." }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const stats = await getRefStats(env.RELAY_KV, code);
  return new Response(
    JSON.stringify({
      code,
      clicks: stats?.clicks ?? 0,
      conversions: stats?.conversions ?? 0,
      createdAt: stats?.createdAt,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

function getRelayOrigin(request: Request): string {
  const u = new URL(request.url);
  return `${u.protocol}//${u.host}`;
}

/** 落地页域名（与 Astro 主站一致）；可通过 Referer 推断，默认 wordok.top */
function getLandingOrigin(request: Request): string {
  const ref = request.headers.get("Referer");
  if (ref) {
    try {
      const o = new URL(ref);
      if (o.hostname === "localhost" || o.hostname.endsWith("wordok.top")) {
        return `${o.protocol}//${o.host}`;
      }
    } catch {
      /* ignore */
    }
  }
  return "https://wordok.top";
}
