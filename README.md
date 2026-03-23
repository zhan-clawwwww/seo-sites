# Best USA VPN — SEO 联盟站

基于 **Astro** 构建的 VPN 评测 SEO 站，部署在 GitHub Pages，域名 `wordok.top`。

## 📖 操作手册

**所有操作说明、待办清单、部署流程、变现配置，全部在：**

👉 **[TODO.md](./TODO.md)**

## 快速开始

```powershell
npm install
$env:ENABLED_SITES="vpn-usa"
npm run dev
# 浏览器打开 http://localhost:4321/vpn-usa/
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

## 新文章与站点地图

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
sites/vpn-usa/        ← 网站内容（文章 + 配置）
sites/ai/posts/       ← AI 频道文章
sites/apple/posts/    ← Apple 频道文章
src/                  ← 框架代码（一般不改）
public/CNAME          ← 域名配置（wordok.top）
.github/workflows/    ← 自动部署（push 后自动触发）
```

## 技术栈

- **Astro 5** — 静态站点生成
- **GitHub Pages** — 免费托管
- **GitHub Actions** — 自动 CI/CD
