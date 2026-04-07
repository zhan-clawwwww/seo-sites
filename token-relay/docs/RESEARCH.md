# AI Token API 中转站盈利模式调研报告

**调研日期**：2026-04-07  
**项目**：wordok.top — AI Token API 中转站  
**调研目标**：分析盈利模式，重点关注 0 成本启动方案

---

## 一、市场概述

### 1.1 市场背景

2026 年，中国 AI 市场进入 Token 高速增长阶段。日均 Token 消耗量已达百万亿级别，相较 2024 年初的千亿级直接暴增 1000 倍以上。Agent 爆发 + 多模态模型成熟，将调用量推向指数级增长。

**国内用户痛点（核心需求驱动力）**：
- 地域限制：OpenAI、Anthropic 等不对中国大陆开放直接访问
- 支付壁垒：官方要求海外信用卡，国内用户难以充值
- 账号风控：直连 IP 频繁触发封号
- 技术门槛：配置代理/VPN 对非技术用户难度大

这些痛点造就了中转站的强刚需市场，月入数万的个人站点大量涌现。

### 1.2 市场规模与竞争态势

- 竞争极为激烈，V2EX 等社区每天新增多个中转站
- 主要竞争维度：价格折扣、稳定性、号池质量、服务响应
- 市场已出现价格战：部分中转站以低至官方 2-3 折价格争夺用户
- 技术门槛低：新API/one-api 等开源系统可一键部署

---

## 二、主要竞品分析

| 平台 | 定价策略 | 核心特点 | 用户获取方式 |
|------|----------|----------|-------------|
| **poloapi** | 官方 3-5 折 | 大规模批发+技术优化降本 | SEO + 开发者社区 |
| **apiyi (API易)** | 官方约 8 折 | 本土化支付、高并发、技术支持 | 微信私域 + 知乎文章 |
| **147api** | 约官方 5 折 | 稳定性+专业运维 | B站/博客技术文章 |
| **OneToken** | 官方 22-34% | 支持 500+ 模型、透明计费 | 应用集成推广 |
| **api2d** | 官方约 1.6 倍 | 先行者品牌、开发者转售计划 | 早期 SEO 积累 |
| **OneChatAPI** | $0-$49/月订阅 | 面向西方市场、多模态 | 产品化 SaaS |
| **Sub2API** | 按 Token 计费 | 开源、拼车共享 | GitHub 开源社区 |

### 2.1 竞品 Landing Page 特征

- **核心卖点**：国内直连、无需翻墙、支付宝微信支付、价格比官方便宜
- **信任背书**：已服务 X 万用户、稳定运营 X 年、实时状态监控
- **免费试用**：注册送体验额度（$0.1-$1 不等）
- **透明计费**：实时调用记录、Token 级别账单

### 2.2 SEO 关键词竞争分析

高价值目标关键词（中文市场）：
- "OpenAI API 中转"、"ChatGPT API 国内使用"
- "Claude API 中转站"、"AI API 代理"
- "免翻墙 GPT API"、"国内 API 调用 ChatGPT"

---

## 三、盈利模式详解（按可行性排序）

### 模式 A：联盟营销 / Affiliate（★★★★★ 推荐优先级最高）

**特点：完全 0 成本，无需购买 API，纯流量变现**

#### A1. VPN 服务联盟（强烈推荐）

国内用户访问 AI API 需要 VPN，与中转站用户高度重合，转化率极高。

| VPN 服务 | 佣金结构 | Cookie 期限 | 备注 |
|----------|----------|------------|------|
| **NordVPN** | 新用户月付 100% / 年付 40% + 续费 30% | 30 天 | 支持全球流量含中国 |
| **ExpressVPN** | CPA $13(月) / $22(6月) / $36(年) | 30 天 | 需要网站有 VPN 内容 |
| **Surfshark** | 40% 基础 + 绩效奖励 | 30 天 | 高增长品牌 |

**预期收益**：每成功转化 1 个 NordVPN 年付用户 ≈ 约 $18-$36。

**关键优势**：用户访问中转站介绍页时，自然需要 VPN，购买意愿极强。

#### A2. AI 工具联盟（次要推荐）

Anthropic Claude Pro 官方推荐计划：
- 每成功推荐 1 个 Claude Pro 订阅（$20/月）= **$10 账户积分**
- 仅限积分奖励（非现金），适合自用场景

第三方 AI 工具（可现金提现）：
- **Writesonic**：30% 终身循环佣金，Cookie 30 天
- **Scalenut**：30% 循环佣金，Cookie 60 天
- **CustomGPT.ai**：20% 循环佣金（最长 2 年）

> **注意**：OpenAI 目前**无公开 affiliate 计划**（截至 2026 年 Q1），网上声称的 OpenAI affiliate 均为虚假信息。

