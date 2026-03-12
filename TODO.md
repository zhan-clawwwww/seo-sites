# Best USA VPN — 项目操作手册与待办清单

> 域名：**wordok.top** | 部署平台：**GitHub Pages（免费）**
> 
> 最后更新：2026-03-12

---

## 目录

1. [项目是什么](#1-项目是什么)
2. [文件结构说明](#2-文件结构说明)
3. [本地开发命令](#3-本地开发命令)
4. [网站内容在哪里](#4-网站内容在哪里)
5. [如何上线到 GitHub Pages](#5-如何上线到-github-pages)
6. [DNS 配置（火山引擎）](#6-dns-配置火山引擎)
7. [上线后必做事项](#7-上线后必做事项)
8. [变现配置（联盟 + AdSense）](#8-变现配置联盟--adsense)
9. [日常维护](#9-日常维护)
10. [待办清单](#10-待办清单)

---

## 1. 项目是什么

这是一个用 **Astro** 框架搭建的 **VPN 评测 SEO 站**，主要特点：

- **纯静态输出**：构建后都是 `.html` 文件，托管在 GitHub Pages 完全免费
- **88 篇英文 VPN 文章**，覆盖高搜索量关键词（best vpn usa、vpn for netflix 等）
- **联盟营销变现**：每篇文章嵌入 NordVPN / ExpressVPN / Surfshark 推荐框（点击跳转联盟链接）
- **完整 SEO 配置**：自动生成 sitemap、RSS、robots.txt、JSON-LD 结构化数据

**最终网站访问地址：**
```
https://wordok.top/vpn-usa/
```

---

## 2. 文件结构说明

```
seo-sites/
│
├── sites/                    ← 【网站内容区】所有文章和配置都在这里
│   ├── vpn-usa/              ← 正在使用的站点（wordok.top）
│   │   ├── config.json       ← 站点配置（域名、联盟链接、Analytics ID 等）
│   │   └── posts/            ← 88 篇文章（.md 格式）
│   ├── site-a/               ← 备用站点（SEO 技术文章，暂未上线）
│   └── site-b/               ← 备用站点（空，待开发）
│
├── src/                      ← 【框架代码区】一般不需要改动
│   ├── pages/                ← 页面模板（自动生成）
│   ├── layouts/BaseLayout.astro  ← 全局布局（导航、Footer、CSS、广告位）
│   └── lib/                  ← 工具函数
│
├── public/                   ← 静态资源（图片、favicon、CNAME）
│   ├── CNAME                 ← 自定义域名配置（已填 wordok.top）
│   └── og-default.png        ← 分享图片
│
├── scripts/                  ← 工具脚本
│   ├── rewrite-vpn-english.mjs   ← 批量重写文章为英文
│   └── submit-indexnow.mjs       ← 上线后提交给搜索引擎快速收录
│
├── .github/workflows/deploy.yml  ← GitHub Actions 自动部署配置
├── astro.config.mjs          ← Astro 框架配置（一般不改）
└── package.json              ← 项目脚本命令
```

---

## 3. 本地开发命令

### 安装依赖（首次）
```powershell
cd "d:\code\seo-sites"
npm install
```

### 启动本地预览（开发模式）
```powershell
$env:ENABLED_SITES="vpn-usa"
npm run dev
```
浏览器打开 → `http://localhost:4321/vpn-usa/`

> 实时热更新：修改文章后浏览器自动刷新

### 构建静态文件（上线前检查）
```powershell
$env:ENABLED_SITES="vpn-usa"
npm run build:no-search
```
构建结果在 `dist/` 文件夹，共约 96 个页面。

### 构建 + 搜索索引（完整构建，GitHub Actions 会自动执行）
```powershell
$env:ENABLED_SITES="vpn-usa"
npm run build
```

### 预览构建结果
```powershell
npm run preview
```
浏览器打开 → `http://localhost:4321/`（会自动跳转到 `/vpn-usa/`）

---

## 4. 网站内容在哪里

### 文章（最重要）
路径：`sites/vpn-usa/posts/*.md`

每篇文章是一个 `.md` 文件，格式如下：

```markdown
---
title: "Best VPN for USA in 2025"     ← 文章标题（SEO 很重要）
description: "Expert review..."        ← 描述（显示在 Google 搜索结果中）
keywords: ["best vpn usa 2025"]        ← 关键词
pubDate: "2025-12-15"                  ← 发布日期
updatedDate: "2026-03-12"             ← 更新日期（有利于 Google 重新收录）
author: "vpn-expert"                   ← 作者（对应 src/lib/authors.ts）
faq:                                   ← FAQ（会生成 FAQ 结构化数据，有利于搜索）
  - question: "Which VPN is best?"
    answer: "NordVPN is our top pick..."
---

文章正文（Markdown 格式）
```

### 站点配置
路径：`sites/vpn-usa/config.json`

```json
{
  "baseUrl": "https://wordok.top",       ← 域名（已设置）
  "analytics": {
    "ga4Id": "",                         ← ← 填你的 Google Analytics ID
    "cfBeacon": ""                       ← Cloudflare Analytics（可选）
  },
  "adsense": {
    "publisherId": "",                   ← ← 填你的 AdSense ID
    "adSlot": ""                         ← ← 填广告位 ID
  },
  "affiliates": [                        ← 联盟产品列表（已配置 4 个）
    {
      "name": "NordVPN",
      "url": "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=REPLACE_YOUR_AFF_ID",
      ...                                ← ← 把 REPLACE_YOUR_AFF_ID 替换成真实联盟 ID
    }
  ]
}
```

### 作者信息
路径：`src/lib/authors.ts`（影响 Google E-E-A-T 权重）

---

## 5. 如何上线到 GitHub Pages

### 前提：你需要有 GitHub 账号
没有账号先注册：https://github.com/signup

### 第一步：在 GitHub 创建仓库

1. 打开：https://github.com/new
2. Repository name：填 `seo-sites`
3. **Visibility 选 Public**（免费 Pages 必须公开）
4. **不要**勾选任何初始化选项
5. 点击 **Create repository**

### 第二步：在终端推送代码

**把 `你的用户名` 替换为你的 GitHub 用户名后执行：**
```powershell
cd "d:\code\seo-sites"
git remote add origin https://github.com/你的用户名/seo-sites.git
git branch -M main
git push -u origin main
```

推送时会弹出 GitHub 登录窗口，按提示授权即可。

### 第三步：开启 GitHub Pages

1. 打开仓库页面：`https://github.com/你的用户名/seo-sites`
2. 点击顶部 **Settings** 标签
3. 左侧菜单点击 **Pages**
4. Source 选择 **GitHub Actions**
5. 等待约 3-5 分钟，GitHub Actions 自动构建并部署

### 第四步：绑定自定义域名

还是在 Settings → Pages 页面：
- Custom domain 填入：`wordok.top`
- 勾选 **Enforce HTTPS**
- 点击 Save

### 之后每次更新内容如何重新部署？

只需要：
```powershell
git add -A
git commit -m "update: 更新文章内容"
git push
```

GitHub Actions 会自动检测到 push，自动构建，约 3-5 分钟后网站更新。

---

## 6. DNS 配置（火山引擎）

### 进入 DNS 管理界面

1. 登录 https://console.volcengine.com
2. 顶部搜索「DNS」或进入「**域名与网站**」→「**云解析 DNS**」
3. 找到 `wordok.top`，点击「**解析设置**」

### 添加以下 5 条记录

**第 1-4 条（让 wordok.top 指向 GitHub）：**

| 记录类型 | 主机记录 | 记录值 | TTL |
|---------|---------|--------|-----|
| A | `@` | `185.199.108.153` | 300 |
| A | `@` | `185.199.109.153` | 300 |
| A | `@` | `185.199.110.153` | 300 |
| A | `@` | `185.199.111.153` | 300 |

**第 5 条（让 www.wordok.top 也可以访问）：**

| 记录类型 | 主机记录 | 记录值 | TTL |
|---------|---------|--------|-----|
| CNAME | `www` | `你的GitHub用户名.github.io` | 300 |

> ⚠️ 第 5 条的记录值要替换成你真实的 GitHub 用户名，例如 `johndoe.github.io`

### DNS 验证

添加完成后约 5-30 分钟生效，用以下网站检查：
- https://dnschecker.org/#A/wordok.top（应该显示 4 个 GitHub IP）

---

## 7. 上线后必做事项

### Google Search Console（GSC）— 让 Google 快速收录

1. 打开：https://search.google.com/search-console/welcome
2. 选「**网域**」，输入 `wordok.top`，点击「继续」
3. 复制 TXT 记录值
4. 在火山引擎 DNS 添加一条 TXT 记录：
   - 类型：TXT，主机记录：`@`，记录值：Google 给的那串字符
5. 回到 GSC 点击「验证」
6. 验证成功后，左侧「**Sitemap**」→ 添加：`https://wordok.top/vpn-usa/sitemap.xml`
7. 等 Google 处理，通常 1-7 天开始收录

### 手动请求优先收录首页和核心文章

在 GSC 上方搜索框逐条输入以下 URL，点击「**请求编入索引**」：
```
https://wordok.top/vpn-usa/
https://wordok.top/vpn-usa/posts/best-vpn-usa-2025/
https://wordok.top/vpn-usa/posts/usa-vpn-for-netflix/
https://wordok.top/vpn-usa/posts/best-vpn-usa-speed/
https://wordok.top/vpn-usa/posts/cheap-vpn-usa/
```

每天最多请求 10 条，优先选核心关键词文章。

---

## 8. 变现配置（联盟 + AdSense）

### 联盟营销（推荐优先，佣金高）

**注册步骤（每个 VPN 品牌单独申请）：**

| VPN 品牌 | 申请地址 | 佣金参考 |
|---------|---------|---------|
| NordVPN | https://affiliates.nordvpn.com | $30-100/单 |
| ExpressVPN | https://www.expressvpn.com/affiliates | 按月分成 |
| Surfshark | https://surfshark.com/affiliates | 40%+ 分成 |
| CyberGhost | https://www.cyberghostvpn.com/affiliates | $35-70/单 |

**申请通过后，修改 `sites/vpn-usa/config.json`：**
```json
"affiliates": [
  {
    "name": "NordVPN",
    "url": "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=你的真实ID"
  }
]
```
修改后执行 `git add -A && git commit -m "update affiliate links" && git push` 即可自动部署。

### Google AdSense（展示广告）

1. 申请：https://www.google.com/adsense/start/
2. 需要网站已有内容，Google 审核通常 1-2 周
3. 通过后在 AdSense 后台创建广告单元，获取 Publisher ID（格式 `ca-pub-XXXXXXXX`）和 Ad Slot
4. 填入 `sites/vpn-usa/config.json`：
```json
"adsense": {
  "publisherId": "ca-pub-你的ID",
  "adSlot": "你的广告位ID"
}
```
5. 推送代码后自动部署，文章底部自动显示广告

---

## 9. 日常维护

### 每次修改文章后部署
```powershell
cd "d:\code\seo-sites"
git add -A
git commit -m "update: 简述改了什么"
git push
```

### 新增文章
在 `sites/vpn-usa/posts/` 目录下新建 `.md` 文件，按照现有文章格式填写 frontmatter 和正文，然后推送即可。

### 更新文章发布节奏（控制 Google 收录速度）
```powershell
node scripts/update-index-schedule.mjs
```

### 上线后提交给 Bing/Yandex 快速收录
先在 `scripts/submit-indexnow.mjs` 中填入 IndexNow Key，然后：
```powershell
npm run submit:indexnow:vpn
```

---

## 10. 待办清单

### 🔴 上线前必须完成

- [ ] **创建 GitHub 仓库并推送代码**（见第 5 节）
  ```powershell
  git remote add origin https://github.com/你的用户名/seo-sites.git
  git push -u origin main
  ```
- [ ] **GitHub Pages 开启并绑定 wordok.top**（见第 5 节第 3、4 步）
- [ ] **火山引擎 DNS 添加 5 条记录**（见第 6 节）
- [ ] **在 GitHub Pages 设置中填入 Custom Domain: wordok.top**

### 🟡 上线后第一周

- [ ] **Google Search Console 验证域名**（见第 7 节）
- [ ] **提交 Sitemap 到 GSC**：`https://wordok.top/vpn-usa/sitemap.xml`
- [ ] **手动请求收录首页和 5 篇核心文章**
- [ ] **注册 NordVPN 联盟**：https://affiliates.nordvpn.com
- [ ] **注册 ExpressVPN 联盟**：https://www.expressvpn.com/affiliates
- [ ] **把真实联盟链接填入 config.json 并推送**
- [ ] **申请 Google Analytics GA4**，填入 `analytics.ga4Id`
- [ ] **申请 Google AdSense**：https://www.google.com/adsense/start/

### 🟢 上线后持续执行

- [ ] 每周发布 1-2 篇新文章（参考关键词：`best vpn [city] 2025`、`vpn for [service]`）
- [ ] 每月更新旧文章的 `updatedDate` 字段，让 Google 重新抓取
- [ ] 每月检查 GSC「覆盖率报告」，修复索引错误
- [ ] 每季度在 GSC 查看哪些文章有排名，重点优化这些文章
- [ ] 建立外链：在 Reddit（r/vpn）、Quora 等平台发布有价值的内容并附链接

---

## 快速参考

### 所有可用命令

| 命令 | 用途 |
|------|------|
| `npm run dev` | 本地开发预览（需先设置 `$env:ENABLED_SITES="vpn-usa"`） |
| `npm run build` | 完整构建（含搜索索引） |
| `npm run build:no-search` | 快速构建（不含搜索） |
| `npm run preview` | 预览构建结果 |
| `git push` | 推送代码，自动触发 GitHub Actions 部署 |
| `npm run submit:indexnow:vpn` | 通知搜索引擎爬取所有 URL |

### 关键文件速查

| 文件 | 作用 |
|------|------|
| `sites/vpn-usa/config.json` | **最常改**：域名、GA4、AdSense、联盟链接 |
| `sites/vpn-usa/posts/*.md` | **网站文章内容** |
| `public/CNAME` | 自定义域名（已填 wordok.top，勿修改） |
| `.github/workflows/deploy.yml` | 自动部署配置（无需修改） |
| `src/layouts/BaseLayout.astro` | 全局布局，含导航/Footer/广告位样式 |

### 网站上线后的页面地址

| 页面 | 地址 |
|------|------|
| 首页 | `https://wordok.top/vpn-usa/` |
| 文章列表 | `https://wordok.top/vpn-usa/posts/` |
| 关于我们 | `https://wordok.top/vpn-usa/about/` |
| 联系 | `https://wordok.top/vpn-usa/contact/` |
| 联盟披露 | `https://wordok.top/vpn-usa/disclosure/` |
| Sitemap | `https://wordok.top/vpn-usa/sitemap.xml` |
| RSS 订阅 | `https://wordok.top/vpn-usa/rss.xml` |
