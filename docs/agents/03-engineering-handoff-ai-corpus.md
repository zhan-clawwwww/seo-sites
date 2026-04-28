# 工程交接：`ai-corpus` 实现说明

> **角色**：程序员  
> **输入**：`02-product-plan-ai-corpus-channel.md`  
> **输出**：本文件 + 代码变更

---

## 1. 变更一览

| 模块 | 变更 |
|------|------|
| `sites/ai-corpus/config.json` | 新站点配置 |
| `src/lib/channel-nav.ts` | `CHANNEL_LABELS.ai-corpus` |
| `src/lib/authors.ts` | `ai-corpus` 默认作者 `corpus-editor` |
| `src/lib/site-data.ts` | `PostFrontmatter` 扩展 `tldr?`、`entities?` |
| `src/pages/llms.txt.ts` | 根路径机器说明 |
| `src/pages/[site]/llms.txt.ts` | 分频道机器说明 |
| `src/pages/[site]/posts/[slug]/plain.txt.ts` | `text/plain` 正文导出 |
| `src/pages/sitemap.xml.ts` | 增加 `/llms.txt`；为 `ai-corpus` 每篇追加 `plain.txt` |
| `src/pages/[site]/posts/[slug].astro` | machine snapshot、Speakable JSON-LD、plain 链接 props |
| `src/layouts/BaseLayout.astro` / `AiNewsLayout.astro` | 可选 `alternatePlain` `<link rel="alternate">` |

## 2. `plain.txt` 生成规则

- 使用 `getPostRawContent(site, slug)` 取 Markdown 全文，**去掉 frontmatter**（`---` 块），UTF-8 输出。  
- **不**做复杂 Markdown→纯文本转换（列表保留 `-` 即可）；优先简单、可复现。

## 3. Machine snapshot

- 条件：`siteSlug === "ai-corpus"` 且 (`tldr` 或 `entities` 非空)。  
- DOM：`section#machine-snapshot[data-ai-corpus="true"]`，便于 CSS 选择器与 Speakable 对齐。

## 4. JSON-LD

- 保留现有 Article、Breadcrumb、FAQ。  
- 当存在 machine snapshot 时，追加 `WebPage` + `SpeakableSpecification`，`cssSelector`: `["#machine-snapshot", "article h1"]`。

## 5. 构建与回归

```powershell
npm run build
```

- 确认 `dist/llms.txt`、`dist/ai-corpus/llms.txt`、`dist/ai-corpus/posts/*/plain.txt` 存在（路径以实际 Astro 输出为准）。  
- 若 `trailingSlash: 'always'` 导致 `.txt` 带尾斜杠，以构建产物为准更新 sitemap 中的 loc（需与线上路由一致）。

## 6. 已知约束

- `plain.txt` 的 canonical 与 sitemap 需与 Astro 最终 URL 一致；若 CI 报 404，检查 `plain.txt.ts` 所在目录层级是否为 `[site]/posts/[slug]/plain.txt.ts`。

---

**工程状态**：见同次提交的 `sites/ai-corpus/posts/` 与脚本 `scripts/generate-ai-corpus-batch.mjs`（运营生成批次时使用）。
