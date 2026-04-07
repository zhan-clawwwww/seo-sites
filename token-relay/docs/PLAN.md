# Token API 中转站 — 完整技术架构方案

> 项目域名：`wordok.top` | 中转服务子域名：`relay.wordok.top`
> 约束：完全 0 成本，不影响现有 Astro SEO 站点

---

## 一、项目目标

| 目标 | 说明 |
|------|------|
| API 代理转发 | 支持 OpenAI、Anthropic、Google Gemini 主流 AI API 透明代理 |
| Key 管理 | 用户提交自己的 API Key，系统存储并在转发时注入 |
| 速率限制 | 基于 IP / Token 防止滥用 |
| 推广分成 | 推广链接注册，推荐人按用量获得分成奖励 |
| 零成本运营 | 完全依赖 Cloudflare 免费额度，月均费用 $0 |

---

## 二、技术选型

### 2.1 核心技术栈

| 层次 | 技术 | 理由 |
|------|------|------|
| **代理后端** | Cloudflare Workers | 每天 100k 免费请求；边缘运行，全球低延迟；无服务器，零运维 |
| **KV 存储** | Cloudflare KV | 免费额度：100k 读/天，1k 写/天；存储用户 Key 映射、速率计数、推广关系 |
| **落地页** | 现有 Astro 项目 `/relay/` 路径 | 复用已有构建流程，无需新域名，SEO 友好 |
| **域名策略** | `relay.wordok.top` 子域名 | Worker 直接绑定，与 Astro 静态站完全隔离 |
| **CI/CD** | GitHub Actions + Wrangler CLI | 已有 `.github/` 目录，直接扩展 |

### 2.2 域名分离策略

```
wordok.top          → Cloudflare Pages（现有 Astro 静态站，不动）
relay.wordok.top    → Cloudflare Workers（新建中转服务，完全独立）
wordok.top/relay/   → Astro 落地页（介绍页 + 注册入口，静态生成）
```

这种分离确保：
- Astro 构建完全不感知 Worker 的存在
- `relay.wordok.top` 的 DNS 直接 CNAME 指向 Workers，与静态站 DNS 互不干扰

---

## 三、目录结构

```
token-relay/
├── docs/
│   ├── PLAN.md                  # 本文件：架构方案
│   └── API.md                   # API 接口文档
│
├── worker/                      # Cloudflare Worker 源码（独立 npm 项目）
│   ├── package.json
│   ├── wrangler.toml            # Wrangler 配置（KV 绑定、路由、环境变量）
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts             # Worker 入口，路由分发
│       ├── router.ts            # URL 路由表
│       ├── proxy/
│       │   ├── openai.ts        # OpenAI API 代理（/v1/*）
│       │   ├── anthropic.ts     # Anthropic Claude 代理（/claude/*）
│       │   └── gemini.ts        # Google Gemini 代理（/gemini/*）
│       ├── auth/
│       │   ├── keyManager.ts    # 用户 Key 存取（KV）
│       │   └── tokenValidator.ts# 请求 Token 校验
│       ├── ratelimit/
│       │   └── limiter.ts       # 基于 IP + Token 的速率限制（KV 计数器）
│       ├── referral/
│       │   ├── tracker.ts       # 推广链接点击追踪
│       │   └── rewards.ts       # 分成计算逻辑
│       └── utils/
│           ├── cors.ts          # CORS 响应头注入
│           └── error.ts         # 统一错误响应格式
│
└── landing/                     # Astro 落地页（放入主项目 src/pages/relay/）
    ├── index.astro              # 中转站介绍主页
    ├── docs.astro               # API 使用文档
    ├── dashboard.astro          # 用户仪表盘（客户端渲染，调用 Worker API）
    └── referral.astro           # 推广页面
```

> `landing/` 中的 `.astro` 文件需复制/软链接到主项目的 `src/pages/relay/` 目录下，随 Astro 一同静态构建输出。

---

## 四、请求流程图

### 4.1 API 代理转发流程

```
用户应用
   │
   │  POST relay.wordok.top/v1/chat/completions
   │  Authorization: Bearer <relay-token>
   ▼
┌─────────────────────────────────────────────────┐
│              Cloudflare Workers                  │
│                                                  │
│  1. 解析 relay-token                            │
│  2. 速率限制检查（KV 计数器）                    │
│  3. 从 KV 读取用户真实 API Key                  │
│  4. 替换 Authorization 头                        │
│  5. 转发请求至上游 API                           │
│  6. 流式透传响应（SSE）                          │
└──────────────┬──────────────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
 api.openai.com   api.anthropic.com
 (OpenAI)         (Anthropic)
```

### 4.2 用户 Key 注册流程

