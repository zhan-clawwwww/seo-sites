# Wordok.top — SEO 多站点矩阵

基于 **Astro** 构建的 SEO 多站点矩阵，部署在 GitHub Pages，域名 `wordok.top`。

## 📖 操作手册

**所有操作说明、待办清单、部署流程、变现配置，全部在：**

👉 **[TODO.md](./TODO.md)**

## 站点矩阵

| 站点 | 路径 | 文章数 | 主题 |
|------|------|--------|------|
| **VPN USA** | `/vpn-usa/` | 133 | VPN 评测与推荐 |
| **AI News** | `/ai/` | 57 | AI 新闻与技术 |
| **Apple Devices** | `/apple/` | 131 | iPhone/MacBook 规格评测 |
| **Web3 Insights** | `/web3/` | 51 | Web3/区块链/DeFi |
| **Tesla News** | `/tesla/` | 40 | 特斯拉新闻与评测 |
| **Streaming** | `/streaming/` | 30 | 流媒体服务 |
| **OpenClaw** | `/openclaw/` | 27 | 开源技术 |
| **Site A** | `/site-a/` | 40 | SEO 技术文章 |
| **AI Corpus** | `/ai-corpus/` | 30 | LLM 语料库 |

**总计：539 篇英文长文（3000+ 词/篇）**

## 快速开始

```powershell
npm install

# 启动单个站点
$env:ENABLED_SITES="vpn-usa"
npm run dev

# 启动多个站点
$env:ENABLED_SITES="vpn-usa,ai,apple,web3,tesla"
npm run dev

# 启动所有站点
$env:ENABLED_SITES="all"
npm run dev

# 浏览器打开 http://localhost:4321/
```

## Google Search Console 提交说明

> ⚠️ GitHub Pages 对 XML 返回错误 Content-Type，GSC 的「Sitemap」提交会失败。**不要**在 Sitemap 框填任何 URL。

**正确做法：**

| 操作 | 填写内容 |
|------|----------|
| **GSC 验证** | 网域填 `wordok.top`，按提示添加 TXT 记录 |
| **Sitemap 框** | **留空**（若已提交 sitemap_index.xml 或 sitemap，请删除） |
| **检查网址** | 填 `https://wordok.top` → 点「请求编入索引」 |

Google 会抓取首页，从首页「站点地图」进入 `/sitemap/`，该页列出全站所有链接，Google 可据此发现并收录所有文章。

**抓取与收录（robots、内链、IndexNow 全站脚本）**：见 **[docs/google-search-console-crawl.md](./docs/google-search-console-crawl.md)**。部署后可运行 `npm run submit:indexnow:all-sites`（需已配置 IndexNow 验证文件）。

**Google Analytics 4 数据流（wordok.top / 衡量 ID）**：见 **[docs/google-analytics-4-data-stream.md](./docs/google-analytics-4-data-stream.md)**。

## 新文章与站点地图

**日常 SEO 供稿标准（专栏范围、每日篇数、英文篇幅、Frontmatter）：** 见 **[docs/SEO-编写标准与更新要求.md](./docs/SEO-编写标准与更新要求.md)**。

**站点地图自动生成**，无需手动维护。

- 在 `sites/{站点}/posts/` 下新增 `.md` 文件
- 推送代码后，构建时会自动：
  - 生成文章页面
  - 将新文章加入 **全站 sitemap.xml**（`https://wordok.top/sitemap.xml`）
  - 将新文章加入 HTML 站点地图 `/sitemap/`
  - 将新文章加入各站点 XML sitemap（如 `/vpn-usa/sitemap.xml`）
- **每次更新文章后必须 push**，CI 构建会同步更新 sitemap.xml

**新增文章流程：**

```powershell
# 1. 在对应站点 posts 目录新建 .md 文件
# 例如：sites/vpn-usa/posts/my-new-article.md

# 2. 推送代码（构建时会自动更新 sitemap.xml）
git add -A
git commit -m "post: add my-new-article"
git push
```

**全站 sitemap.xml 地址：** `https://wordok.top/sitemap.xml`

## 项目结构

```
sites/
├── vpn-usa/          ← VPN 评测主站（133 篇）
├── ai/               ← AI 新闻频道（57 篇）
├── apple/            ← Apple 设备评测（131 篇）
├── web3/             ← Web3/区块链（51 篇）
├── tesla/            ← 特斯拉新闻（40 篇）
├── streaming/        ← 流媒体服务（30 篇）
├── openclaw/         ← 开源技术（27 篇）
├── site-a/           ← SEO 技术文章（40 篇）
└── ai-corpus/        ← LLM 语料库（30 篇）

src/                  ← 框架代码（一般不改）
public/CNAME          ← 域名配置（wordok.top）
.github/workflows/    ← 自动部署（push 后自动触发）
scripts/              ← SEO 工具脚本
```

## 技术栈

- **Astro 5** — 静态站点生成
- **GitHub Pages** — 免费托管
- **GitHub Actions** — 自动 CI/CD
- **Pagefind** — 静态搜索索引

## 文章生成

```powershell
# 生成今日文章（所有频道）
node generate-4000-words-articles-2026-04-02.mjs

# 生成指定日期文章
node generate-4000-words-articles-2026-04-02.mjs --date=2026-05-09

# 提交到搜索引擎
npm run submit:indexnow:all-sites
```
