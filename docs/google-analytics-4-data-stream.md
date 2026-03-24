# Google Analytics 4 — wordok.top 数据流（备案）

与 Google Analytics 管理后台 **数据流** 配置对应，便于运营与排查。

| 字段 | 值 |
|------|-----|
| **数据流名称** | wordok.top |
| **数据流网址** | https://wordok.top |
| **数据流 ID** | 13919786479 |
| **衡量 ID（Measurement ID）** | `G-JWYQZWRTBN` |

## 与代码的对应关系

- 各频道 `sites/*/config.json` 的 `analytics.ga4Id` 已设为 **`G-JWYQZWRTBN`**（与上表一致）。
- **门户首页** `/` 与 **HTML 站点地图** `/sitemap/` 使用 `src/lib/root-analytics.ts`：优先读构建环境变量 **`PUBLIC_GA4_MEASUREMENT_ID`**，否则回退到 **`G-JWYQZWRTBN`**，不再依赖「按字母排序的第一个站点」是否带 GA。
- GitHub Actions 部署（`.github/workflows/deploy.yml`）中已注入 **`PUBLIC_GA4_MEASUREMENT_ID`**，保证生产构建与后台数据流一致。

## GA4 后台自检

1. **管理 → 数据流 → wordok.top**，确认网址为 `https://wordok.top`。
2. **报告 → 实时**：部署后访问首页，应在数秒至数分钟内看到事件（需关闭过度拦截的广告插件）。

数据流 ID `13919786479` 仅用于在 GA 界面识别该流，**无需**写入网站代码。
