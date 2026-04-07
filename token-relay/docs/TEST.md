# Token Relay 测试说明

## 自动化（本地）

在 `token-relay/worker` 目录：

```bash
npm install
npm run type-check
node scripts/validate-patterns.mjs
```

`validate-patterns.mjs` 校验代理路径白名单正则（无需网络）。

---

## 本地手动联调

```bash
cd token-relay/worker
npm run dev
```

### 健康检查

```bash
curl -s http://127.0.0.1:8787/health
```

### 注册 relay token（示例，勿提交真实 Key）

```bash
curl -s -X POST http://127.0.0.1:8787/api/keys/submit ^
  -H "Content-Type: application/json" ^
  -d "{\"provider\":\"openai\",\"apiKey\":\"sk-test123456789012345678901234\"}"
```

（PowerShell 下请改用单引号 JSON 或文件：`curl.exe` / `Invoke-RestMethod`。）

### 代理（需有效 Key）

将返回的 `token` 填入：

```bash
curl -s http://127.0.0.1:8787/v1/models -H "Authorization: Bearer <token>"
```

真实调用上游需在 Cloudflare 环境配置可访问外网，且 Key 有效。

---

## 生产冒烟（部署后）

1. `GET https://relay.wordok.top/health`  
2. `POST /api/keys/submit` 用真实 Key（私密环境）  
3. 对 OpenAI 发一条最小 `chat/completions` 请求验证流式/非流式  

---

## 回归清单（发版前）

- [ ] `wrangler.toml` 中 KV id 非占位符  
- [ ] `tracker.ts` 联盟 URL 已替换  
- [ ] 主站 `PUBLIC_RELAY_URL` 与 Worker 域名一致  
- [ ] `npm run type-check` 通过  

---

*测试 Agent：以类型检查 + 脚本 + 手工 curl 为主；E2E 可在后续引入 `@cloudflare/vitest-pool-workers`。*
