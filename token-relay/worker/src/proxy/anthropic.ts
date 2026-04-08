import type { Env } from "../types.js";
import { Errors } from "../utils/error.js";

const ALLOWED_ANTHROPIC_PATHS = /^\/(v1)\/(messages|complete|models)/;

/**
 * 代理请求到 Anthropic Claude API。
 * 透传 anthropic-version 和 anthropic-beta 头。
 */
export async function proxyAnthropic(
  request: Request,
  userKey: string,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);

  // Anthropic 的路径可能以 /v1/messages 或 /messages 形式传入
  // 统一规范化为 /v1/messages
  let upstreamPath = url.pathname;
  if (!upstreamPath.startsWith("/v1/")) {
    upstreamPath = `/v1${upstreamPath}`;
  }

  if (!ALLOWED_ANTHROPIC_PATHS.test(upstreamPath)) {
    return Errors.notFound(url.pathname);
  }

  const upstreamUrl = `${env.ANTHROPIC_BASE}${upstreamPath}${url.search}`;

  const upstreamHeaders = buildAnthropicHeaders(request.headers, userKey);

  const upstreamReq = new Request(upstreamUrl, {
    method: request.method,
    headers: upstreamHeaders,
    body: request.method !== "GET" && request.method !== "HEAD" ? request.body : null,
    // @ts-ignore
    duplex: "half",
  });

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(upstreamReq);
  } catch {
    return Errors.internal("Failed to reach Anthropic API");
  }

  return new Response(upstreamRes.body, {
    status: upstreamRes.status,
    headers: buildDownstreamHeaders(upstreamRes.headers),
  });
}

// ─── 工具函数 ────────────────────────────────────────────────────

function buildAnthropicHeaders(original: Headers, apiKey: string): Headers {
  const headers = new Headers();
  const skipHeaders = new Set([
    "host",
    "authorization",
    "cf-connecting-ip",
    "cf-ipcountry",
    "cf-ray",
    "cf-visitor",
    "x-forwarded-for",
    "x-real-ip",
  ]);

  for (const [key, value] of original.entries()) {
    if (!skipHeaders.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  }

  // Anthropic 使用 x-api-key 而非 Authorization
  headers.set("x-api-key", apiKey);
  headers.set("Host", "api.anthropic.com");

  // 确保有 anthropic-version
  if (!headers.has("anthropic-version")) {
    headers.set("anthropic-version", "2023-06-01");
  }

  return headers;
}

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
