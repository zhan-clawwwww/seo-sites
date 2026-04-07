const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, anthropic-version, anthropic-beta, x-api-key",
  "Access-Control-Max-Age": "86400",
  "X-Robots-Tag": "noindex",
};

/** 处理 OPTIONS preflight 请求 */
export function handlePreflight(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

/** 为任意 Response 注入 CORS 头 */
export function withCors(response: Response): Response {
  const newHeaders = new Headers(response.headers);
  for (const [k, v] of Object.entries(CORS_HEADERS)) {
    newHeaders.set(k, v);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}
