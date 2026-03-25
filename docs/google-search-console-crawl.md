# Google 抓取与收录 — 问题记录与发布检查清单

部署本仓库更新前，**请过一遍文末「每次更新检查清单」**，避免重复出现「不易被 Google 检索」的配置问题。收录节奏仍由 Google 综合判定，但技术通道应保持畅通。

---

## 曾遇到的现象（网址检查 / 覆盖范围）

在 Search Console 对某 URL 做「网址检查」时，若出现类似状态：

| 现象 | 含义（常见原因） |
|------|------------------|
| **站点地图：未检测到任何引荐站点地图** | Google **尚未**通过你已提交的 sitemap 发现该 URL，或未提交 sitemap、sitemap 抓取失败、或检查的 URL **不在**已提交地图里。 |
| **引荐来源网页：未检测到引荐来源网页** | 尚无已抓取页面通过内链指向该 URL（新 URL、孤岛页、或尚未重抓）。 |
| **抓取：上次抓取时间「不适用」** | 可能 **从未成功抓取** 该 URL，或资源前缀与真实网址不一致导致检查的是「另一个空间」。 |
| **是否允许抓取 / 编入索引：不适用** | 常与「尚未抓取」同时出现；**不等于** robots 一定有问题，要先确认是否真的抓到过。 |

**注意**：上述多为「未发现 / 未抓取」类提示；若已抓取却被 `noindex` 排除，表现会不同（见下文「GSC 常见状态说明」）。

---

## 为避免上述问题，站内已做的技术配置

| 项目 | 说明 |
|------|------|
| **robots.txt** | `User-agent: *` + `Allow: /`；列出 `sitemap_index.xml`、`sitemap.xml` 及各专栏 `/{slug}/sitemap.xml`（跨域专栏使用各自 `baseUrl`）。 |
| **双站点地图 `<link rel="sitemap">`** | 在 `BaseLayout` / `AiNewsLayout` 的 `<head>` 中同时声明 **索引**与**全量**（生产环境为**绝对 URL**）。 |
| **根页 / 无专栏布局页脚** | 无 `siteSlug` 的页面（首页、`/sitemap/`）正文下方有 **XML 索引、全量 sitemap、HTML 站点地图、robots.txt** 的绝对链接，便于爬虫从 HTML 发现。 |
| **首页 Quick Navigation** | 站点地图相关入口使用 **绝对 URL**（与线上主域一致）。 |
| **Astro `site`** | `astro.config.mjs` 中设置 `site: 'https://wordok.top'`，与 `CNAME` / 主域一致。 |
| **统一根域** | `src/lib/root-base-url.ts` 的 `getPublicRootBaseUrl()`：`PUBLIC_ROOT_BASE_URL` 未设时默认为 `https://wordok.top`，供 sitemap、robots、绝对链接一致使用。 |
| **全站互链** | 各频道顶栏 / 页脚列出 **全部专栏**；页脚含 AI Frontiers、Privacy、HTML Site Map、RSS、各站 `sitemap.xml` 等。 |
| **XML** | `/sitemap.xml`、`/sitemap_index.xml`、各 `/[site]/sitemap.xml`；`lastmod` 与文章日期逻辑对齐（见 `sitemap_index.xml.ts` 等）。 |
| **HTML 站点地图** | `/sitemap/` 列出主要 URL；文案中引导使用 `sitemap_index.xml` / `sitemap.xml`。 |
| **`public/_headers`** | 在 **Netlify / Cloudflare Pages** 上为 sitemap 路径设置 `Content-Type: application/xml`。**GitHub Pages 会忽略此文件**（依赖其对 `.xml` 的默认处理）。 |
| **默认 robots meta** | 全页默认允许收录（`src/lib/seo-defaults.ts`）；草稿等通过 frontmatter 覆盖。 |
| **规范 URL** | 每页 `link rel="canonical"` + `hreflang`（含 `x-default`）；`trailingSlash: 'always'` 与路径保持一致。 |
| **WebSite JSON-LD** | 首页 `WebSite` 带稳定 `@id`（如 `https://wordok.top/#website`）。 |

---

## Search Console 侧必做（否则仍可能显示「无引荐站点地图」）

1. **资源类型与 URL 一致**  
   使用 **网址前缀** `https://wordok.top/`（注意 **https**、**非 www**、与站内 canonical 一致）。不要用不解析的 `www.wordok.top` 或旧的 `*.github.io`（除非那就是当前正式域）。

