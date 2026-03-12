# 索引节奏策略 - 快速开始

## 🎯 核心功能

通过配置文件控制文章构建，实现安全的 Google 索引节奏：
- ✅ 首次上线只暴露首页 + 2-3 篇文章
- ✅ 每 48 小时自动放出 1-2 篇文章
- ✅ 通过 `git push` 触发新内容放出
- ✅ 无需删除文件，配置驱动

---

## 📋 首次上线配置

### 1. 编辑配置文件

编辑 `sites/site-a/index-schedule.json`：

```json
{
  "strategy": "gradual",
  "launchDate": "2025-01-27T00:00:00Z",  // 改为实际上线时间（UTC）
  "releaseIntervalHours": 48,
  "postsPerRelease": {
    "min": 1,
    "max": 2
  },
  "initialPosts": [
    "hello-astro",
    "seo-checklist"
  ]
}
```

### 2. 构建和部署

```bash
npm run build
# 部署到服务器
```

**结果：** 只有 `initialPosts` 中的文章会被构建和索引。

---

## 🚀 释放下一批文章（每 48 小时）

### 方法一：自动计算（推荐）

```bash
# 1. 运行脚本，自动计算应该放出的文章
node scripts/update-index-schedule.mjs site-a

# 2. 如果脚本显示"已到释放时间"，会自动更新配置
# 3. 提交并推送
git add sites/site-a/index-schedule.json
git commit -m "chore: 释放下一批文章"
git push
```

### 方法二：手动指定

```bash
# 手动指定要放出的文章
node scripts/update-index-schedule.mjs site-a --manual post-3 post-4

# 提交并推送
git add sites/site-a/index-schedule.json
git commit -m "chore: 手动释放 post-3, post-4"
git push
```

---

## 📊 查看当前状态

```bash
node scripts/update-index-schedule.mjs site-a
```

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

📈 当前已放出文章 (4/10):
   hello-astro, seo-checklist, post-3, post-4
```

---

## 🔍 验证构建结果

```bash
# 构建后检查
npm run build

# 查看构建出的文章
ls dist/site-a/posts/
# 应该只看到已放出的文章对应的 HTML 文件
```

---

## ⚙️ 工作原理

1. **构建时过滤**：`src/lib/site-data.ts` 中的 `getAllPosts()` 会根据 `index-schedule.json` 过滤文章
2. **时间计算**：脚本根据 `launchDate` 和 `releaseIntervalHours` 计算应该放出的文章
3. **配置更新**：脚本自动更新 `releaseSchedule`，记录每次释放的文章
4. **Git 触发**：推送后，CI/CD 自动构建，新文章被包含

---

## 📝 配置说明

| 字段 | 说明 | 示例 |
|------|------|------|
| `strategy` | 策略模式：`gradual`（自动）或 `manual`（手动） | `"gradual"` |
| `launchDate` | 上线时间（UTC，ISO 8601） | `"2025-01-27T00:00:00Z"` |
| `releaseIntervalHours` | 释放间隔（小时） | `48` |
| `postsPerRelease.min` | 每批最少文章数 | `1` |
| `postsPerRelease.max` | 每批最多文章数 | `2` |
| `initialPosts` | 首次上线时放出的文章 slug 列表 | `["post-1", "post-2"]` |

---

## 🎓 完整文档

详细说明请查看：`INDEX_SCHEDULE.md`

---

## ⚠️ 重要提示

1. **时间格式**：`launchDate` 必须使用 UTC 时间（ISO 8601）
2. **文章 slug**：`initialPosts` 中的 slug 必须与文件名（不含 `.md`）完全一致
3. **构建验证**：每次构建后检查 `dist/` 目录，确认只有预期的文章被构建
4. **Sitemap 自动更新**：Sitemap 只包含已放出的文章，无需手动更新

---

## 🔄 典型工作流

```
第 0 天（上线）
├─ 配置 initialPosts: ["post-1", "post-2"]
├─ npm run build && deploy
└─ 提交到 GSC

第 2 天
├─ node scripts/update-index-schedule.mjs site-a
├─ git add && git commit && git push
└─ CI/CD 自动构建，post-3 被放出

第 4 天
├─ node scripts/update-index-schedule.mjs site-a
├─ git add && git commit && git push
└─ CI/CD 自动构建，post-4 被放出

持续进行...
```

---

**记住：一次 `git push` 即可触发新内容放出！** 🚀

