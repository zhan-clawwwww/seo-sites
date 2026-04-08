# Token 中转站（wordok.top）

在 **不改动现有 Astro SEO 构建主路径** 的前提下，为同一品牌增加 **API 转发** 与 **推广落地能力**：静态介绍页走主站（`wordok.top/relay/`），转发逻辑在 **Cloudflare Workers** 子域名 `relay.wordok.top`。

---

## 目标与路径

| 目标 | 实现路径 |
|------|----------|
| 零月费运行 | Cloudflare Workers + KV 免费额度；GitHub Actions 部署 Worker（可选） |
| 与 SEO 站点隔离 | Worker 独立目录 `token-relay/worker/`；Astro 仅新增 `src/pages/relay/*` 静态页 |
| 用户自带 Key 转发 | `POST /api/keys/submit` → KV 存 `user:<token>`；请求带 `Bearer` 替换上游鉴权 |
| 流式/SSE | `fetch` 透传 `ReadableStream` |
| 推广 / 联盟 | `GET /api/ref/:code` 302 至 NordVPN 等链接；落地页与文档引导替换 `tracker.ts` 中占位 URL |
| 盈利补充 | 见 `docs/RESEARCH.md`（VPN Affiliate、Adsense、AI 工具联盟等） |

---

## 仓库结构

```
token-relay/
├── README.md           ← 本文件
├── docs/
│   ├── PLAN.md         ← 架构（规划 Agent）
│   ├── RESEARCH.md     ← 盈利调研（调研 Agent）
│   ├── API.md          ← HTTP 接口（实现 Agent）
│   ├── AUDIT.md        ← 安全审计（审计 Agent）
│   └── TEST.md         ← 测试说明（测试 Agent）
├── worker/             ← Wrangler 子项目（勿与根目录 npm 混用）
│   ├── wrangler.toml   ← 部署前填写 KV id、路由
│   └── src/
└── landing/            ← 源文件已并入主站 src/pages/relay/，见下方说明
```

主站落地页路径：**`src/pages/relay/`**（`index.astro`、`docs.astro`、`dashboard.astro`）。

---

## Agent 闭环（Markdown 协作）

| 角色 | 产出 | 下游 |
|------|------|------|
| 规划 | `docs/PLAN.md` | 实现 |
| 调研 | `docs/RESEARCH.md` | README 盈利章节、联盟链接策略 |
| 实现 | `worker/` + `src/pages/relay/` + `docs/API.md` | 审计、测试 |
| 审计 | `docs/AUDIT.md` | 实现修复、测试回归 |
| 测试 | `docs/TEST.md` + `worker/scripts/validate-patterns.mjs` | 发布前检查 |

---

## 部署速览

### 1. Cloudflare

1. 在账户中创建 KV Namespace：`RELAY_KV`  
2. 将 id 写入 `token-relay/worker/wrangler.toml`（`id` / `preview_id` / `env.production`）  
3. 确认域名 `wordok.top` 在 Cloudflare，并添加子域 `relay` 的 Workers 路由（与 `wrangler.toml` 中 `routes` 一致）

### 2. Worker

```bash
cd token-relay/worker
npm install
npm run dev          # 本地 http://127.0.0.1:8787
npm run deploy       # 或 deploy:prod
```

### 3. Astro 主站

根目录构建不变；可选环境变量：

- `PUBLIC_RELAY_URL=https://relay.wordok.top`（落地页 fetch 目标）

```bash
npm run build
```

### 4. GitHub Actions（Worker 单独工作流）

见 `.github/workflows/deploy-relay-worker.yml`。

**成功部署 Worker 需同时满足：**

1. 仓库 Secret：`CLOUDFLARE_API_TOKEN`（Cloudflare → 我的个人资料 → API 令牌，需含 Workers 编辑等权限）。
2. `token-relay/worker/wrangler.toml` 中 **KV id 已替换为真实值**，不得再含 `REPLACE_WITH_YOUR_*` 占位符。

若任一不满足，工作流会 **跳过 `wrangler deploy` 且仍为绿色成功**，避免 `npx wrangler` 报错导致整站流水线失败。准备就绪后 push 一次 `token-relay/worker/` 即可触发真实部署。

多 Cloudflare 账号时可在 `wrangler-action` 中增加 `accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}`。

---

## 合规与风险

- 用户须遵守 OpenAI / Anthropic / Google 服务条款；本仓库仅提供技术转发示例。  
- 大陆地区生成式人工智能合规请自行评估；落地页文案避免夸大与违规承诺。  
- **联盟链接**：将 `worker/src/referral/tracker.ts` 内 `REPLACE_YOUR_*` 替换为你审核通过的 affiliate URL。

---

## 相关链接

- [接口详情](./docs/API.md)  
- [架构方案](./docs/PLAN.md)  
- [盈利调研](./docs/RESEARCH.md)  
- [安全审计](./docs/AUDIT.md)  
- [测试说明](./docs/TEST.md)
