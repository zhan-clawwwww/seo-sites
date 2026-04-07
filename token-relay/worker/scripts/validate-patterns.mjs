/**
 * 校验代理路径白名单（无需启动 Worker）。
 */
import assert from "node:assert";

const ALLOWED_OPENAI_PATHS =
  /^\/(v1)\/(chat\/completions|completions|embeddings|models|images|audio|files|fine_tuning)/;

const ALLOWED_ANTHROPIC_PATHS = /^\/(v1)\/(messages|complete|models)/;

const ALLOWED_GEMINI_PATHS = /^\/(v1beta|v1)\/(models)/;

const openaiSamples = ["/v1/chat/completions", "/v1/embeddings", "/v1/models"];
for (const p of openaiSamples) {
  assert.ok(ALLOWED_OPENAI_PATHS.test(p), `OpenAI should allow ${p}`);
}
assert.ok(!ALLOWED_OPENAI_PATHS.test("/v1/foo/bar"), "OpenAI should reject unknown");

const anthropicSamples = ["/v1/messages", "/v1/models"];
for (const p of anthropicSamples) {
  assert.ok(ALLOWED_ANTHROPIC_PATHS.test(p), `Anthropic should allow ${p}`);
}

const geminiSamples = ["/v1beta/models/x", "/v1/models/x"];
for (const p of geminiSamples) {
  assert.ok(ALLOWED_GEMINI_PATHS.test(p), `Gemini should allow ${p}`);
}

console.log("validate-patterns: OK");
