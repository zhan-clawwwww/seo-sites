# wordok.top 网站运营 — 多 Agent 协作规划

> 目标：通过分工明确的 Agent 团队，持续运营好 wordok.top（VPN、AI、Apple、**第四专栏**）

---

## 一、现有状态

| 专栏 | slug | 状态 | 内容方向 |
|------|------|------|----------|
| VPN | vpn-usa | ✅ 已上线 | VPN 评测、购买指南、流媒体 |
| AI News | ai | ✅ 已上线 | AI 新闻、前沿研究 |
| Apple | apple | ✅ 已上线 | iPhone、MacBook 产品规格 |
| **第四专栏** | 待定 | ⬜ 待新增 | 见下方选型 |

---

## 二、第四专栏选型建议

| 备选 | slug | 关键词方向 | 与现有互补 | 内容来源 |
|------|------|------------|------------|----------|
| **Streaming** | streaming | vpn for netflix, disney+ vpn, streaming 4k | 与 VPN 强关联，可复用流媒体文章 | vpn-usa 部分文章迁移 + 新写 |
| **Tech Guides** | guides | how to vpn, vpn setup, internet security | 教学类高检索 | how-to 类文章聚合 |
| **Deals** | deals | best vpn deals 2026, iphone deals | 变现导向 | 季节性更新 |
| **Privacy Hub** | privacy | privacy tips, data protection, secure browsing | 与 Privacy & Security 专栏呼应 | 已有 4 篇 + 扩展 |

**推荐**：**Streaming** — 搜索量大、与 VPN 天然契合、可快速从现有文章归类起步。

---

## 三、Agent 团队架构（5 个 Agent）

### Agent 1：统筹规划（Architect）

**职责**：架构决策、新增专栏配置、sitemap/robots/导航一致性

**典型任务**：
- 新增站点：config.json、ENABLED_SITES、CHANNEL_LABELS、columnMeta
- 确保 sitemap.xml、HTML sitemap、robots.txt 包含新站点
- 首页 portal、导航栏、footer 链接更新

**产出**：代码改动清单、配置变更说明

---

### Agent 2：内容创作（Content Writer）

**职责**：选题、搜集资料、撰写英文 Markdown 文章

**典型任务**：
- 网上搜索目标关键词的英文资料
- 整理成 400–800 词原创风格文章
- 规范 frontmatter（title, description, keywords, topic, faq）
- 按站点放入对应 `sites/{site}/posts/`

**产出**：`.md` 文章文件

---

### Agent 3：质量与测试（QA Tester）

**职责**：构建验证、链接检查、SEO 可检索性

**典型任务**：
- 执行 `npm run build` 或 `npm run build:no-search`
- 检查 dist/ 下各站点、sitemap、robots.txt
- 验证新专栏页、新文章页是否生成
- 检查是否有 404、断裂链接

**产出**：测试报告（通过/失败项）

---

### Agent 4：SEO 与收录（SEO Operator）

**职责**：GSC 提交、IndexNow、收录监控

**典型任务**：
- 新站/新栏目 URL 在 GSC「检查网址」请求编入索引
- 运行 `npm run submit:indexnow:*` 提交 Bing
- 检查 sitemap 是否被爬虫正常解析（若 GSC 支持）

**产出**：收录状态汇总、待优化清单

---

### Agent 5：持续运营（Growth Manager）

**职责**：选题规划、更新节奏、数据分析建议

**典型任务**：
- 根据 GSC 关键词表现，提出新文章选题
- 制定 index-schedule 或发布节奏
- 建议旧文 updatedDate 更新批次
- 跨专栏内容联动建议（如 VPN + Streaming）

**产出**：运营计划文档、选题清单

---

## 四、本次任务：新增第四专栏 — 执行分工

| 步骤 | 负责 Agent | 具体动作 |
|------|------------|----------|
| 1 | Architect | 创建 `sites/streaming/`、config.json，更新 ENABLED_SITES、CHANNEL_LABELS、columnMeta、deploy.yml |
| 2 | Content Writer | 为 streaming 站点撰写 3–5 篇首发文章（可从 vpn-usa 流媒体类迁移或新写） |
| 3 | Architect | 确保 sitemap、HTML sitemap、首页 portal 包含 streaming |
| 4 | QA Tester | 构建验证，检查 dist/streaming/、sitemap 含新站点 |
| 5 | SEO Operator | （部署后）GSC 提交 streaming 首页，IndexNow 提交新 URL |

---

## 五、后续常态化协作流程

```
每周/每双周循环：
  Growth Manager → 产出选题清单
       ↓
  Content Writer → 撰写 1–2 篇新文
       ↓
  Architect → 若有新栏目/新站点则更新配置
       ↓
  QA Tester → 构建 + 链接检查
       ↓
  SEO Operator → 新 URL 提交收录
```

---

## 六、本次执行：Agent 数量与分工

**本次共 4 个 Agent 参与**（SEO Operator 部署后手动执行，可不纳入本次自动化）：

1. **Architect** — 新增 streaming 站点与全站配置
2. **Content Writer** — 撰写 streaming 首发文章
3. **QA Tester** — 构建与可用性测试
4. **Growth Manager**（可选）— 产出 streaming 后续选题方向，供 Content Writer 参考
