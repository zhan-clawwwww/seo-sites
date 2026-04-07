# Token Relay 安全审计（静态代码审查）

**范围**：`token-relay/worker/src`（2026-04-07）  
**结论**：**有条件通过** — 上线前须完成 KV id 配置、联盟链接替换，并理解「用户自带 Key」带来的责任边界。

---

## 已落实的控制

| 项 | 说明 |
|----|------|
| 上游 SSRF 缓解 | OpenAI / Anthropic / Gemini 路径使用白名单正则，禁止任意 URL 转发 |
| 鉴权 | 代理路由需有效 relay token；无效返回 401 |
| 速率限制 | IP 与 token 双维度 KV 滑动窗口（注意免费 KV 写入上限） |
| 响应头 | `X-Robots-Tag: noindex` 降低 API 被索引风险 |
| Key 格式校验 | OpenAI `sk-`、Anthropic `sk-ant-`、Gemini 最小长度 |

---

## 残留风险与建议

| 风险 | 级别 | 建议 |
|------|------|------|
| KV 中明文存储用户 API Key | 高（数据面） | 接受场景为「用户自管 Key」；长期可评估加密字段或用户侧加密 |
| `POST /api/keys/submit` 无额外人机验证 | 中 | 易被批量注册；可加 Turnstile、管理员审批或邀请码 |
| `GET /api/stats` 公开 | 低 | 仅聚合数字；敏感时可加轻量鉴权或缓存 CDN |
| CORS `*` | 中 | 便于浏览器 demo；若仅服务器调用可收紧为固定 Origin |
| 联盟 302 被滥用刷点击 | 低 | 已依赖 KV 写入；高流量时需防刷策略 |

---

## 依赖与供应链

- `wrangler`、TypeScript 由 npm 锁定版本；建议定期 `npm audit` 与升级 Wrangler 大版本前读迁移说明。

---

## 审计签字

- **审计 Agent**：基于 PLAN/API 与源码对照的静态审查。  
- **复测**：部署后按 `docs/TEST.md` 执行；重大变更后重新跑脚本与抽样 curl。
