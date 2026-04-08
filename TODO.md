# Best USA VPN — 操作手册与待办清单

> 域名：**wordok.top** | 部署平台：**GitHub Pages（免费）**
>
> 最后更新：2026-03-19

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

### 一、Google Analytics GA4（免费，追踪流量）

**第 1 步：创建账号**
1. 打开 https://analytics.google.com/，用 Google 账号登录
2. 点击左下角「开始测量」或「创建账号」

**第 2 步：填写账号信息**
- 账号名称：填 `wordok`
- 数据共享设置：默认全勾
- 点「下一步」

**第 3 步：创建媒体资源**
- 媒体资源名称：填 `wordok.top`
- 报告时区：「中国」→「北京时间（UTC+8）」
- 货币：选「美元（USD）」（因为收入是美元）
- 点「下一步」

**第 4 步：填写业务信息**
- 行业类别：「计算机和电子产品」或「其他」
- 业务规模：「小型」
- 点「创建」→ 同意服务条款

**第 5 步：选择数据流**
- 选「网络」（Web）
- 网站网址：`https://wordok.top`
- 数据流名称：`wordok.top`
- 点「创建并继续」

**第 6 步：获取并填入 ID**
- 创建成功后看到 `G-XXXXXXXXXX` 格式的 ID，复制它
- 打开 `sites/vpn-usa/config.json`，找到：
  ```json
  "analytics": { "ga4Id": "", "cfBeacon": "" }
  ```
  改为：
  ```json
  "analytics": { "ga4Id": "G-XXXXXXXXXX", "cfBeacon": "" }
  ```
- 推送代码：
  ```powershell
  cd "d:\code\seo-sites"
  git add -A
  git commit -m "config: add GA4 tracking id"
  git push
  ```

---

### 二、Google Search Console（免费，提交收录）

**第 1 步：进入 GSC**
1. 打开 https://search.google.com/search-console/welcome
2. 同一个 Google 账号登录

**第 2 步：选验证方式**
- 左边「**网域**」那栏输入 `wordok.top`（不带 https://）
- 点「继续」

**第 3 步：复制 TXT 验证码**
- 弹出框里有一串 `google-site-verification=xxxxxxxxxxxxxxx` 的字符串
- 点「复制」

**第 4 步：去火山引擎添加 TXT 记录**
1. 打开火山引擎 DNS 控制台 → `wordok.top` → 添加记录：
   - 主机记录：`@`
   - 记录类型：**TXT**
   - 记录值：粘贴刚才复制的完整字符串
   - TTL：10分钟
2. 保存

**第 5 步：验证**
- 回到 GSC 弹出框，点「验证」
- 若失败等 5 分钟再试（DNS 需要时间生效）
- 看到「已验证所有权」即成功

**第 6 步：让 Google 发现并收录全站**

> ⚠️ **GitHub Pages 限制**：XML sitemap 可能返回错误 Content-Type，GSC 的「Sitemap」提交会显示「无法抓取」。本站在线使用 **HTML 站点地图** 作为主要发现方式。

**正确做法（不要填 Sitemap 框）：**

1. **不提交** GSC 左侧「Sitemap」输入框（留空或删除已提交的 sitemap_index.xml / sitemap）
2. 使用 **「检查网址」**：顶部搜索框输入 `https://wordok.top` → 点「请求编入索引」
3. Google 会抓取首页，从首页的「站点地图」链接进入 `/sitemap/`，该页列出全站所有链接，Google 可据此发现并收录所有文章
4. 各频道页脚也有「Site Map」链接指向 `/sitemap/`

**第 7 步：手动请求收录核心文章**

在 GSC 顶部「检查网址」搜索框中，逐条粘贴以下 URL，每条点「请求编入索引」（每天上限 10 条，分 2 天做完）：

```
https://wordok.top/vpn-usa/
https://wordok.top/vpn-usa/posts/best-vpn-usa-2025/
https://wordok.top/vpn-usa/posts/usa-vpn-for-netflix/
https://wordok.top/vpn-usa/posts/cheap-vpn-usa/
https://wordok.top/vpn-usa/posts/best-vpn-for-usa-streaming/
https://wordok.top/vpn-usa/posts/fastest-vpn-usa-server/
https://wordok.top/vpn-usa/posts/best-vpn-for-usa-gaming/
https://wordok.top/vpn-usa/posts/usa-vpn-for-hulu/
https://wordok.top/vpn-usa/posts/usa-vpn-for-disney-plus/
https://wordok.top/vpn-usa/posts/free-vpn-usa-no-credit-card/
```

