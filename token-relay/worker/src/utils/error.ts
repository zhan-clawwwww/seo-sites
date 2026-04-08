export interface ApiError {
  error: {
    message: string;
    type: string;
    code: string | number;
  };
}

export function errorResponse(
  message: string,
  status: number,
  type = "api_error",
  code: string | number = status
): Response {
  const body: ApiError = { error: { message, type, code } };
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const Errors = {
  unauthorized: () =>
    errorResponse("Missing or invalid Authorization header", 401, "auth_error", "unauthorized"),

  forbidden: () =>
    errorResponse("Access denied", 403, "auth_error", "forbidden"),

  rateLimited: (_remaining: number) =>
    errorResponse(
      `Rate limit exceeded. Try again in a moment.`,
      429,
      "rate_limit_error",
      "rate_limit_exceeded"
    ),

  notFound: (path: string) =>
    errorResponse(`Route not found: ${path}`, 404, "not_found", "not_found"),

  badRequest: (msg: string) =>
    errorResponse(msg, 400, "invalid_request_error", "bad_request"),

  internal: (msg = "Internal server error") =>
    errorResponse(msg, 500, "api_error", "internal_error"),

  providerError: (status: number, msg: string) =>
    errorResponse(msg, status, "upstream_error", "upstream_error"),
};
