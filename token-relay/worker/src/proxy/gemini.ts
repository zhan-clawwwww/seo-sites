import type { Env } from "../types.js";
import { Errors } from "../utils/error.js";

const ALLOWED_GEMINI_PATHS = /^\/(v1beta|v1)\/(models)/;

/**
 * 代理请求到 Google Gemini API。
 * Gemini 使用 URL query param ?key=API_KEY 进行鉴权。
 */
export async function proxyGemini(
  request: Request,
  userKey: string,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);

  // Gemini 路径前缀：/gemini/<rest> → /<rest>（rest 通常为 v1beta/... 或 v1/...）
  let upstreamPath = url.pathname;
  if (upstreamPath.startsWith("/gemini/")) {
    const rest = upstreamPath.slice("/gemini/".length);
    upstreamPath = rest.startsWith("/") ? rest : `/${rest}`;
  }

  if (!ALLOWED_GEMINI_PATHS.test(upstreamPath)) {
    return Errors.notFound(url.pathname);
  }

  // 注入 API Key 到 query string
  const upstreamSearchParams = new URLSearchParams(url.search);
  upstreamSearchParams.set("key", userKey);

  const upstreamUrl = `${env.GEMINI_BASE}${upstreamPath}?${upstreamSearchParams.toString()}`;

  const upstreamHeaders = buildGeminiHeaders(request.headers);

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
    return Errors.internal("Failed to reach Gemini API");
  }

  return new Response(upstreamRes.body, {
    status: upstreamRes.status,
    headers: buildDownstreamHeaders(upstreamRes.headers),
  });
}

// ─── 工具函数 ────────────────────────────────────────────────────

function buildGeminiHeaders(original: Headers): Headers {
  const headers = new Headers();
  const skipHeaders = new Set([
    "host",
    "authorization",
    "x-api-key",
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

  headers.set("Host", "generativelanguage.googleapis.com");
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
