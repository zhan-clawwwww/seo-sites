import type { Env } from "../types.js";
import { Errors } from "../utils/error.js";

const ALLOWED_OPENAI_PATHS = /^\/(v1)\/(chat\/completions|completions|embeddings|models|images|audio|files|fine_tuning)/;

/**
 * 代理请求到 OpenAI API。
 * 支持流式 (SSE) 和非流式响应透明透传。
 */
export async function proxyOpenAI(
  request: Request,
  userKey: string,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);

  // 路径白名单校验，防止 SSRF
  if (!ALLOWED_OPENAI_PATHS.test(url.pathname)) {
    return Errors.notFound(url.pathname);
  }

  const upstreamUrl = `${env.OPENAI_BASE}${url.pathname}${url.search}`;

  // 构造上游请求头，移除原始 Host，注入用户真实 Key
  const upstreamHeaders = buildUpstreamHeaders(request.headers, {
    Authorization: `Bearer ${userKey}`,
    Host: "api.openai.com",
  });

  const upstreamReq = new Request(upstreamUrl, {
    method: request.method,
    headers: upstreamHeaders,
    body: request.method !== "GET" && request.method !== "HEAD" ? request.body : null,
    // @ts-ignore — Cloudflare Workers 需要此字段才能正确透传流式 body
    duplex: "half",
  });

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(upstreamReq);
  } catch (err) {
    return Errors.internal("Failed to reach OpenAI API");
  }

  // 透传响应（包括流式 SSE）
  return new Response(upstreamRes.body, {
    status: upstreamRes.status,
    headers: buildDownstreamHeaders(upstreamRes.headers),
  });
}

// ─── 工具函数 ────────────────────────────────────────────────────

/**
 * 构造转发给上游的请求头：
 * - 保留原始请求头（内容类型、anthropic-* 等客户端头）
 * - 覆盖指定字段
 * - 移除 Host、CF-* 等 Cloudflare 注入头（避免上游误解）
 */
function buildUpstreamHeaders(
  original: Headers,
  overrides: Record<string, string>
): Headers {
  const headers = new Headers();
  const skipHeaders = new Set([
    "host",
    "cf-connecting-ip",
    "cf-ipcountry",
    "cf-ray",
    "cf-visitor",
    "cf-worker",
    "x-forwarded-for",
    "x-real-ip",
  ]);

  for (const [key, value] of original.entries()) {
    if (!skipHeaders.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  }

  for (const [key, value] of Object.entries(overrides)) {
    headers.set(key, value);
  }

  return headers;
}

/**
 * 从上游响应头中构造返回给客户端的响应头。
 * 移除一些不应透传的服务端头。
 */
function buildDownstreamHeaders(upstream: Headers): Headers {
  const headers = new Headers();
  const skipHeaders = new Set(["content-encoding", "transfer-encoding", "connection"]);

  for (const [key, value] of upstream.entries()) {
    if (!skipHeaders.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  }

  return headers;
}
