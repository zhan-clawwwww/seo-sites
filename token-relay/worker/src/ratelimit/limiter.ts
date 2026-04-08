/**
 * 基于 KV 的滑动窗口速率限制器。
 *
 * 每次请求记录时间戳，过滤掉 60s 以外的旧记录。
 * KV 写入是瓶颈（免费额度 1000次/天），因此对同一 key
 * 采用 65s TTL 自动过期，减少无效数据占用。
 */
export async function checkRateLimit(
  kv: KVNamespace,
  key: string,
  limitPerMin: number
): Promise<{ allowed: boolean; remaining: number }> {
  const now = Date.now();
  const windowStart = now - 60_000;
  const kvKey = `ratelimit:${key}`;

  const stored = await kv.get<number[]>(kvKey, "json");
  const timestamps = (stored ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= limitPerMin) {
    return { allowed: false, remaining: 0 };
  }

  timestamps.push(now);
  // TTL 65s，稍大于窗口，确保数据不会提前过期
  await kv.put(kvKey, JSON.stringify(timestamps), { expirationTtl: 65 });

  return { allowed: true, remaining: limitPerMin - timestamps.length };
}

/**
 * 从请求中获取客户端 IP（Cloudflare 注入 CF-Connecting-IP）。
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("X-Forwarded-For")?.split(",")[0].trim() ??
    "unknown"
  );
}
