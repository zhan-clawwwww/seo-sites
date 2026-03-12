# Google 索引节奏策略说明

## 📋 策略概述

为了安全、稳定地建立 Google 索引，我们采用**渐进式内容释放策略**：

1. **首次上线**：只暴露首页和 2-3 篇核心文章
2. **渐进释放**：每 48 小时自动放出 1-2 篇文章
3. **配置驱动**：通过 `index-schedule.json` 控制，无需删除文件
4. **Git 触发**：通过一次 `git push` 即可触发新内容放出

---

## 🎯 核心原则

### 为什么需要索引节奏？

1. **避免被判定为低质量站点**：一次性放出大量内容可能被 Google 视为内容农场
2. **建立信任度**：逐步释放内容有助于建立站点的权威性
3. **监控索引质量**：可以观察每批内容的索引效果，及时调整策略
4. **降低风险**：如果某批内容有问题，影响范围可控

### 策略模式

- **`gradual`**（推荐）：基于时间的自动计算，每 48 小时放出 1-2 篇
- **`manual`**：完全手动控制，通过 `releaseSchedule` 精确指定每批文章
- **`all`**：一次性放出所有文章（不推荐用于新站点）

---

## 📁 文件结构

```
sites/
  site-a/
    config.json              # 站点配置
    index-schedule.json      # 索引节奏配置 ⭐
    posts/
      hello-astro.md
      seo-checklist.md
      ... (其他文章)
```

---

## ⚙️ 配置文件说明

### `sites/site-a/index-schedule.json`

```json
{
  "strategy": "gradual",
  "launchDate": "2025-01-27T00:00:00Z",
  "releaseIntervalHours": 48,
  "postsPerRelease": {
    "min": 1,
    "max": 2
  },
  "initialPosts": [
    "hello-astro",
    "seo-checklist"
  ],
  "releaseSchedule": [
    {
      "releaseDate": "2025-01-27T00:00:00Z",
      "posts": ["hello-astro", "seo-checklist"]
    }
  ]
}
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `strategy` | `"gradual" \| "manual" \| "all"` | 策略模式 |
| `launchDate` | `string` (ISO 8601) | 站点上线时间 |
| `releaseIntervalHours` | `number` | 释放间隔（小时），默认 48 |
| `postsPerRelease.min` | `number` | 每批最少放出文章数 |
| `postsPerRelease.max` | `number` | 每批最多放出文章数 |
| `initialPosts` | `string[]` | 首次上线时放出的文章 slug 列表 |
| `releaseSchedule` | `Array<{releaseDate, posts}>` | 手动模式的释放计划 |

---

## 🚀 使用方法

### 1. 首次上线配置

编辑 `sites/site-a/index-schedule.json`：

```json
{
  "strategy": "gradual",
  "launchDate": "2025-01-27T00:00:00Z",  // 改为实际上线时间
  "releaseIntervalHours": 48,
  "postsPerRelease": {
    "min": 1,
    "max": 2
  },
  "initialPosts": [
    "hello-astro",
    "seo-checklist"
  ],
  "releaseSchedule": [
    {
      "releaseDate": "2025-01-27T00:00:00Z",
      "posts": ["hello-astro", "seo-checklist"]
    }
  ]
}
```

### 2. 自动计算下一批（推荐）

运行脚本自动计算应该放出的文章：

```bash
node scripts/update-index-schedule.mjs site-a
```

脚本会：
- 计算当前时间距离上线时间过了多少个 48 小时周期
- 自动确定下一批应该放出的文章
- 更新 `releaseSchedule` 配置

**输出示例：**
```
📊 站点: site-a
📝 总文章数: 10
📅 策略: gradual
🚀 上线时间: 2025-01-27T00:00:00Z

⏰ 已到释放时间，准备放出下一批文章:
   文章列表: post-3, post-4
   释放时间: 2025-01-29T00:00:00Z

