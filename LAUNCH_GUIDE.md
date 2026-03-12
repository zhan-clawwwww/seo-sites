# 上线运营指南 (Launch & Operations Guide)

## 一、上线前清单 (Pre-Launch Checklist)

### 1.1 必须完成的配置

#### 域名与 baseUrl
- [ ] 购买域名（推荐 Namecheap、Cloudflare Registrar）
- [ ] 编辑 `sites/site-a/config.json`，将 `baseUrl` 改为你的真实域名
- [ ] 如果你的站点部署在根目录而非子路径，确认 URL 结构正确

#### 联系信息（真实邮箱）
- [ ] 更新 `config.json` 中的 `contact.email`（通用联系邮箱）
- [ ] 更新 `contact.privacyEmail`（隐私相关邮箱）
- [ ] 更新 `contact.businessEmail`（商业合作邮箱）
- [ ] 推荐使用域名邮箱（如 contact@yourdomain.com），提升可信度

#### 社交媒体链接
- [ ] 创建对应的社交媒体账号（Twitter/X、LinkedIn 等）
- [ ] 更新 `config.json` 中的 `social` 字段为真实链接

#### 作者信息
- [ ] 编辑 `src/lib/authors.ts`，替换示例作者为真实信息
- [ ] 确保每位作者有合理的 bio、expertise、社交链接

### 1.2 分析与监控配置

