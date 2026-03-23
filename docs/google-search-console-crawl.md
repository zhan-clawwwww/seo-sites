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

## 若仍见「noindex」或异常

在 GSC 导出示例 URL，用浏览器「查看网页源代码」搜索 `noindex`。本站模板默认不输出 noindex；若某 URL 仍出现，请核对是否为缓存、旧版本或其它子域。
