# Google Search Console 配置清单

## 📋 站点信息

**站点标识：** `site-a`  
**站点名称：** Site A  
**最终线上域名：** `https://site-a.example.com`

> ⚠️ **重要提示：** 请确认 `sites/site-a/config.json` 中的 `baseUrl` 已更新为实际部署域名。当前配置为示例域名，上线前必须修改。

---

## 1️⃣ 域名验证

### 方式一：HTML 文件验证（推荐）
1. 在 GSC 中选择「HTML 文件」验证方式
2. 下载验证文件（通常为 `google[随机字符].html`）
3. 将文件放置到站点根目录：`public/google[随机字符].html`
4. 确保可通过 `https://site-a.example.com/google[随机字符].html` 访问
5. 在 GSC 中点击「验证」

### 方式二：HTML 标签验证
1. 在 GSC 中选择「HTML 标签」验证方式
2. 复制提供的 `<meta>` 标签
3. 将标签添加到 `src/layouts/BaseLayout.astro` 的 `<head>` 部分（临时添加）
4. 构建并部署后，在 GSC 中点击「验证」
5. 验证成功后，可移除该标签

### 方式三：DNS 验证
1. 在 GSC 中选择「DNS」验证方式
2. 按照提示在域名 DNS 设置中添加 TXT 记录
3. 等待 DNS 传播后，在 GSC 中点击「验证」

---

## 2️⃣ Sitemap 提交

### Sitemap 地址
```
https://site-a.example.com/site-a/sitemap.xml
```

### 提交步骤
1. 登录 Google Search Console
2. 选择已验证的站点属性
3. 左侧菜单 → **「站点地图」**
4. 在「添加新的站点地图」输入框中输入：
   ```
   site-a/sitemap.xml
   ```
   > 注意：只需输入相对路径，GSC 会自动拼接域名
5. 点击「提交」
6. 等待处理（通常几分钟到几小时）

### 预期收录页面
根据当前配置，sitemap 包含以下页面：

#### 核心页面（6个）
- `https://site-a.example.com/site-a/` - 首页
- `https://site-a.example.com/site-a/posts/` - 文章列表
- `https://site-a.example.com/site-a/about/` - 关于我们
- `https://site-a.example.com/site-a/privacy/` - 隐私政策
- `https://site-a.example.com/site-a/terms/` - 使用条款
- `https://site-a.example.com/site-a/contact/` - 联系我们

#### 文章页面（2个）
- `https://site-a.example.com/site-a/posts/hello-astro/` - Hello Astro
- `https://site-a.example.com/site-a/posts/seo-checklist/` - SEO Checklist（静态站）

**总计：8 个页面**

---

## 3️⃣ Robots.txt 配置说明

### Robots.txt 地址
```
https://site-a.example.com/site-a/robots.txt
```

### 当前内容
```
User-agent: *
Allow: /

Sitemap: https://site-a.example.com/site-a/sitemap.xml
```

### 配置说明
- ✅ **允许所有爬虫抓取**：`User-agent: *` + `Allow: /`
- ✅ **已包含 sitemap 声明**：指向 sitemap.xml 地址
- ✅ **无阻止索引规则**：未使用 `Disallow` 或 `noindex`

### 验证方法
1. 访问 `https://site-a.example.com/site-a/robots.txt`
2. 确认内容与上述一致
3. 在 GSC 中：**「设置」→「robots.txt 测试工具」** 验证规则

---

## 4️⃣ 其他重要配置

### 首选域名设置
1. GSC → **「设置」→「首选域名」**
2. 选择 `https://site-a.example.com`（带 www 或不带 www）
3. 确保与 `config.json` 中的 `baseUrl` 一致

### 网址参数（如需要）
如果站点使用 URL 参数（如 `?ref=xxx`），可在 GSC 中配置参数处理规则。

### 移动设备适合性
- 当前站点使用响应式设计（viewport meta 标签已配置）
- 建议在 GSC 中运行「移动设备适合性测试」验证

### 页面体验（Core Web Vitals）
部署后，GSC 会自动收集页面体验数据：
- LCP（最大内容绘制）
- FID（首次输入延迟）
- CLS（累积布局偏移）

---

## 5️⃣ 提交后检查清单

### 立即检查（提交后 24 小时内）
- [ ] 域名验证状态：已验证
- [ ] Sitemap 状态：已处理（无错误）
- [ ] Robots.txt 可访问且内容正确
- [ ] 首页可被 Googlebot 抓取（使用「网址检查」工具）

### 一周内检查
- [ ] 索引覆盖率报告：查看已索引页面数量
- [ ] 搜索效果：查看是否有搜索展示（可能需要更长时间）
- [ ] 移动设备适合性：无错误
- [ ] 页面体验：查看 Core Web Vitals 数据

### 持续监控
- [ ] 每周检查索引状态
- [ ] 监控搜索效果数据
- [ ] 关注 GSC 中的警告和错误
- [ ] 定期更新 sitemap（新增文章后）

---

## 6️⃣ 常见问题排查

### Sitemap 显示错误
- **问题：** "无法获取 sitemap"
- **解决：** 确认 sitemap.xml 可通过浏览器直接访问，检查服务器配置

### 页面未被索引
- **问题：** 提交 sitemap 后页面仍未索引
- **解决：** 
  1. 使用「网址检查」工具手动请求索引
  2. 确认页面无 `noindex` 标签
  3. 检查 robots.txt 是否允许抓取

### 验证失败
- **问题：** 域名验证失败
- **解决：**
  1. 确认验证文件/标签已正确部署
  2. 检查 DNS 设置（如使用 DNS 验证）
  3. 确认域名可正常访问

---

## 7️⃣ 快速操作步骤总结

1. **更新域名配置**
   - 编辑 `sites/site-a/config.json`
   - 将 `baseUrl` 改为实际域名

2. **构建并部署站点**
   ```bash
   npm run build
   ```

3. **验证域名**
   - 在 GSC 中选择验证方式并完成验证

4. **提交 Sitemap**
   - 地址：`site-a/sitemap.xml`
   - 等待处理完成

5. **检查 Robots.txt**
   - 访问并确认内容正确

6. **请求索引（可选）**
   - 使用「网址检查」工具测试首页
   - 点击「请求编入索引」

---

## 📝 备注

- 当前站点为测试站点（site-a），仅包含 2 篇文章
- 所有合规页面（About、Privacy、Terms、Contact）已创建并包含在 sitemap 中
- 所有页面均已配置正确的 canonical URL
- 所有页面均无 noindex/nofollow 限制

---

**生成时间：** 2025-01-27  
**站点配置来源：** `sites/site-a/config.json`