#### Google Analytics 4
1. 前往 [analytics.google.com](https://analytics.google.com) 创建账号
2. 创建数据流（Web），获取 Measurement ID（格式：`G-XXXXXXXXXX`）
3. 填入 `config.json` 的 `analytics.ga4Id` 字段

#### Cloudflare Web Analytics（可选，隐私友好替代）
1. 在 Cloudflare Dashboard → Web Analytics 添加站点
2. 获取 Beacon Token
3. 填入 `config.json` 的 `analytics.cfBeacon` 字段

> 提示：两个分析工具可以同时使用，互不冲突

### 1.3 评论系统配置（可选）

#### Giscus（基于 GitHub Discussions）
1. 前往 [giscus.app](https://giscus.app) 配置
2. 启用你的 GitHub 仓库的 Discussions 功能
3. 填入 `config.json` 的 `giscus` 字段：
   ```json
   "giscus": {
     "repo": "your-username/your-repo",
     "repoId": "R_xxxxxx",
     "category": "Announcements",
     "categoryId": "DIC_xxxxxx"
   }
   ```
4. 留空则不显示评论区

---

## 二、部署流程 (Deployment)

### 2.1 Cloudflare Pages（推荐）

#### 首次部署
1. 将代码推送到 GitHub/GitLab
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
3. Pages → Create a project → Connect to Git
4. 配置构建设置：
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. 添加环境变量（可选）：
   - `ENABLED_SITES`: `site-a`（控制启用哪些站点，逗号分隔）
6. 部署

#### 自定义域名
1. Pages 项目 → Custom domains
2. 添加你的域名
3. Cloudflare 会自动配置 DNS 和 SSL

#### 后续更新
```bash
git add . && git commit -m "update content" && git push
# Cloudflare Pages 会自动触发重新构建部署
```

### 2.2 其他部署平台

项目输出纯静态文件（`dist/`），可部署到任何静态托管：
- **Vercel**: 选择 Astro 框架，构建命令 `npm run build`
- **Netlify**: 构建命令 `npm run build`，发布目录 `dist`
- **GitHub Pages**: 使用 GitHub Actions 自动构建

---

## 三、Google Search Console 设置 (GSC Setup)

### 3.1 提交站点
1. 前往 [search.google.com/search-console](https://search.google.com/search-console)
2. 添加资源 → URL 前缀 → 输入你的域名
3. 验证所有权（推荐 DNS 验证或 Cloudflare 自动验证）

### 3.2 提交 Sitemap
1. GSC → Sitemap → 添加新站点地图
2. 输入：`https://yourdomain.com/site-a/sitemap.xml`
3. 提交并等待处理

### 3.3 请求索引
1. GSC → URL 检查 → 输入首页 URL
2. 点击「请求编入索引」
3. 重复操作，优先提交：
   - 首页 `/{site}/`
   - 文章列表 `/{site}/posts/`
   - 前 3-5 篇核心文章

### 3.4 监控
- **覆盖率**：每周检查是否有索引错误
- **效果**：监控关键词排名和点击
- **体验**：关注 Core Web Vitals 报告

---

## 四、内容运营策略 (Content Operations)

### 4.1 内容发布节奏

#### 新站期（1-3 个月）
- 每周发布 **2-3 篇**高质量文章
- 每篇文章 **1500-3000 字**
- 优先攻克**长尾关键词**（竞争度低、转化率高）

#### 成长期（3-6 个月）
- 每周发布 **1-2 篇**文章
- 开始攻克**中等竞争度**关键词
- 定期更新旧文章（添加 `updatedDate`）

#### 稳定期（6+ 个月）
- 每周 **1 篇**新文章 + 每月更新 **2-3 篇**旧文章
- 攻克**高竞争度**关键词
- 构建**主题簇**（Topic Clusters）

### 4.2 文章写作模板

每篇新文章需包含以下 frontmatter：

```markdown
---
title: "具体、包含目标关键词的标题"
description: "150-160字符的精准描述，包含关键词"
pubDate: "2025-02-06"
keywords: ["主关键词", "长尾关键词1", "长尾关键词2"]
author: "tech-team"
faq:
  - question: "常见问题1？"
    answer: "详细回答..."
  - question: "常见问题2？"
    answer: "详细回答..."
---
```

### 4.3 内容质量要求
- 标题包含目标关键词，60 字符以内
- Description 包含关键词，150-160 字符
- 使用 H2/H3/H4 层次结构（自动生成目录）
- 每篇文章包含 3-5 个 FAQ（自动生成 FAQPage Schema）
- 添加内部链接到相关文章
- 使用列表、表格、代码块增强可读性

### 4.4 索引释放策略

#### 全量释放（当前默认）
`sites/site-a/index-schedule.json` 的 `strategy` 设为 `"all"`

#### 渐进式释放（新站推荐）
```json
{
  "strategy": "gradual",
  "launchDate": "2025-02-06T00:00:00Z",
  "releaseIntervalHours": 48,
  "postsPerRelease": { "min": 1, "max": 2 },
  "initialPosts": ["your-first-post", "your-second-post"],
  "releaseSchedule": []
}
```

更新释放计划：
```bash
npm run index:update site-a
```

---

## 五、SEO 持续优化 (Ongoing SEO)

### 5.1 每周任务
- [ ] 检查 GSC 覆盖率报告，修复索引错误
- [ ] 分析 GA4 流量数据，识别高潜力关键词
- [ ] 发布 1-3 篇新文章
- [ ] 检查 Web Vitals 指标（LCP < 2.5s, INP < 200ms, CLS < 0.1）

### 5.2 每月任务
- [ ] 更新 2-3 篇旧文章（添加新信息、更新数据）
- [ ] 分析关键词排名变化，调整内容策略
- [ ] 审查内部链接结构
- [ ] 检查死链和 404 错误
- [ ] 分析竞争对手内容，寻找内容缺口

### 5.3 每季度任务
- [ ] 全面内容审计
- [ ] 更新隐私政策和服务条款（如有变更）
- [ ] 评估是否需要新增站点
- [ ] 技术 SEO 审计（页面速度、结构化数据验证）

### 5.4 关键指标 (KPIs)
| 指标 | 目标 | 监控工具 |
|------|------|----------|
| 自然搜索流量 | 月增长 20%+ | GA4 |
| 索引页面数 | 100%已发布文章 | GSC |
| 平均排名位置 | Top 20 → Top 10 | GSC |
| LCP | < 2.5s | Web Vitals / GA4 |
| CLS | < 0.1 | Web Vitals / GA4 |
| 点击率 (CTR) | > 3% | GSC |

---

## 六、多站点管理 (Multi-Site Management)

### 6.1 添加新站点
```bash
# 1. 创建站点目录
mkdir sites/my-new-site
mkdir sites/my-new-site/posts

# 2. 创建配置文件
# 复制 sites/site-a/config.json 并修改

# 3. 创建索引释放配置
# 复制 sites/site-a/index-schedule.json 并修改

# 4. 启用站点（环境变量或代码）
# 方式A: 设置环境变量 ENABLED_SITES=site-a,my-new-site
# 方式B: 编辑 src/lib/site-data.ts 修改默认值
```

### 6.2 多域名部署
每个站点可以部署到独立域名：
1. 创建多个 Cloudflare Pages 项目
2. 每个项目设置不同的 `ENABLED_SITES` 环境变量
3. 各自绑定独立域名

---

## 七、已集成功能清单 (Feature Summary)

| 功能 | 状态 | 配置位置 |
|------|------|----------|
| SEO Meta 标签 | ✅ 已启用 | 自动 |
| Open Graph | ✅ 已启用 | 自动 |
| Twitter Card | ✅ 已启用 | 自动 |
| 结构化数据 (Schema) | ✅ 已启用 | 自动 |
| Sitemap.xml | ✅ 已启用 | `/{site}/sitemap.xml` |
| Robots.txt | ✅ 已启用 | `/{site}/robots.txt` |
| 阅读时间 | ✅ 已启用 | 自动 |
| 目录导航 (TOC) | ✅ 已启用 | 自动（≥3个标题时显示） |
| 相关文章推荐 | ✅ 已启用 | 基于关键词智能匹配 |
| Google Analytics 4 | ⚙️ 待配置 | `config.json → analytics.ga4Id` |
| Cloudflare Analytics | ⚙️ 待配置 | `config.json → analytics.cfBeacon` |
| 站内搜索 (Pagefind) | ✅ 已启用 | 构建时自动索引 |
| 评论系统 (Giscus) | ⚙️ 待配置 | `config.json → giscus` |
| Web Vitals 监控 | ✅ 已启用 | 自动上报到 GA4 |
| 暗色模式 | ✅ 已启用 | 跟随系统偏好 |
| 响应式设计 | ✅ 已启用 | 自动 |
| E-E-A-T 信号 | ✅ 已启用 | 作者系统 + 联系页 + 结构化数据 |
| 多站点支持 | ✅ 已启用 | `ENABLED_SITES` 环境变量 |
| 索引释放策略 | ✅ 已启用 | `index-schedule.json` |

---

## 八、常用命令 (Common Commands)

```bash
# 本地开发
npm run dev

# 构建（含搜索索引）
npm run build

# 构建（不含搜索索引）
npm run build:no-search

# 本地预览构建结果
npm run preview

# 更新索引释放计划
npm run index:update site-a

# 添加新文章
# 在 sites/site-a/posts/ 创建新的 .md 文件，然后重新构建
```

---

## 九、故障排查 (Troubleshooting)

### 构建失败
- 检查 `config.json` 格式是否正确（JSON 语法）
- 确认文章 frontmatter 的 YAML 格式正确
- 运行 `npx astro check` 检查类型错误

### 搜索不工作
- 搜索功能仅在 `npm run build` 后可用（开发模式不可用）
- 检查 `dist/pagefind/` 目录是否生成

### 文章不显示
- 检查 `index-schedule.json` 策略设置
- 确认文章 slug 正确（文件名去掉 .md）
- 确认站点已启用（在 `ENABLED_SITES` 中）

### Web Vitals 数据未上报
- 确认 GA4 ID 已正确配置
- 在浏览器 Console 查看本地日志 `[Web Vitals]`
