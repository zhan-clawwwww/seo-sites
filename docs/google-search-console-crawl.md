# Google 抓取与收录 — 本站已做的技术配置

部署本仓库更新后，以下机制有助于搜索引擎**发现**并**抓取**全站（收录节奏仍由 Google 综合判定）。

## 站内已启用

| 项目 | 说明 |
|------|------|
| **robots** | 全页默认 `index, follow`，并含 Google 支持的富摘要相关指令 |
| **全站互链** | 首页列出各频道 Home / Articles / AI Frontiers / Privacy / RSS；各站页脚含**所有频道**的相同结构链接 |
| **AiNews 布局** | AI / Apple 频道页头页脚补充 AI Frontiers、Privacy & Security、HTML Site Map、`sitemap_index` 链接 |
| **XML** | `/sitemap.xml`、`/sitemap_index.xml`、各 `/[site]/sitemap.xml` |
| **HTML 站点地图** | `/sitemap/` 含各频道首页、列表、**AI Frontiers**、Privacy、每篇文章 |
| **robots.txt** | `Allow: /` + 指向 `sitemap_index.xml` |

## 部署后建议你执行

1. **GSC → 网址检查**：对重要 URL（如 `https://wordok.top/`、`https://wordok.top/ai/`）点「请求编入索引」（每日约 10 条额度）。
2. **IndexNow（Bing 等）**：确认 `public/<你的KEY>.txt` 已部署后执行：
   ```bash
   npm run submit:indexnow:all-sites
   ```
   会依次提交 vpn-usa、ai、apple、streaming 的栏目+文章 URL，并 Ping 全站 sitemap index。
3. **说明**：「已发现 - 尚未编入索引」在页面多时很常见；技术通道畅通后，仍需时间与内容质量，无法保证瞬间全部收录。

## GSC 常见状态说明（易混淆）

| 报告用语 | 含义 |
|----------|------|
| **被「noindex」标记排除** | Google **抓到的 HTML 里**有 `noindex`（meta 或 HTTP 头）。需在**线上页面**「查看网页源代码」搜索 `noindex` 核实。 |
| **已抓取 - 尚未编入索引** | 已抓取，但 Google **选择暂不收录**（质量、重复、站点较新、抓取预算等），**不一定是** noindex。 |

二者不同：后者多为算法取舍，前者才是明确的「不收录」指令。

## 本站默认行为（部署后）

- 全站 **`meta name="robots"`** 使用 `src/lib/seo-defaults.ts` 中的常量：**`index, follow`** + Google 预览相关指令（`max-image-preview` 等），**不是** noindex。
- 已移除重复的 **`googlebot`** 专用 meta，避免与 `robots` 不一致；Google 以 `robots` 为准即可。
- 每页有 **`link rel="canonical"`** 与 **`hreflang`（含 x-default）**，减轻规范网址混淆。
- 文章 frontmatter：**`draft: true`**（或字符串 `"true"`）会输出 **`noindex, nofollow`**；也可写 **`robots: "noindex, follow"`** 等覆盖默认。

## 若仍见「noindex」或异常

1. 在 GSC **网址检查**里输入问题 URL → 查看 **「Google 选择的规范网页」**是否与你的 `canonical` 一致（注意 **http/https、www/非 www、尾部斜杠**）。
2. 用浏览器打开同一 URL → **查看网页源代码**，搜索 `noindex`。若无而 GSC 仍报 noindex，可能是**旧缓存**；点 **请求编入索引** 或等待重抓。
3. 确认 Search Console **资源**对应的是 **`https://wordok.top`**（与 `config.json` 里 `baseUrl`、canonical 一致），不要用错子域或旧 GitHub Pages 默认域。
4. 若前面有 **Cloudflare** 等：关闭对 Googlebot 的拦截 / 挑战页（挑战页有时带 noindex）。
