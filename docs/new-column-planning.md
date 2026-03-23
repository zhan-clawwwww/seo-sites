# 新增专栏规划 — wordok.top

> 目标：新增易检索、高搜索量的专栏，确保 sitemap 等能被 Google 收录

---

## 一、现有架构总结

- **站点**：vpn-usa、ai、apple、site-a（由 ENABLED_SITES 控制）
- **专栏模式**：基于 `topic` 的 frontmatter 字段，如 `topic: "ai-frontiers"`
- **现有专栏**：AI Frontiers（`/{site}/ai-frontiers/`）
- **Sitemap**：全站 `sitemap.xml`、单站 `/{site}/sitemap.xml`、HTML `/sitemap/`

---

## 二、专栏建议（易检索、高搜索量）

| 专栏 | topic | 关键词方向 | 适用站点 | 搜索热度 |
|------|-------|------------|----------|----------|
| **Privacy & Security** | `privacy-security` | vpn privacy, data protection, secure browsing, internet security | vpn-usa, ai, apple | 高 |
| **How-to Guides** | `how-to` | how to set up vpn, how to use vpn, vpn tutorial | vpn-usa | 高 |
| **Streaming** | `streaming` | vpn for netflix, best vpn streaming, vpn disney plus | vpn-usa | 高 |
| **AI Tools** | `ai-tools` | best ai tools 2026, chatgpt alternatives | ai | 极高 |
| **Deals & Best Buys** | `deals` | best vpn deals, iphone deals 2026 | vpn-usa, apple | 季节性高 |

**首选推荐**：**Privacy & Security** — 与 VPN 核心价值契合，搜索量稳定，可跨站点复用。

---

## 三、实施方案：新增 Privacy & Security 专栏

### 3.1 需修改文件

| 文件 | 修改内容 |
|------|----------|
| `src/pages/[site]/privacy-security/index.astro` | 新建专栏页（仿 ai-frontiers） |
| `src/pages/sitemap.xml.ts` | 添加 `/{site}/privacy-security/` |
| `src/pages/[site]/sitemap.xml.ts` | 同上 |
| `src/layouts/BaseLayout.astro` | 导航增加 Privacy & Security 链接 |
| `src/pages/sitemap/index.astro` | HTML sitemap 增加专栏链接 |
| `sites/*/posts/*.md` | 部分文章添加 `topic: "privacy-security"` |

### 3.2 URL 与 SEO

- **URL**：`https://wordok.top/{site}/privacy-security/`
- **Canonical**：同上
- **JSON-LD**：BreadcrumbList + ItemList
- **Open Graph / Twitter Card**：完整配置

### 3.3 与 AI Frontiers 的差异化

- AI Frontiers：前沿研究、论文、突破
- Privacy & Security：实用指南、隐私保护、安全实践

---

## 四、Agent 分工

1. **统筹规划 Agent**：完成上述代码改动，确保 sitemap、robots、导航一致
2. **内容创作 Agent**：网上搜集隐私/安全相关英文内容，整理成 3–5 篇 Markdown 文章
3. **测试 Agent**：构建、访问、sitemap 可访问性、Google 抓取友好性检查
