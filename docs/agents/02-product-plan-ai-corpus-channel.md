# 产品规划交接：`ai-corpus` 频道（兼容现有 wordok.top）

> **角色**：产品经理  
> **输入**：`01-business-research-ai-crawl-seo.md`  
> **输出**：本文件 → 工程实现、运营供稿规范

---

## 1. 目标

- 在 **不改动现有专栏商业模式与排期** 的前提下，新增 **`ai-corpus`** 频道，专门承载 **高结构化、便于 AI 与开发者抓取** 的英文参考文。
- 与现有 **`sites/*/posts/*.md` + 自动 sitemap** 流程 **100% 兼容**：仍为一站一 `config.json`，仍为 Markdown 供稿。

## 2. 非目标

- 不承诺特定搜索引擎或特定大模型的收录/引用排名。
- 不替代法律、医疗、投资建议；正文需保留「分析/参考」边界（由运营在文内声明）。

## 3. 信息架构

| 路径 | 说明 |
|------|------|
| `/ai-corpus/` | 频道首页（与现有站点同源生成） |
| `/ai-corpus/posts/{slug}/` | HTML 文章（与现有一致） |
| `/ai-corpus/posts/{slug}/plain.txt` | **纯文本镜像**（仅本频道写入 sitemap，控制体量） |
| `/llms.txt` | **全站**机器说明入口 |
| `/{site}/llms.txt` | **各频道**一句话说明 + 指向 HTML 列表与 RSS |

## 4. 文章模板（frontmatter + 正文块）

### 4.1 必填 frontmatter（与全站一致字段）

- `title`, `description`, `pubDate`, `author`（或依赖站点默认作者）  
- `category`, `tags`, `keywords`（英文）

### 4.2 本频道扩展字段（可选但强烈推荐）

- **`tldr`**：字符串，**单独一段**机器友好摘要（会出现在 `#machine-snapshot`）。  
- **`entities`**：字符串数组或逗号分隔，列出文中关键实体。  
- **`faq`**：3～5 组问答（与现有 `faq` 一致，进入 FAQPage JSON-LD）。

### 4.3 正文建议结构

1. `## Context` — 问题域与读者  
2. `## Machine-readable facts` — 列表/表格为主  
3. `## Human-readable discussion` — 简短论述（避免与 TL;DR 完全重复）  
4. `## Limits and caveats` — 边界  
5. （若主题相关）`## Emoji / symbols appendix` — 符号与编码说明  

## 5. 篇幅与批量策略

- **本频道最小正文字数**：**650 英文词**（不含 frontmatter），低于主资讯栏的 3000 词门槛；**批量篇数**：首期 **30 篇**。  
- 理由：语料型文章以 **密度与结构** 为主，与深度新闻长文分工不同；后续若需与主栏对齐可再升字数。

## 6. 成功指标（观测向）

- 构建通过、sitemap 含 `plain.txt`（仅 ai-corpus）。  
- 文章均含 `tldr` + `entities` + `faq`。  
- 根 `llms.txt` 可被公开访问（部署后手工或脚本 GET 校验）。

## 7. 给工程的验收清单

- [ ] 新站点 `sites/ai-corpus/config.json` 被 `getAllSites()` 发现。  
- [ ] 文章页在 `ai-corpus` 展示 **machine snapshot**（有 tldr/entities 时）。  
- [ ] `plain.txt` 路由可构建；**sitemap 仅 ai-corpus 帖子** 增加 plain URL。  
- [ ] 根与各站 `llms.txt` 可构建。  
- [ ] `channel-nav` 展示新频道名称。

---

**产品结论**：用 **独立频道 + 轻量协议文件（llms.txt）+ 纯文本镜像** 承接「AI 抓取友好」需求，主站与其它频道逻辑不变。