---

### 模式 B：SEO 内容站 + Google Adsense（★★★★☆）

**特点：0 成本，需时间积累，适合 wordok.top 现有 SEO 站框架**

**运作方式**：
1. 建立"AI API 中转站"落地页，围绕目标关键词做 SEO 内容
2. 发布教程文章（如"如何在国内使用 ChatGPT API"）
3. 嵌入 Google Adsense 广告
4. 在文章中自然插入 VPN affiliate 链接

**内容策略**：
- 对比文章：各中转站价格横向对比（引流 + 广告曝光）
- 教程类：如何配置 OpenAI API Key、如何使用 Claude API
- 工具类：API 价格计算器、Token 费用估算表

**优势**：与现有 wordok.top SEO 站群完全同构，可复用框架。

---

### 模式 C：直接销售 Token（★★★☆☆）

**特点：需要前期资金投入，利润率高，但有成本和风险**

**定价策略**：
- 官方 GPT-4o：输入 $5/百万 token，输出 $15/百万 token
- 中转站普遍定价：官方 3-5 折（通过批量采购 + 账号池降低成本）
- 建议定价：官方 6-8 折，留出竞争余地同时保证利润

**成本结构**：
- 上游 API 成本（主要成本项）
- 服务器费用：1-2 台 VPS，约 $20-50/月
- 开源系统：new-api / one-api（完全免费）

**风险**：
- 账号封禁风险（Anthropic 已加强限制）
- 价格战压力（竞争对手持续压价）
- 刷量/盗用风险

**起步资金建议**：$100-$200 测试规模

---

### 模式 D：订阅制服务（★★★☆☆）

**特点：现金流稳定，适合有一定用户基础后推出**

参考竞品定价：

| 套餐 | 月费 | Token 额度 | 目标用户 |
|------|------|-----------|---------|
| 免费 | $0 | 100k tokens | 引流试用 |
| 入门 | $9 | 2M tokens | 轻量开发者 |
| 专业 | $49 | 10M tokens | 生产环境 |
| 企业 | 定制 | 无限 | 团队/企业 |

**建议**：前期不做订阅，先做 SEO 和 affiliate 积累用户，后期再推出付费计划。

---

### 模式 E：Anthropic Claude 企业合作伙伴（★★☆☆☆）

- 2026 年 3 月，Anthropic 宣布投入 $1 亿建立 **Claude Partner Network**
- 面向帮助企业部署 Claude 的机构，提供培训、技术支持、联合营销
- **准入门槛高**：需要有实质性的企业客户部署案例
- 适合作为长期发展方向，短期不可行

---

## 四、0 成本启动完整方案（重点）

### 阶段一：建站（第 1-2 周，完全 0 成本）

**域名和托管**：
- 已有 wordok.top 域名，可建子站 `api.wordok.top` 或独立路径
- 使用 Cloudflare Pages 免费托管静态落地页

**内容规划**（SEO 导向）：
1. **中转站介绍主页**：介绍 wordok.top API 中转服务（占位，后期可实装）
2. **VPN 推荐页**：重点推广 NordVPN / ExpressVPN affiliate 链接
3. **教程文章（3-5 篇）**：
   - "2026 国内使用 OpenAI API 完整教程"
   - "Claude API 中转站对比评测"
   - "AI API 价格对比计算器"
   - "免翻墙使用 ChatGPT API 方法汇总"

**Affiliate 注册清单（均免费注册）**：
- [ ] NordVPN Affiliate（via nordvpn.com/affiliate）
- [ ] ExpressVPN Affiliate（需有网站）
- [ ] Writesonic Affiliate（via PartnerStack）
- [ ] Scalenut Affiliate（via PartnerStack）

### 阶段二：SEO 引流（第 3-8 周）

**站外引流**：
1. **V2EX** — 在推广节点发帖，标题吸引眼球（参考竞品：送 Token、免费试用）
2. **知乎** — 回答"国内如何使用 ChatGPT API"类问题，文末引导到网站
3. **GitHub** — 在热门 AI 项目 issues/discussions 中提及站点
4. **掘金 / CSDN** — 发布 API 使用教程，自然引流
5. **AI 工具导航站投稿**（如 ai-bot.cn, ai-tool.site 等，免费收录）

**Google Adsense 嵌入**：
- 教程文章页面嵌入 Adsense 广告
- 中转站对比页嵌入 Adsense
- 早期流量变现，补贴内容生产成本

### 阶段三：扩大变现（第 2-3 个月）

**条件满足后（月 UV > 1000）**：
- 考虑开通付费 Token 服务（需小额资金购买上游 API）
- 建立 Telegram 群，构建私域流量
- 接受企业咨询/定制（变现率高）

---

## 五、推荐盈利路径（给实现 Agent 的具体建议）