```
用户浏览器
   │
   │  访问 wordok.top/relay/（Astro 静态落地页）
   ▼
┌─────────────────────────────────┐
│    Astro 静态落地页              │
│    wordok.top/relay/            │
│    (Cloudflare Pages 托管)      │
└──────────────┬──────────────────┘
               │  JS fetch() 调用
               │  POST relay.wordok.top/api/keys
               ▼
┌─────────────────────────────────┐
│       Cloudflare Workers        │
│  - 验证用户 email/Token          │
│  - 将 API Key 写入 KV           │
│  - 返回 relay-token             │
└──────────────┬──────────────────┘
               │
               ▼
         Cloudflare KV
    ┌─────────────────────┐
    │ relay:<token> →     │
    │  {                  │
    │    openaiKey: "...",│
    │    plan: "free",    │
    │    referredBy: "...",│
    │    usage: { ... }   │
    │  }                  │
    └─────────────────────┘
```

### 4.3 推广链接流程

```
推广者分享链接：wordok.top/relay/?ref=PROMO_CODE
         │
         ▼
  新用户注册时携带 ref 参数
         │
         ▼
  Worker 在 KV 中记录推荐关系
  referral:<promo_code>:referred[] += newUserId
         │
         ▼
  新用户每次 API 调用时
  Worker 累加推荐人的 reward_tokens
         │
         ▼
  推荐人在 dashboard 查看收益
  可兑换为免费额度或提现
```

---

## 五、核心模块实现要点

### 5.1 `wrangler.toml` 配置

```toml
name = "wordok-relay"
main = "src/index.ts"
compatibility_date = "2024-01-01"

# 绑定到子域名
routes = [
  { pattern = "relay.wordok.top/*", zone_name = "wordok.top" }
]

[[kv_namespaces]]
binding = "RELAY_KV"
id = "xxxxxxxxxxxx"          # 生产环境 KV namespace ID
preview_id = "yyyyyyyyyyyy"  # 开发环境 KV namespace ID

[vars]
OPENAI_BASE = "https://api.openai.com"
ANTHROPIC_BASE = "https://api.anthropic.com"
GEMINI_BASE = "https://generativelanguage.googleapis.com"
RATE_LIMIT_PER_MIN = "20"

[env.production]
vars = { ENVIRONMENT = "production" }
```

### 5.2 速率限制实现（基于 KV 滑动窗口）

```typescript
// ratelimit/limiter.ts
export async function checkRateLimit(
  kv: KVNamespace,
  key: string,         // `ratelimit:<ip>` 或 `ratelimit:<token>`
  limitPerMin: number
): Promise<{ allowed: boolean; remaining: number }> {
  const now = Date.now();
  const windowStart = now - 60_000;
  const record = await kv.get(key, "json") as number[] | null;
  const timestamps = (record ?? []).filter(t => t > windowStart);

  if (timestamps.length >= limitPerMin) {
    return { allowed: false, remaining: 0 };
  }

  timestamps.push(now);
  // TTL 设为 65s，自动过期
  await kv.put(key, JSON.stringify(timestamps), { expirationTtl: 65 });
  return { allowed: true, remaining: limitPerMin - timestamps.length };
}
```

### 5.3 透明流式代理（SSE 支持）

```typescript
// proxy/openai.ts
export async function proxyOpenAI(
  request: Request,
  userKey: string,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const upstreamUrl = `${env.OPENAI_BASE}${url.pathname}${url.search}`;

  const upstreamReq = new Request(upstreamUrl, {
    method: request.method,
    headers: {
      ...Object.fromEntries(request.headers),
      "Authorization": `Bearer ${userKey}`,  // 替换为用户真实 Key
      "Host": "api.openai.com",
    },
    body: request.body,
    // 关键：透传流式响应
    // @ts-ignore
    duplex: "half",
  });

  return fetch(upstreamReq);  // Workers 原生支持流式透传
}
```

---

## 六、免费额度规划

### 6.1 Cloudflare 免费额度

| 资源 | 免费额度 | 说明 |
|------|----------|------|
| Workers 请求 | **100,000 次/天** | 超出按 $0.50/百万次计费 |
| Workers CPU 时间 | 10ms/请求（免费版） | 代理请求主要是网络 IO，CPU 消耗极低 |
| KV 读取 | **100,000 次/天** | 每次 API 调用读 1 次 Key = 1 次 KV 读 |
| KV 写入 | **1,000 次/天** | 仅 Key 注册、速率计数写入 |
| KV 存储 | 1 GB | Key 数据极小，可支撑数十万用户 |
| Pages 部署 | 500 次/月 | Astro 落地页构建 |

