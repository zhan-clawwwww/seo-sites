# 📰 增强版每日网站运营任务报告

## 任务信息
- **日期**: 2026-03-25
- **专栏数量**: 8 (动态检测)
- **预期文章**: 24 篇 (每个专栏3篇)
- **质量要求**: 每篇至少1000字
- **Git状态**: 有未提交更改
- **动态适应**: ✅ 自动支持新增专栏

## 各专栏详情


### AI News (ai) 
- **文章数量**: 3篇/天
- **作者**: ai-researcher
- **最低字数**: 1200
- **必须章节**: 技术突破、行业影响、未来趋势、引用来源
- **引用风格**: 学术引用
- **媒体内容**: 推荐添加
- **配置类型**: 预定义

**搜索查询**:
1. AI technology breakthroughs 2026 latest news
2. machine learning research advancements today
3. OpenAI Google Anthropic AI updates


### Apple Devices (apple) 
- **文章数量**: 3篇/天
- **作者**: apple-analyst
- **最低字数**: 1100
- **必须章节**: 产品特性、性能评测、用户反馈、引用来源
- **引用风格**: 产品评测
- **媒体内容**: 推荐添加
- **配置类型**: 预定义

**搜索查询**:
1. Apple iPhone latest features and reviews 2026
2. MacBook technology updates today
3. Apple silicon and software advancements


### SEO Technology (site-a) 
- **文章数量**: 3篇/天
- **作者**: seo-specialist
- **最低字数**: 1000
- **必须章节**: 策略分析、实施方法、效果评估、引用来源
- **引用风格**: 专业指南
- **媒体内容**: 推荐添加
- **配置类型**: 预定义

**搜索查询**:
1. SEO and digital marketing trends 2026
2. search engine optimization techniques
3. website analytics and performance


### Streaming Services (streaming) 
- **文章数量**: 3篇/天
- **作者**: streaming-critic
- **最低字数**: 1000
- **必须章节**: 内容更新、技术特性、用户体验、引用来源
- **引用风格**: 娱乐报道
- **媒体内容**: 推荐添加
- **配置类型**: 预定义

**搜索查询**:
1. Netflix Disney Plus streaming content updates 2026
2. streaming technology and platform features
3. content licensing and original productions


### VPN Services (vpn-usa) 
- **文章数量**: 3篇/天
- **作者**: security-analyst
- **最低字数**: 1050
- **必须章节**: 安全特性、性能测试、使用建议、引用来源
- **引用风格**: 安全指南
- **媒体内容**: 推荐添加
- **配置类型**: 预定义

**搜索查询**:
1. VPN security and privacy technology 2026
2. online privacy protection latest solutions
3. internet security tools and services


### Web3 Technology (web3) 
- **文章数量**: 3篇/天
- **作者**: blockchain-expert
- **最低字数**: 1150
- **必须章节**: 技术进展、应用场景、风险评估、引用来源
- **引用风格**: 技术分析
- **媒体内容**: 推荐添加
- **配置类型**: 预定义

**搜索查询**:
1. blockchain technology developments 2026
2. cryptocurrency and DeFi updates
3. decentralized applications and platforms


### Tesla News (tesla) 
- **文章数量**: 3篇/天
- **作者**: ev-expert
- **最低字数**: 1300
- **必须章节**: 技术更新、市场动态、行业分析、引用来源
- **引用风格**: 科技报道
- **媒体内容**: 推荐添加
- **配置类型**: 预定义

**搜索查询**:
1. Tesla electric vehicle technology updates 2026
2. Elon Musk Tesla company developments
3. EV battery and charging advancements


### OpenClaw (openclaw) 🆕
- **文章数量**: 3篇/天
- **作者**: openclaw-expert
- **最低字数**: 1000
- **必须章节**: 最新动态、技术分析、行业影响、引用来源
- **引用风格**: 技术报道
- **媒体内容**: 推荐添加
- **配置类型**: 动态生成

**搜索查询**:
1. OpenClaw latest developments and news 2026
2. OpenClaw technology updates today
3. OpenClaw industry trends and analysis


## 质量要求
- **原创性**: 基于多源信息的分析和总结
- **引用要求**: 必须标明所有引用来源URL
- **文章结构**: 必须包含指定章节
- **媒体内容**: 适当添加图片和视频引用
- **动态适应**: 自动为新专栏生成配置

## 操作步骤

1. 📈 检测到新增专栏！当前共有 8 个专栏，将自动为所有专栏创建文章
2. 1. 检测到 8 个启用的专栏，将为每个专栏创作3篇文章
3. 2. 使用 web_search 工具搜索每个查询的最新信息
4. 3. 基于搜索结果进行深度分析和合并总结
5. 4. 创作每篇至少1000字的原创文章
6. 5. 文章必须包含：内容分析、技术细节、行业影响等章节
7. 6. 在文章结尾处准确标明所有引用来源的URL
8. 7. 适当添加相关的图片和视频引用（如适用）
9. 8. 保存文章到对应站点的 posts 目录
10. 9. 运行编译检查: npm run build
11. 10. 提交更改: git add -A && git commit -m 'Daily update'
12. 11. 等待飞书确认后推送: git push origin main

---

**重要提示**:
1. 所有文章必须是基于搜索结果的原创总结，不能直接复制
2. 脚本会自动检测.env文件中的ENABLED_SITES配置
3. 新增专栏无需修改脚本，自动为其生成文章
4. 编译通过后才能提交，推送前需要飞书确认