### 短期（0-1 个月）：纯 0 成本

```
目标：每月 $50-200 收入
路径：SEO 教程文章 → VPN Affiliate 转化 + Adsense 广告
关键指标：月 UV 500+，VPN 转化率 2-5%
预期：每 100 UV 可产生 1-3 个 VPN 点击，1-2 个成交 ≈ $13-$72
```

### 中期（1-3 个月）：SEO 积累期

```
目标：每月 $200-800 收入
路径：内容矩阵扩大 + AI 工具 affiliate + 导流私域群
关键指标：月 UV 2000+，多 affiliate 计划并行
新增：Writesonic 30% 循环佣金可带来持续收入
```

### 长期（3-6 个月）：实体服务

```
目标：每月 $1000+ 收入
路径：开通 Token 销售服务（需 $100-200 启动资金）
优势：已积累 SEO 流量 + 用户信任，获客成本极低
```

---

## 六、风险与注意事项

| 风险类型 | 说明 | 应对建议 |
|---------|------|---------|
| **合规风险** | 国内《生成式人工智能服务管理办法》合规要求 | 落地页明确标注服务性质，避免夸大宣传 |
| **账号封禁** | Anthropic/OpenAI 加强反代理限制 | 初期不运营中转服务，仅做 affiliate |
| **价格战** | 中转站市场竞争激烈，利润率持续压缩 | 差异化定位，或聚焦联盟营销不参与价格战 |
| **广告政策** | Google Adsense 对部分 AI 代理内容有限制 | 内容以教程为主，避免明显的"翻墙"表述 |
| **VPN Affiliate 门槛** | ExpressVPN 要求网站有 VPN 相关内容 | 建立 VPN 评测页面满足要求 |

---

## 七、参考链接

### 竞品参考
- OneToken 中转站：https://onetoken.one/
- API易：https://www.apiyi.com/
- 147api：https://www.cnblogs.com/147api/
- poloapi：https://www.poloapi.top/
- Sub2API（开源）：https://github.com/Wei-Shaw/sub2api

### Affiliate 计划
- NordVPN Affiliate：https://nordvpn.com/affiliate/
- ExpressVPN Affiliate：https://www.buy-express-vpn.asia/affiliates/
- Writesonic Affiliate：https://writesonic.com/affiliate
- Scalenut Affiliate：https://www.scalenut.com/affiliate-program
- Anthropic Claude Pro 推荐：https://claude.ai（登录后查看推荐计划）
- Anthropic 企业合作伙伴：https://www.anthropic.com/news/claude-partner-network

### 开源工具
- one-api：https://github.com/songquanpeng/one-api
- new-api：（one-api 派生版，功能更完整）
- sub2api：https://github.com/Wei-Shaw/sub2api

### 市场资讯
- V2EX AI 中转站讨论：https://www.v2ex.com/t/1196956
- 新浪 Token 中间商报道：https://www.sina.cn/news/detail/5283224144053164.html
- 百度千帆平台对比分析：https://qianfan.cloud.baidu.com/qianfandev/topic/687184

---

## 八、执行总结

### 主要盈利方式（按优先级）

1. **VPN Affiliate（首选，0 成本）** — NordVPN 月付 100% 佣金，与 AI API 目标用户高度重合
2. **SEO + Google Adsense（0 成本）** — 教程内容引流，广告变现
3. **AI 工具 Affiliate（0 成本）** — Writesonic/Scalenut 30% 循环佣金
4. **Token 销售（需小额启动资金）** — 有流量后开通，利润率 20-50%

### 0 成本方案摘要

> **完全 0 成本阶段**：建立 SEO 内容站（教程 + 对比文章），注册 NordVPN 和 Writesonic 等 affiliate 计划，嵌入 Adsense 广告。利用 wordok.top 现有 SEO 基础和站群架构快速起步。
>
> **核心逻辑**：中转站用户（国内开发者）= VPN 购买需求用户，推荐 VPN 的转化率远高于普通科技网站（预计 3-8%）。月均 1000 UV 即可带来 $100-400 的 VPN 佣金收入。

### 给实现 Agent 的建议

1. **立即可做**：创建 `wordok.top/api-guide` 或 `token-relay` 子路径，发布 3-5 篇 AI API 教程，内嵌 NordVPN affiliate 链接
2. **注册优先级**：NordVPN > ExpressVPN > Writesonic
3. **内容关键词**：优先攻"OpenAI API 国内使用"、"Claude API 中转"等长尾词
4. **不建议立即**：搭建真实中转服务（需资金和维护成本），待 SEO 流量验证后再考虑
5. **衡量指标**：30 天内看 VPN affiliate 点击率，60 天看首单成交，90 天评估是否值得开通付费 Token 服务
