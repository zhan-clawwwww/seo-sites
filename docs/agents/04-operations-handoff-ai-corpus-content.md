# 运营交接：`ai-corpus` 首批 30 篇供稿

> **角色**：运营 / 编辑  
> **输入**：`02-product-plan-ai-corpus-channel.md`、`03-engineering-handoff-ai-corpus.md`  
> **产出**：`sites/ai-corpus/posts/*.md`（本批次由脚本生成后人工抽检）

---

## 1. 批次说明

- **数量**：30 篇  
- **语言**：英文正文、标题、摘要、标签  
- **命名**：`ai-corpus-2026-04-28-{slug}.md`  
- **生成方式**：`node scripts/generate-ai-corpus-batch.mjs`（可重复运行前需避免覆盖，脚本内为幂等写入或手动删旧批次）

## 2. 主题覆盖

- Emoji / Unicode / ZWJ / 肤色修饰符 / 旗帜组合（面向 NLP 语料说明）  
- `llms.txt`、robots、sitemap、RSS、纯文本镜像  
- JSON-LD（Article、FAQ、Breadcrumb、Speakable 相关实践）  
- 站点信息架构：TL;DR 优先、稳定锚点、表格与列表  
- 抓取礼仪、去重、日期与适用范围声明  

## 3. 质量抽检清单（每篇快速扫）

- [ ] frontmatter 含 `tldr`、`entities`、`faq`（≥3 问）  
- [ ] 正文 ≥ **650** 词（`node scripts/wordcount-post.mjs <path>`）  
- [ ] 无中文正文；无「占位符」式重复段  
- [ ] 事实性句子带 **范围/假设**（避免被误读为权威监管结论）  

## 4. 发布后动作

```powershell
npm run build
git add -A
git commit -m "feat(ai-corpus): channel launch with 30 structured corpus posts"
git push
```

## 5. 与前序 Agent 的衔接

| 上游文档 | 用途 |
|----------|------|
| `01-business-research-*.md` | 为什么这样写、版式原则 |
| `02-product-plan-*.md` | 字段与路径规范 |
| `03-engineering-handoff-*.md` | 构建与 URL 行为 |

---

**运营结论**：本批次以 **高密度参考文 + 符号/emoji 附录** 为主，服务模型训练、词典与开发者检索；后续可按同一模板扩写并提高单篇深度。