2. **提交站点地图**  
   在 GSC → 站点地图中添加：  
   `https://wordok.top/sitemap_index.xml`  
   （可选再提交 `https://wordok.top/sitemap.xml`。）

3. **部署后**  
   对重要 URL 使用 **网址检查 → 请求编入索引**（有每日额度限制）。

---

## GSC 常见状态说明（易混淆）

| 报告用语 | 含义 |
|----------|------|
| **被「noindex」标记排除** | Google **抓到的 HTML** 里存在 `noindex`（meta 或 HTTP 头）。需在**线上**「查看网页源代码」搜索 `noindex` 核实。 |
| **已抓取 - 尚未编入索引** | 已抓取，但 Google **选择暂不收录**（质量、重复、站点较新、抓取预算等），**不一定是** noindex。 |

本站默认 **`meta robots`** 为 **`index, follow`**（见 `seo-defaults.ts`）。**`draft: true`** 或 frontmatter **`robots: "noindex, ..."`** 会覆盖为不收录。

---

## 若仍见「noindex」或异常

1. GSC **网址检查** → 看 **Google 选择的规范网址**是否与页面 **`link rel="canonical"`** 一致（**http/https、www/非 www、尾部斜杠**）。
2. 浏览器打开同一 URL → **查看网页源代码** → 搜索 `noindex`。
3. 确认 **Cloudflare** 等对 Googlebot 无拦截 / 挑战页（挑战页有时带 noindex）。
4. 跨域专栏（如 `site-a` 使用独立 `baseUrl`）需在 **对应域名** 的 GSC 资源中分别处理（sitemap URL 以 `robots.txt` / `sitemap_index` 中为准）。

---

## 每次更新检查清单（发布前 / 发布后）

**发布前（本地或 CI）**

- [ ] 运行 `npm run build` 无错误。
- [ ] 若正式域不是 `https://wordok.top`，在构建环境设置 **`PUBLIC_ROOT_BASE_URL`**（无尾部斜杠），与线上 canonical 一致。
- [ ] 新增**专栏**时：已加入站点配置、`channel-nav` 标签、静态路由能生成首页与 `/{slug}/sitemap.xml`。
- [ ] 新增**重要落地页**时：确认已出现在 **`/sitemap.xml`** 或对应 **`/{slug}/sitemap.xml`** 中（或会被下次构建纳入）。
- [ ] 勿对整站或列表页误加 **`noindex`**；草稿仅用 **`draft: true`** 或明确 `robots` 覆盖。

**发布后（线上验证）**

- [ ] 浏览器可访问：`/robots.txt`、`/sitemap_index.xml`、`/sitemap.xml`（返回 XML，非 HTML 错误页）。
- [ ] 首页「查看源代码」中存在 **两条** `rel="sitemap"`（绝对 URL 指向本站）。
- [ ] 首页底部（或 `/sitemap/` 底部）可见 **Sitemap index / Full URL list / robots.txt** 等链接且可点开。
- [ ] GSC 中 **站点地图**无「无法读取」错误；若有，检查 **404、Content-Type、防火墙**。
- [ ] 重要 URL 在 GSC **网址检查**中逐步出现「已抓取」后，再观察索引状态（需时间）。

**可选**

- [ ] Bing 等：确认 IndexNow 相关脚本/密钥仍有效（见仓库内 IndexNow 文档与 npm scripts）。

---

## 相关文件（改 SEO / 抓取逻辑时优先看）

| 文件 | 作用 |
|------|------|
| `astro.config.mjs` | `site`、 `trailingSlash` |
| `src/lib/root-base-url.ts` | 根域统一 |
| `src/lib/seo-defaults.ts` | 默认 `robots` meta |
| `src/pages/robots.txt.ts` | robots + Sitemap 列表 |
| `src/pages/sitemap.xml.ts`、`sitemap_index.xml.ts` | 全站 XML |
| `src/pages/[site]/sitemap.xml.ts` | 分专栏 XML |
| `src/layouts/BaseLayout.astro`、`AiNewsLayout.astro` | canonical、双 sitemap link、导航与页脚 |
| `public/_headers` | Netlify / CF Pages 的 XML Content-Type |
| `src/pages/sitemap/index.astro` | HTML 站点地图 |

---

*文档随踩坑更新；若 GSC 提示与本文不一致，以 Google Search Central 最新说明为准。*