### 6.2 可支撑用户规模估算

**场景假设：**
- 平均每用户每天发起 **5 次 API 请求**
- 每次请求触发：1 次 Workers 调用 + 1 次 KV 读（取用户 Key）+ 1 次 KV 写（速率计数）

| 指标 | 免费额度 | 对应用户数 |
|------|----------|-----------|
| Workers 请求限制（100k/天） | ÷ 5 请求/用户/天 | **~20,000 活跃用户/天** |
| KV 读取限制（100k/天） | ÷ 5 次/用户/天 | **~20,000 活跃用户/天** |
| KV 写入限制（1k/天） | 速率计数合并写入 | 支撑 1000 用户/天活跃 |

> **结论：** 免费额度可轻松支撑 **1,000～5,000 日活用户**。  
> KV 写入是瓶颈，优化方案：速率计数改用 Durable Objects（免费版有限制）或延迟批量写入。

### 6.3 扩容路径（仍低成本）

```
免费版（0 USD/月）  →  Workers Paid（$5/月）  →  Enterprise
  ~1k DAU              ~500k DAU                无限
```

---

## 七、与现有 SEO 站点的隔离方案

### 7.1 构建隔离

| 维度 | 现有 SEO 站点 | Token 中转站 |
|------|--------------|-------------|
| 代码位置 | `src/`, `sites/`, `public/` | `token-relay/worker/`（完全独立 npm 项目） |
| 构建命令 | `astro build` | `wrangler deploy`（独立执行） |
| 部署目标 | Cloudflare Pages | Cloudflare Workers |
| DNS | `wordok.top` A/CNAME → Pages | `relay.wordok.top` CNAME → Workers |
| `package.json` | 主项目依赖，不变 | `token-relay/worker/package.json`，独立 |

### 7.2 SEO 隔离

- Worker 运行在 `relay.wordok.top`，**完全不在 Astro 构建输出中**
- Astro 落地页（`src/pages/relay/`）是普通静态页面，正常参与 SEO 索引
- 在 `robots.txt` 中可选择屏蔽 `/relay/dashboard`（用户仪表盘，无 SEO 价值）：

```
User-agent: *
Disallow: /relay/dashboard/
```

- `relay.wordok.top` 的 Worker 路由设置 `X-Robots-Tag: noindex` 响应头，避免 API 端点被抓取

### 7.3 GitHub Actions 工作流隔离

```yaml
# .github/workflows/deploy-worker.yml（新增，独立工作流）
name: Deploy Relay Worker
on:
  push:
    paths:
      - "token-relay/worker/**"   # 只在 worker 代码变更时触发
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          workingDirectory: token-relay/worker

# 现有 Astro 构建工作流完全不修改
```

---

## 八、部署步骤概述

### 步骤 1：Cloudflare 准备

```bash
# 1. 登录 Cloudflare，确认 wordok.top 域名在 Cloudflare 管理
# 2. 创建 KV Namespace
npx wrangler kv:namespace create "RELAY_KV"
npx wrangler kv:namespace create "RELAY_KV" --preview

# 3. 将返回的 ID 填入 wrangler.toml
```

### 步骤 2：Worker 本地开发

```bash
cd token-relay/worker
npm install
npm run dev          # wrangler dev，本地 http://localhost:8787
```

### 步骤 3：部署 Worker

```bash
npx wrangler deploy  # 部署到 relay.wordok.top
```

### 步骤 4：DNS 配置

在 Cloudflare DNS 面板添加：

```
CNAME  relay  →  relay.wordok.top.cdn.cloudflare.net  (Proxied)
```

Workers 路由绑定到 `relay.wordok.top/*`，自动生效。

### 步骤 5：落地页集成

```bash
# 将 token-relay/landing/ 中的 .astro 页面移入主项目
cp -r token-relay/landing/*.astro src/pages/relay/

# 重新构建 Astro 站点（落地页随之发布）
npm run build
```

### 步骤 6：环境变量配置

```bash
# 在 Cloudflare Workers 面板设置 Secret（不写入 wrangler.toml）
npx wrangler secret put JWT_SECRET
npx wrangler secret put ADMIN_TOKEN
```

---

## 九、后续迭代规划

| 阶段 | 功能 | 优先级 |
|------|------|--------|
| MVP | OpenAI 代理 + Key 存储 + 基础速率限制 | P0 |
| v1.1 | Anthropic / Gemini 代理 + 用法统计 | P1 |
| v1.2 | 落地页 Dashboard（用量图表） | P1 |
| v1.3 | 推广分成系统 | P2 |
| v2.0 | 多租户 Plan 管理（免费/Pro 分层） | P2 |

---

*最后更新：2026-04-07*
