# Token Relay HTTP API

基础地址（生产）：`https://relay.wordok.top`  
本地开发：`http://127.0.0.1:8787`（`wrangler dev`）

所有 JSON 响应均带 `Access-Control-Allow-Origin: *`（浏览器直连可用）。

---

## 公开端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/health` | 健康检查 |
| GET | `/api/stats` | 累计请求数、用户数（粗略） |
| GET | `/v1/models` | OpenAI 兼容模型列表（内置静态列表） |
| POST | `/api/keys/submit` | 提交上游 API Key，获得 relay token |
| GET | `/api/ref/:code` | 记录点击并 302 跳转联盟链接；`?target=nordvpn` 等 |

---

## 需鉴权（`Authorization: Bearer <relay-token>`）

| 方法 | 路径 | 说明 |
|------|------|------|
| 任意 | `/v1/*`（OpenAI 白名单路径） | `provider=openai` 时 |
| 任意 | `/v1/messages`、`/messages` | `provider=anthropic` 时 |
| 任意 | `/gemini/*` | `provider=gemini` 时 |
| POST | `/api/ref/create` | 创建或返回已有推广码 |
| GET | `/api/ref/stats` | 推广点击 / 转化 |

速率限制：每 IP 约 60 次/分钟；每 relay token 默认 20 次/分钟（`RATE_LIMIT_PER_MIN`）。

---

## 注册 Body 示例

```json
{
  "provider": "openai",
  "apiKey": "sk-...",
  "refCode": "ABC123"
}
```

成功返回 `201`，Body 含 `token`、`endpoint`。

---

## 上游路径约定

- **OpenAI**：`/v1/chat/completions`、`/v1/embeddings` 等（见 Worker 白名单正则）。
- **Anthropic**：请求 Host 为 relay，路径为 `/v1/messages`；Worker 注入 `x-api-key`。
- **Gemini**：路径为 `/gemini/v1beta/models/...`（`/gemini/` 后接官方路径）。

---

## 错误格式

```json
{
  "error": {
    "message": "…",
    "type": "api_error",
    "code": "…"
  }
}
```

---

*与 `docs/PLAN.md` 架构一致；实现以 `worker/src` 为准。*
