# SEO-Sites 项目待办清单

> 生成时间：2026-03-03
> 按优先级排序，建议从上到下依次完成

---

## 一、已完成 ✅

- [x] **首页添加 Open Graph / Twitter Card** — `src/pages/[site]/index.astro` 已传入 `openGraph` 和 `twitter` 参数
- [x] **站点配置支持 defaultImage** — `SiteConfig` 类型新增 `defaultImage` 字段，文章无 image 时自动 fallback；`site-a/config.json` 已添加示例值

---

## 二、上线前必须完成（需要你手动操作）

### 2.1 填写 analytics / giscus 配置
- [ ] 前往 [analytics.google.com](https://analytics.google.com) 创建 GA4 数据流，获取 `G-XXXXXXXXXX`
- [ ] 编辑 `sites/site-a/config.json`，填入 `analytics.ga4Id`
- [ ] （可选）在 Cloudflare Dashboard → Web Analytics 获取 Beacon Token，填入 `analytics.cfBeacon`
- [ ] （可选）前往 [giscus.app](https://giscus.app) 配置评论系统，填入 `giscus` 四个字段

### 2.2 确认联系邮箱
- [ ] 确认 `sites/site-a/config.json` 中 `contact` 的三个邮箱地址是否是你真实使用的
- [ ] 如果 site-b / vpn-usa 要上线，也需要配置各自的联系邮箱

### 2.3 确认域名和 baseUrl
- [ ] site-a 当前 `baseUrl` 为 `https://techreviewpro.com`，确认域名已购买并可用
- [ ] 准备一张 1200×630 的 OG 默认分享图，上传后替换 `config.json` 中 `defaultImage` 的 URL

### 2.4 部署
- [ ] 将代码推送到 GitHub
- [ ] 在 Cloudflare Pages 创建项目，连接 Git 仓库
- [ ] 构建命令：`npm run build`，输出目录：`dist`
- [ ] 环境变量设置 `ENABLED_SITES=site-a`
- [ ] 绑定自定义域名，等待 SSL 生效

### 2.5 Google Search Console
- [ ] 前往 [search.google.com/search-console](https://search.google.com/search-console) 添加资源
- [ ] 验证域名所有权（推荐 DNS 验证）
- [ ] 提交 Sitemap：`https://techreviewpro.com/site-a/sitemap.xml`
- [ ] 手动请求索引首页和前 5 篇核心文章

---

## 三、技术修复（代码改动）

### 3.1 高优先级

均已在上一轮完成 ✅

### 3.2 中优先级

#### 统一 trailing slash 策略
- [x] `astro.config.mjs` 中 `trailingSlash` 当前为 `'ignore'`，建议改为 `'always'`
- [x] 检查所有内部链接（`<a href>`）确保都以 `/` 结尾（当前代码中已经都带了尾部斜杠）
- [x] 确认 sitemap.xml 中的 URL 也统一使用尾部斜杠

#### Article Schema image 改为 ImageObject
- [x] 编辑 `src/pages/[site]/posts/[slug].astro`，将 `articleJsonLd` 中的：
  ```js
  ...(image ? { "image": image } : {})
  ```
  改为：
  ```js
  ...(image ? { "image": { "@type": "ImageObject", "url": image } } : {})
  ```

#### Web Vitals FID → INP
- [x] 编辑 `src/layouts/BaseLayout.astro`，将 Web Vitals 监控中的 FID（`first-input`）替换为 INP（`event`），参考代码：
  ```js
  var inpValue = 0;
  new PerformanceObserver(function(list) {
    list.getEntries().forEach(function(entry) {
      if (entry.duration > inpValue) inpValue = entry.duration;
    });
    sendMetric('INP', inpValue, 'v1');
  }).observe({ type: 'event', buffered: true, durationThreshold: 40 });
  ```

### 3.3 低优先级

#### privacy/terms lastUpdated 动态化
- [x] 编辑 `src/pages/[site]/privacy.astro` 和 `src/pages/[site]/terms.astro`
- [x] 将硬编码的 `const lastUpdated = "2025-01-27"` 改为：
  ```js
  const lastUpdated = new Date().toISOString().slice(0, 10);
  ```
  或者在 `config.json` 中添加 `legalLastUpdated` 字段

#### 列表页阅读时间使用正文
- [x] `src/pages/[site]/posts/index.astro` 和 `src/pages/[site]/index.astro` 中，阅读时间仅基于标题+描述
- [x] 改进方案：在 `site-data.ts` 的 `getAllPosts()` 中预计算每篇文章的阅读时间，存入返回对象
- [x] 已采用改进方案（列表页阅读时间已改为基于正文预计算）

---

## 四、配置完善

### 4.1 补全 site-b/config.json
- [x] 编辑 `sites/site-b/config.json`，补充以下字段：
  ```json
  {
    "name": "Site B",
    "description": "...",
    "keywords": ["..."],
    "baseUrl": "https://your-site-b-domain.com",
    "lang": "en",
    "defaultImage": "https://your-site-b-domain.com/og-default.png",
    "contact": {
      "email": "contact@your-site-b-domain.com",
      "privacyEmail": "privacy@your-site-b-domain.com",
      "businessEmail": "business@your-site-b-domain.com"
    },
    "social": {
      "twitter": "",
      "linkedin": ""
    },
    "analytics": {
      "ga4Id": "",
      "cfBeacon": ""
    },
    "giscus": {
      "repo": "",
      "repoId": "",
      "category": "",
      "categoryId": ""
    }
  }
  ```

### 4.2 补全 vpn-usa/config.json
- [x] 编辑 `sites/vpn-usa/config.json`，统一字段名（`siteName` → `name`），`keywords` 改为数组：
  ```json
  {
    "name": "Best USA VPN",
    "description": "Best VPN services for USA users",
    "keywords": ["usa vpn", "best vpn usa", "cheap vpn usa"],
    "baseUrl": "https://your-vpn-domain.com",
    "lang": "en",
    "defaultImage": "https://your-vpn-domain.com/og-default.png",
    "contact": { "email": "..." },
    "social": {},
    "analytics": { "ga4Id": "", "cfBeacon": "" }
  }
  ```

### 4.3 补充 authors.ts 中的作者
- [x] 编辑 `src/lib/authors.ts`，为 vpn-usa 添加专属作者：
  ```ts
  "vpn-expert": {
    id: "vpn-expert",
    name: "VPN Expert Team",
    bio: "...",
    expertise: ["VPN Reviews", "Online Privacy", "Network Security"],
  },
  ```
- [x] 更新 `getDefaultAuthorForSite()`：
  ```ts
  if (siteSlug === "vpn-usa") return authors["vpn-expert"];
  ```

---

## 五、内容修复

### 5.1 vpn-usa 文章批量修复（88 篇）
- [x] 为所有文章 frontmatter 添加 `author: "vpn-expert"`
- [x] 将 `keywords` 从字符串改为数组格式
- [x] 已用脚本 `scripts/fix-vpn-usa-posts.mjs` 批量处理
- [ ] **重要提醒**：vpn-usa 文章高度模板化，建议人工润色后再上线，否则有被搜索引擎判为低质量内容的风险

### 5.2 site-b welcome.md 修复
- [x] 编辑 `sites/site-b/posts/welcome.md`，补充 `keywords` 和 `author` 字段
- [ ] 如果 site-b 暂不上线，可跳过

---

## 六、文档对齐

### 6.1 LAUNCH_GUIDE.md
- [x] 第 186 行 `npm run index:update site-a` 命令需要确认 — `package.json` 中 `index:update` 脚本为 `node scripts/update-index-schedule.mjs`，参数会自动透传，实际可用
- [x] 第 197 行提到 `FID < 100ms`，FID 已被 INP 替代，建议改为 `INP < 200ms`

### 6.2 README.md
- [x] 补充以下高级功能说明：
  - 索引释放策略（index-schedule）
  - Pagefind 站内搜索
  - 作者系统（E-E-A-T）
  - 相关文章推荐
  - Web Vitals 监控
  - 评论系统（Giscus）
- [x] 添加指向 `LAUNCH_GUIDE.md` 的链接

---

## 七、长期运营（上线后持续执行）

### 每周
- [ ] 发布 1-2 篇高质量原创文章（site-a）
- [ ] 检查 GSC 覆盖率报告，修复索引错误
- [ ] 检查 GA4 流量数据

### 每月
- [ ] 更新 2-3 篇旧文章（尤其含年份标题的文章如 "2025"）
- [ ] 为文章添加高质量特色图片（用于 OG 分享）
- [ ] 审查内部链接结构，检查死链
- [ ] 分析关键词排名变化

### 每季度
- [ ] 全面内容审计
- [ ] Core Web Vitals 性能审查（PageSpeed Insights）
- [ ] 评估外链建设进度（客座文章、资源链接、行业目录）
- [ ] 更新 privacy/terms 页面的 lastUpdated 日期
- [ ] 评估是否需要新增站点

### 功能扩展（按需）
- [ ] 添加 RSS Feed 支持
- [ ] 添加 preload 关键资源优化 LCP
- [ ] 确认 SearchAction URL 模板与 Pagefind 搜索的兼容性
- [ ] 考虑将多站点部署到独立域名（对 SEO 更友好）
