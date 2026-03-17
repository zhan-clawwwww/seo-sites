# Best USA VPN — 操作手册与待办清单

> 域名：**wordok.top** | 部署平台：**GitHub Pages（免费）**
>
> 最后更新：2026-03-17

---

## 目录

1. [项目是什么](#1-项目是什么)
2. [文件结构说明](#2-文件结构说明)
3. [本地开发命令](#3-本地开发命令)
4. [如何上线到 GitHub Pages](#4-如何上线到-github-pages)
5. [DNS 配置（火山引擎）](#5-dns-配置火山引擎)
6. [上线后必做事项](#6-上线后必做事项)
7. [变现配置（联盟 + AdSense）](#7-变现配置联盟--adsense)
8. [日常维护](#8-日常维护)
9. [待办清单（按优先级）](#9-待办清单按优先级)

---

## 1. 项目是什么

用 **Astro** 框架搭建的 **VPN 评测 SEO 站**，主要特点：

- **纯静态输出**：构建后都是 `.html` 文件，托管在 GitHub Pages 完全免费
- **88 篇英文 VPN 文章**，覆盖高搜索量关键词（best vpn usa、vpn for netflix 等）
- **联盟营销变现**：每篇文章嵌入 NordVPN / ExpressVPN / Surfshark 推荐框
- **完整 SEO 配置**：自动生成 sitemap、RSS、robots.txt、JSON-LD 结构化数据、FAQ 结构化数据

**目标网站地址：**
```
https://wordok.top/vpn-usa/
```

---

## 2. 文件结构说明

```
seo-sites/
│
├── sites/
│   ├── vpn-usa/              ← 主站（wordok.top/vpn-usa/）
│   │   ├── config.json       ← ⭐ 最常改：域名、联盟链接、GA4、AdSense
│   │   ├── index-schedule.json ← 文章发布节奏（当前 strategy=all，全量上线）
│   │   └── posts/            ← 88 篇英文文章
│   └── site-a/               ← 备用站（SEO技术文章，暂未上线）
│
├── src/                      ← 框架代码（一般不改）
├── scripts/
│   ├── rewrite-vpn-english.mjs   ← 批量重写/新增文章
│   ├── submit-indexnow.mjs        ← 提交给搜索引擎快速收录
│   └── update-index-schedule.mjs  ← 管理文章放出节奏
│
├── public/
│   └── CNAME                ← 已填 wordok.top，勿改
│
└── .github/workflows/deploy.yml  ← 推送 main 分支自动部署
```

---

## 3. 本地开发命令

```powershell
# 安装依赖（首次）
cd "d:\code\seo-sites"
npm install

# 启动本地预览
$env:ENABLED_SITES="vpn-usa"
npm run dev
# 浏览器打开 http://localhost:4321/vpn-usa/

# 构建静态文件（检查是否有错误）
$env:ENABLED_SITES="vpn-usa"
npm run build:no-search

# 完整构建（含搜索索引）
$env:ENABLED_SITES="vpn-usa"
npm run build
```

---

## 4. 如何上线到 GitHub Pages

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
git push -u origin main
```

### 第三步：开启 GitHub Pages

1. 打开仓库：`https://github.com/你的用户名/seo-sites`
2. 点击 **Settings** → 左侧 **Pages**
3. Source 选择 **GitHub Actions**
4. 等待 3-5 分钟，GitHub Actions 自动构建部署

### 第四步：绑定自定义域名

在 Settings → Pages 页面：
- Custom domain 填入：`wordok.top`
- 勾选 **Enforce HTTPS**
- 点击 Save

### 之后每次更新内容

```powershell
git add -A
git commit -m "update: 描述改了什么"
git push
```

GitHub Actions 自动检测 push，3-5 分钟后网站更新。

---

## 5. DNS 配置（火山引擎）

1. 登录 https://console.volcengine.com
2. 进入「域名与网站」→「云解析 DNS」→ 找到 `wordok.top` → 点击「解析设置」

**添加以下 5 条记录：**

| 记录类型 | 主机记录 | 记录值 | TTL |
|---------|---------|--------|-----|
| A | `@` | `185.199.108.153` | 300 |
| A | `@` | `185.199.109.153` | 300 |
| A | `@` | `185.199.110.153` | 300 |
| A | `@` | `185.199.111.153` | 300 |
| CNAME | `www` | `你的GitHub用户名.github.io` | 300 |

DNS 添加后约 5-30 分钟生效，用 https://dnschecker.org/#A/wordok.top 检查。

---

## 6. 上线后必做事项

### Google Analytics GA4（免费，追踪流量）

1. 打开：https://analytics.google.com/
2. 创建账号 → 创建媒体资源 → 选「网络」
3. 获取 Measurement ID（格式：`G-XXXXXXXXXX`）
4. 填入 `sites/vpn-usa/config.json`：
   ```json
   "analytics": { "ga4Id": "G-XXXXXXXXXX" }
   ```
5. 推送代码即生效

### Google Search Console（免费，提交收录）

1. 打开：https://search.google.com/search-console/welcome
2. 选「网域」，输入 `wordok.top`，点击「继续」
3. 复制 TXT 记录值
4. 在火山引擎 DNS 添加 TXT 记录：类型 TXT，主机记录 `@`，值为 Google 给的字符串
5. 回到 GSC 点击「验证」
6. 验证成功后：左侧「Sitemap」→ 添加 `https://wordok.top/vpn-usa/sitemap.xml`

### 手动请求优先收录（在 GSC 搜索框逐条输入）

```
https://wordok.top/vpn-usa/
https://wordok.top/vpn-usa/posts/best-vpn-usa-2025/
https://wordok.top/vpn-usa/posts/usa-vpn-for-netflix/
https://wordok.top/vpn-usa/posts/cheap-vpn-usa/
https://wordok.top/vpn-usa/posts/best-vpn-for-usa-streaming/
https://wordok.top/vpn-usa/posts/fastest-vpn-usa-server/
```

每天最多请求 10 条。

### IndexNow（免费，让 Bing 快速收录）

1. 在 https://www.bing.com/indexnow 申请一个 Key（随机字符串）
2. 在 `scripts/submit-indexnow.mjs` 中找到 `REPLACE_WITH_YOUR_INDEXNOW_KEY`，替换为真实 Key
3. 同时在 `public/` 目录创建同名验证文件（如 Key 是 `abc123`，则创建 `public/abc123.txt`，内容为 `abc123`）
4. 运行：
   ```powershell
   npm run submit:indexnow:vpn
   ```

---

## 7. 变现配置（联盟 + AdSense）

### 联盟营销（优先，佣金高）

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

推送代码自动部署。

> ⚠️ **注意**：联盟申请需要网站已上线且有流量，建议上线 2-4 周后再申请。
> NordVPN 联盟审核较宽松，建议优先申请。

### Google AdSense（展示广告）

1. 申请：https://www.google.com/adsense/start/
2. 需要网站已上线，内容丰富，Google 审核通常 2-4 周
3. 通过后在后台创建广告单元，获取 Publisher ID 和 Ad Slot
4. 填入 `sites/vpn-usa/config.json`：
   ```json
   "adsense": {
     "publisherId": "ca-pub-你的ID",
     "adSlot": "你的广告位ID"
   }
   ```

---

## 8. 日常维护

### 每次修改文章后部署

```powershell
cd "d:\code\seo-sites"
git add -A
git commit -m "update: 简述改了什么"
git push
```

### 新增文章

在 `sites/vpn-usa/posts/` 目录下新建 `.md` 文件，参考现有文章格式填写 frontmatter 和正文，推送即可。

文章 frontmatter 模板：

```yaml
---
title: "文章标题"
description: "文章描述（显示在 Google 搜索结果中）"
keywords: ["关键词1", "关键词2"]
pubDate: "2026-03-17"
updatedDate: "2026-03-17"
author: "vpn-expert"
faq:
  - question: "常见问题1？"
    answer: "答案1"
  - question: "常见问题2？"
    answer: "答案2"
---
```

### 更新文章日期（让 Google 重新抓取）

打开旧文章，将 `updatedDate` 改为今天的日期，推送即可。

---

## 9. 待办清单（按优先级）

### 🔴 阶段一：上线（必须完成，约 1 小时）

- [ ] **在 GitHub 创建 seo-sites 仓库**（Public）
  - 网址：https://github.com/new
- [ ] **推送代码**
  ```powershell
  cd "d:\code\seo-sites"
  git remote add origin https://github.com/你的用户名/seo-sites.git
  git push -u origin main
  ```
- [ ] **GitHub Pages 设置**：Settings → Pages → Source 选 GitHub Actions
- [ ] **Custom Domain 填入** `wordok.top`，勾选 Enforce HTTPS
- [ ] **火山引擎添加 5 条 DNS 记录**（见第 5 节）
- [ ] **验证上线**：访问 `https://wordok.top/vpn-usa/` 确认能打开

### 🟡 阶段二：流量追踪（上线后第 1 周）

- [ ] **Google Analytics GA4**：创建媒体资源，获取 G-XXXXXXXXXX，填入 config.json
- [ ] **Google Search Console 验证域名**（见第 6 节）
- [ ] **提交 Sitemap** 到 GSC：`https://wordok.top/vpn-usa/sitemap.xml`
- [ ] **手动请求收录**首页和 5 篇核心文章（每天最多 10 条）
- [ ] **IndexNow**：申请 Key，配置并运行 `npm run submit:indexnow:vpn`

### 🟠 阶段三：变现准备（上线 2-4 周后）

- [ ] **注册 NordVPN 联盟**：https://affiliates.nordvpn.com
- [ ] **注册 ExpressVPN 联盟**：https://www.expressvpn.com/affiliates
- [ ] **注册 Surfshark 联盟**：https://surfshark.com/affiliates
- [ ] **将真实联盟链接填入** `sites/vpn-usa/config.json` 并推送
- [ ] **申请 Google AdSense**：https://www.google.com/adsense/start/

### 🟢 阶段四：持续增长（长期执行）

- [ ] 每周发布 1-2 篇新文章（可参考关键词：`vpn for [city]`、`vpn for [app/service]`）
- [ ] 每月更新旧文章的 `updatedDate` 字段（让 Google 重新爬取）
- [ ] 每月查看 GSC「覆盖率报告」，修复索引错误
- [ ] 每季度在 GSC 看哪些文章有排名，重点优化这些文章内容
- [ ] 外链建设：在 Reddit（r/VPN、r/privacy）、Quora 发布有价值回答并附链接
- [ ] 考虑建设 `site-a`（SEO 技术文章站）作为第二流量来源

---

## 快速参考

### 命令速查

| 命令 | 用途 |
|------|------|
| `npm run dev` | 本地预览（需先 `$env:ENABLED_SITES="vpn-usa"`） |
| `npm run build` | 完整构建（含搜索索引） |
| `npm run build:no-search` | 快速构建（不含搜索） |
| `git push` | 推送代码，自动部署 |
| `npm run submit:indexnow:vpn` | 通知搜索引擎爬取所有 URL |

### 关键文件速查

| 文件 | 作用 |
|------|------|
| `sites/vpn-usa/config.json` | **最常改**：联盟链接、GA4、AdSense、域名 |
| `sites/vpn-usa/posts/*.md` | 网站文章内容 |
| `sites/vpn-usa/index-schedule.json` | 文章发布节奏（当前全量上线） |
| `public/CNAME` | 自定义域名（勿改） |
| `.github/workflows/deploy.yml` | 自动部署配置（勿改） |

### 上线后页面地址

| 页面 | 地址 |
|------|------|
| 首页 | `https://wordok.top/vpn-usa/` |
| 文章列表 | `https://wordok.top/vpn-usa/posts/` |
| 关于我们 | `https://wordok.top/vpn-usa/about/` |
| 联系 | `https://wordok.top/vpn-usa/contact/` |
| 联盟披露 | `https://wordok.top/vpn-usa/disclosure/` |
| Sitemap | `https://wordok.top/vpn-usa/sitemap.xml` |
| RSS 订阅 | `https://wordok.top/vpn-usa/rss.xml` |