> 之后 Google 会通过 sitemap 自动发现剩余文章，无需全部手动请求

---

### 三、IndexNow（免费，让 Bing 快速收录）

**第 1 步：生成一个 Key**

在 PowerShell 终端运行以下命令，生成随机 Key：
```powershell
-join ((48..57) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```
输出类似 `a3f9k2m8x1b7q4n6p0r5t2w8y1c3e6h9` 的字符串，复制保存。

**第 2 步：创建验证文件**

在 `public/` 目录创建一个文件，文件名 = Key，内容 = Key。
例如 Key 是 `a3f9k2m8`，则：
- 新建文件：`public/a3f9k2m8.txt`
- 文件内容：`a3f9k2m8`

**第 3 步：设置环境变量（勿把 Key 提交到 Git）**

在 `.env` 中设置 `INDEXNOW_KEY=你的key`，或每次运行前在终端设置（见 `scripts/submit-indexnow.mjs` 顶部注释）。

**第 4 步：推送并运行**
```powershell
git add -A
git commit -m "chore: ..."
git push

# 等网站部署完成（约 3-5 分钟）后运行（示例）：
# $env:INDEXNOW_KEY="你的key"; npm run submit:indexnow:vpn
```

---

## 7. 变现配置（联盟 + AdSense）

> ⚠️ **时机提示**：联盟和 AdSense 都需要网站已上线且有内容，建议上线 **2-4 周**后再申请，避免因新站被拒。

### 一、NordVPN 联盟（优先注册，审核最快）

**第 1 步：申请**
1. 打开 https://affiliates.nordvpn.com
2. 点「Apply now」
3. 填写表单：
   - 网站 URL：`https://wordok.top/vpn-usa/`
   - 网站描述：`VPN review and comparison site targeting USA users with 88+ expert articles`
   - 流量来源：勾选 SEO / Organic Search
   - 预计月流量：填 `500`（新站正常，如实填写）
4. 提交，通常 1-3 个工作日审核

**第 2 步：获取联盟链接**
- 审核通过后登录后台
- 找推广链接，格式类似：`https://go.nordvpn.net/aff_c?offer_id=15&aff_id=12345`
- 其中 `12345` 就是你的联盟 ID

**第 3 步：填入 config.json**

打开 `sites/vpn-usa/config.json`，找到 NordVPN 的 url 字段，把 `REPLACE_YOUR_AFF_ID` 替换为真实 ID：
```json
"url": "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=12345"
```
推送代码，88 篇文章里的 NordVPN 链接全部自动更新：
```powershell
git add -A
git commit -m "config: add NordVPN affiliate link"
git push
```

---

### 二、ExpressVPN 联盟

**第 1 步：申请**
1. 打开 https://www.expressvpn.com/affiliates
2. 点「Join Now」，填写网站信息（同上）
3. 等审核通过

**第 2 步：填入 config.json**

找到 ExpressVPN 的 url 字段，替换 `REPLACE_YOUR_REF_ID`：
```json
"url": "https://www.expressvpn.com/order?offer=3monthsfree&a_fid=你的ID"
```

---

### 三、Surfshark 联盟

1. 打开 https://surfshark.com/affiliates
2. 填写申请（Surfshark 审核较宽松）
3. 通过后找到推广链接，替换 config.json 里的 `REPLACE_YOUR_DEAL_CODE`

---

### 四、Google AdSense（上线 1 个月后再申请）

**申请条件**：网站已上线、内容丰富、有一定流量

**第 1 步：申请**
1. 打开 https://www.google.com/adsense/start/
2. 填写网站地址：`https://wordok.top`
3. Google 会给一段验证代码，**不需要手动加**，只需把 Publisher ID 填入 config.json（框架已处理好）

**第 2 步：等待审核**
- 审核通常 2-4 周
- 审核期间可以先把 Publisher ID 填进去（格式 `ca-pub-1234567890123456`）

**第 3 步：填入 config.json**
```json
"adsense": {
  "publisherId": "ca-pub-1234567890123456",
  "adSlot": ""
}
```

**第 4 步：创建广告单元**
- AdSense 审核通过后，进入后台 → 「广告」→「按广告单元」→「展示广告」
- 创建后获得 Ad Slot ID（格式如 `1234567890`）
- 填入 config.json 的 `adSlot` 字段并推送