✅ 完成！下次构建时将包含这些文章。
```

### 3. 手动指定要放出的文章

如果需要提前或延后放出特定文章：

```bash
node scripts/update-index-schedule.mjs site-a --manual post-5 post-6
```

这会立即将 `post-5` 和 `post-6` 添加到释放计划中。

### 4. 触发构建和部署

更新配置后，通过 Git 提交并推送：

```bash
git add sites/site-a/index-schedule.json
git commit -m "chore: 释放下一批文章 (post-3, post-4)"
git push
```

如果使用 CI/CD，推送后会自动触发构建，新文章将被包含在构建结果中。

---

## 🔍 工作原理

### 构建时过滤

在 `src/lib/site-data.ts` 中，`getAllPosts()` 函数会：

1. 读取所有文章
2. 检查 `index-schedule.json` 配置
3. 根据当前时间和策略，计算应该放出的文章
4. 只返回应该被构建的文章

**关键代码：**
```typescript
// 应用索引节奏策略：只返回应该被构建的文章
if (siteSlug) {
  const allPostSlugs = posts.map((p) => p.slug);
  return posts.filter((p) => shouldBuildPost(siteSlug, p.slug, allPostSlugs));
}
```

### 时间计算逻辑

**Gradual 模式：**
```
已过周期数 = floor((当前时间 - 上线时间) / 48小时)
应放出文章数 = 初始文章数 + 已过周期数 × 每周期文章数
```

**Manual 模式：**
- 只返回 `releaseSchedule` 中 `releaseDate <= 当前时间` 的所有批次文章

---

## 📊 当前状态查询

### 查看已放出的文章

运行脚本（不更新配置）：

```bash
node scripts/update-index-schedule.mjs site-a
```

输出会显示：
- 当前已放出的文章列表
- 下一批释放时间
- 总文章数和已放出数量

### 检查构建结果

构建后检查 `dist/` 目录：

```bash
npm run build
ls dist/site-a/posts/
```

只应该看到已放出的文章对应的 HTML 文件。

---

## ⚠️ 注意事项

### 1. 时间同步

- 确保服务器时间准确（使用 UTC）
- `launchDate` 使用 ISO 8601 格式（UTC 时间）

### 2. 文章顺序

- 文章按 `pubDate` 排序，优先放出较早的文章
- 如需自定义顺序，使用 `manual` 模式

### 3. Sitemap 自动更新

- Sitemap 只包含已放出的文章
- 新文章放出后，sitemap 会自动更新

### 4. 回滚

如果需要撤回某篇文章：

1. 从 `releaseSchedule` 中移除对应的批次
2. 或从 `initialPosts` 中移除（如果是初始文章）
3. 重新构建并部署

### 5. 测试

在本地测试时，可以临时修改 `launchDate` 为过去的时间，验证策略是否正常工作。

---

## 📈 最佳实践

### 首次上线

1. 选择 2-3 篇**质量最高**的文章作为 `initialPosts`
2. 确保这些文章有完整的 SEO 优化（title、description、canonical）
3. 提交到 GSC 并请求索引

### 渐进释放

1. **每 48 小时**运行一次脚本，检查是否有新文章需要放出
2. 可以设置**定时任务**（GitHub Actions、Cron）自动运行脚本
3. 每次放出后，在 GSC 中提交更新的 sitemap

### 监控

1. 在 GSC 中监控每批文章的索引状态
2. 如果某批文章索引异常，暂停释放，排查问题
3. 根据索引效果调整 `releaseIntervalHours` 和 `postsPerRelease`

---

## 🔧 高级用法

### 自定义释放间隔

修改 `releaseIntervalHours`：

```json
{
  "releaseIntervalHours": 24,  // 改为每 24 小时
  "postsPerRelease": {
    "min": 2,
    "max": 3  // 每批放出 2-3 篇
  }
}
```

### 完全手动控制

切换到 `manual` 模式：

```json
{
  "strategy": "manual",
  "releaseSchedule": [
    {
      "releaseDate": "2025-01-27T00:00:00Z",
      "posts": ["post-1", "post-2"]
    },
    {
      "releaseDate": "2025-01-29T00:00:00Z",
      "posts": ["post-3"]
    },
    {
      "releaseDate": "2025-02-01T00:00:00Z",
      "posts": ["post-4", "post-5"]
    }
  ]
}
```

### 批量添加文章

如果需要一次性添加多篇文章到释放计划：

```bash
# 方式1: 多次运行脚本
node scripts/update-index-schedule.mjs site-a --manual post-1
node scripts/update-index-schedule.mjs site-a --manual post-2 post-3

# 方式2: 直接编辑 index-schedule.json
# 在 releaseSchedule 中添加新的批次
```

---

## 📝 示例工作流

### 场景：10 篇文章，首次上线 2 篇，每 48 小时放出 1 篇

**第 0 天（上线）：**
```bash
# 配置初始文章
# initialPosts: ["post-1", "post-2"]
npm run build && npm run deploy
```

**第 2 天：**
```bash
# 自动计算：应该放出 post-3
node scripts/update-index-schedule.mjs site-a
git add sites/site-a/index-schedule.json
git commit -m "chore: 释放 post-3"
git push  # 触发 CI/CD 构建
```

**第 4 天：**
```bash
# 自动计算：应该放出 post-4
node scripts/update-index-schedule.mjs site-a
git add sites/site-a/index-schedule.json
git commit -m "chore: 释放 post-4"
git push
```

**持续进行...**

---

## 🎓 总结

通过索引节奏策略，我们可以：

✅ **安全上线**：避免一次性放出大量内容  
✅ **可控释放**：精确控制每批放出的文章  
✅ **自动化**：通过脚本和 Git 触发，无需手动操作  
✅ **可追溯**：所有释放记录都在 `releaseSchedule` 中  
✅ **灵活调整**：支持自动和手动两种模式  

**记住：** 一次 `git push` 即可触发新内容放出！🚀

