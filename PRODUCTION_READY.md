# 生产环境上线清单

> 本文档说明站点内容定位、已完成的优化，以及上线前最后检查项。

---

## 一、站点主体内容说明

### site-a（TechReview Pro）— 主站

**定位**：技术评测与 SEO 洞察平台

**核心内容**：
- **SEO 技术指南**：技术 SEO 检查清单、页面速度优化、Core Web Vitals、结构化数据、元标签优化
- **内容营销**：内容营销与 SEO 策略、内部链接、外链建设
- **Web 技术**：静态站点生成器对比（Astro vs Next.js）、移动端 SEO、URL 结构最佳实践

**13 篇核心文章**：
1. Technical SEO Checklist 2025
2. On-Page SEO Optimization Checklist
3. Core Web Vitals Optimization Guide
4. How to Improve Page Speed for SEO
5. Structured Data SEO Implementation
6. Meta Tags SEO Optimization Guide
7. Mobile SEO Optimization 2025
8. SEO-Friendly URL Structure
9. Internal Linking SEO Strategy
10. Backlink Building Strategy 2025
11. Content Marketing SEO Strategy
12. Astro vs Next.js Comparison
13. Best Static Site Generators 2025

**目标受众**：网站开发者、SEO 从业者、技术决策者

---

### site-b — 备用站点

- 模板站点，含 1 篇 welcome 文章
- 暂未启用（ENABLED_SITES 默认仅含 site-a）

---

### vpn-usa — VPN 垂直站

- 88 篇 VPN 相关文章（美国用户场景）
- 涵盖流媒体、隐私、设备兼容等主题
- 需人工润色后再上线（当前为模板化内容）

---

## 二、已完成的优化

### 图片资源
- ✅ **og-default.png**（1200×630）：主站默认分享图，已放入 `public/`
- ✅ **favicon.svg**：TechReview Pro 品牌图标（TR 字母）
- ✅ **apple-touch-icon**：使用 og-default.png 作为 iOS 主屏图标

### 配置
- ✅ 联系邮箱已统一为 `iwangzhanpeng94@gmail.com`
- ✅ 作者邮箱已更新

### SEO
- ✅ 根目录 robots.txt
- ✅ Sitemap 含 priority、changefreq
- ✅ 全站 Canonical、OG、Twitter Card
- ✅ JSON-LD 结构化数据（Article、Breadcrumb、Organization、WebSite 等）
- ✅ 图片 alt 自动补全（Rehype 插件）

---

## 三、上线前最后检查

### 必须完成（部署前）

| 项目 | 操作 |
|------|------|
| 域名 | 确认已购买 techreviewpro.com（或你的实际域名） |
| baseUrl | 编辑 `sites/site-a/config.json`，将 `baseUrl` 改为实际域名 |
| GA4 | 前往 [analytics.google.com](https://analytics.google.com) 创建数据流，填入 `analytics.ga4Id` |
| 根域名 | 若根域与站点不同，设置环境变量 `PUBLIC_ROOT_BASE_URL` |

### 可选（上线后）

| 项目 | 说明 |
|------|------|
| Cloudflare Beacon | 隐私友好分析，填入 `analytics.cfBeacon` |
| Giscus 评论 | 配置 GitHub Discussions，填入 `giscus` 四字段 |
| 社交媒体 | 创建 Twitter/LinkedIn 账号，更新 `social` 链接 |

---

## 四、部署命令（Cloudflare Pages）

- **构建命令**：`npm run build`
- **输出目录**：`dist`
- **环境变量**：`ENABLED_SITES=site-a`（可选，默认即 site-a）

---

## 五、上线后操作

1. 在 [Google Search Console](https://search.google.com/search-console) 添加资源并验证
2. 提交 Sitemap：`https://你的域名/site-a/sitemap.xml`
3. 手动请求索引首页及核心文章
