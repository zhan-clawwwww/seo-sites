# Astro 多站点（SEO 友好）静态站点模板

这个仓库是一个 **Astro 纯 SSG（静态输出）站群模板**，站点内容按目录拆分：

```text
/
├── sites/
│   ├── site-a/
│   │   ├── config.json     # 站点名、描述、关键词、baseUrl
│   │   └── posts/*.md      # Markdown 文章
│   └── site-b/
│       ├── config.json
│       └── posts/*.md
└── src/pages/              # 动态路由 + getStaticPaths 从 /sites 生成静态页面
```

- **上线清单**：[`PRODUCTION_READY.md`](./PRODUCTION_READY.md)（站点内容说明、图片、配置、部署检查）
- **详细流程**：[`LAUNCH_GUIDE.md`](./LAUNCH_GUIDE.md)

## 功能

- **多站点**：`sites/{site-slug}/`（可继续复制扩展）
- **每站点独立 SEO 信息**：从 `sites/{site}/config.json` 读取（name/description/keywords/baseUrl）
- **自动生成 `sitemap.xml`（按站点）**：`/{site}/sitemap.xml`
- **自动生成 `robots.txt`（按站点）**：`/{site}/robots.txt`
- **Markdown 内容**：`sites/{site}/posts/*.md`
- **页面结构**：站点首页 `/{site}/`、文章列表 `/{site}/posts/`、文章详情 `/{site}/posts/{slug}/`
- **纯静态输出（SSG）**：`astro.config.mjs` 中 `output: "static"`

## 高级功能

- **索引释放策略（index-schedule）**：支持全量发布或渐进式释放，按站点控制文章索引节奏
- **Pagefind 站内搜索**：构建后自动生成搜索索引，页面端动态加载搜索 UI
- **作者系统（E-E-A-T）**：支持作者档案、默认作者映射、文章级作者标识
- **相关文章推荐**：基于关键词匹配推荐同站点相关文章
- **Web Vitals 监控**：采集 LCP / INP / CLS / FCP / TTFB，可上报到 GA4
- **评论系统（Giscus）**：按站点配置 GitHub Discussions 评论，未配置时自动隐藏

## 使用方式

先安装依赖：

```sh
npm install
```

本地开发：

```sh
npm run dev
```

构建静态站点：

```sh
npm run build
```

## 部署前必做

每个站点的 `sites/{site}/config.json` 都有 `baseUrl`（用于 canonical / sitemap / robots 的绝对 URL）。
请把它改成你实际要部署的域名（例如 `https://example.com`），如果你的站点部署在子路径（例如 `https://example.com/site-a/`），那 `baseUrl` 也要包含该子路径。