推送代码后，每篇文章底部会自动显示 AdSense 广告。

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

> ✅ = 已完成 | ⬜ = 你需要手动做

### 🔴 阶段一：上线

- [ ] ⬜ **开启 GitHub Pages**：打开 https://github.com/zhan-clawwwww/seo-sites/settings/pages → Source 选 **GitHub Actions** → Save
- [ ] ⬜ **Custom Domain**：同一页面填入 `wordok.top`，勾选 Enforce HTTPS
- [ ] ⬜ **推送代码到 GitHub**（需要 VPN/代理时）：
  ```powershell
  git config --global http.proxy http://127.0.0.1:7890
  git config --global https.proxy http://127.0.0.1:7890
  cd "d:\code\seo-sites"
  git push origin main
  git config --global --unset http.proxy
  git config --global --unset https.proxy
  ```
- [ ] ⬜ **验证上线**：等 3-5 分钟后访问 `https://wordok.top/vpn-usa/` 确认能打开

### 🟡 阶段二：让搜索引擎收录（上线后第 1 天）

- [ ] ⬜ **Google Search Console 验证域名**（详细步骤见第 6 节第二部分）
- [ ] ⬜ **请求收录首页**：GSC「检查网址」输入 `https://wordok.top` → 请求编入索引（**不要**在 Sitemap 框提交任何 URL）
- [ ] ⬜ **手动请求收录**（可选）：GSC 逐条粘贴重要 URL → 请求编入索引（每天上限 10 条）
- [ ] ⬜ **IndexNow 提交 Bing**（详细步骤见第 6 节第三部分）

### 🟠 阶段三：变现（上线 2-4 周后有流量再申请）

- [ ] ⬜ **注册 NordVPN 联盟**：https://affiliates.nordvpn.com（审核最快，优先申请）
- [ ] ⬜ **注册 ExpressVPN 联盟**：https://www.expressvpn.com/affiliates
- [ ] ⬜ **注册 Surfshark 联盟**：https://surfshark.com/affiliates
- [ ] ⬜ **将真实联盟链接填入** `sites/vpn-usa/config.json` → 推送代码自动部署
- [ ] ⬜ **申请 Google AdSense**：https://www.google.com/adsense/start/（详细步骤见第 7 节第四部分）

### 🟢 阶段四：持续增长（长期执行）

- [ ] 每周发布 1-2 篇新文章（建议关键词方向见下方）
- [ ] 每月更新 5-10 篇旧文章的 `updatedDate` 字段（让 Google 重新爬取）
- [ ] 每月查看 GSC「覆盖率报告」，修复索引错误
- [ ] 每季度在 GSC 看哪些文章有排名，重点优化这些文章内容
- [ ] 外链建设：在 Reddit（r/VPN、r/privacy、r/HomeNetworking）、Quora 发布有价值回答并附链接

### 推荐的新文章选题方向

**网络知识类（低竞争，高搜索量，适合 AdSense）：**
- `how to set up parental controls on router`
- `what is a firewall and do you need one`
- `how to fix slow wifi in apartment`
- `ethernet vs wifi which is better for gaming`
- `what is a proxy server vs vpn`
- `how to check if your internet is being throttled`
- `best dns servers for gaming 2026`
- `how to secure your smart home devices`

**VPN 相关类（高 CPC，适合联盟）：**
- `vpn for [新城市名]`：`vpn for new york`, `vpn for california`
- `vpn for [新应用]`：`vpn for tiktok`, `vpn for spotify`, `vpn for chatgpt`
- `[VPN品牌] vs [VPN品牌]`：`nordvpn vs expressvpn 2026`

---

## 快速参考

### 命令速查

| 命令 | 用途 |
|------|------|
| `npm run dev` | 本地预览（需先 `$env:ENABLED_SITES="vpn-usa"`） |
| `npm run build` | 完整构建（含搜索索引） |
| `npm run build:no-search` | 快速构建（不含搜索） |
| `git push` | 推送代码，自动部署 |
| `npm run submit:indexnow:vpn` | 提交单站点 URL 到 Bing/IndexNow |
| `npm run submit:sitemap` | Ping Google Sitemap（部署后可选） |

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
| HTML 站点地图 | `https://wordok.top/sitemap/` |
| RSS 订阅 | `https://wordok.top/vpn-usa/rss.xml` |
