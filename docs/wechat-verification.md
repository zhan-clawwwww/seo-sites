# 微信部署验证文件管理

## 当前验证文件信息 (2026-03-25更新)

### 文件详情
- **文件名**: `d4e020feafa7d5274ed5dbc8eb191e7b.txt`
- **文件内容**: `d28d618cfc9f4e4623c412d59055608891e6b42c`
- **文件大小**: 40字节
- **更新时间**: 2026-03-25
- **文件路径**: `public/d4e020feafa7d5274ed5dbc8eb191e7b.txt`

### 访问地址
- **验证URL**: `https://wordok.top/d4e020feafa7d5274ed5dbc8eb191e7b.txt`
- **预期内容**: `d28d618cfc9f4e4623c412d59055608891e6b42c`

## 历史验证文件

### 旧文件 (已弃用)
- **文件名**: `by687dm0txw1ovfinrpkhg2z5q3jeasu.txt`
- **内容**: `by687dm0txw1ovfinrpkhg2z5q3jeasu`
- **状态**: 已删除，微信平台已重新生成新验证文件

## 验证目的
此文件用于微信平台（微信公众号/小程序）的域名所有权验证。微信会尝试访问此文件来验证你对 `wordok.top` 域名的控制权。

## 部署状态

### ✅ 当前状态：已验证
1. **文件存在**: 文件已放置在 `public/` 目录中
2. **构建确认**: 每次构建时自动复制到 `dist/` 目录
3. **访问正常**: 可通过网站根目录直接访问

### 验证步骤
1. 微信平台会请求: `https://wordok.top/by687dm0txw1ovfinrpkhg2z5q3jeasu.txt`
2. 服务器返回文件内容: `by687dm0txw1ovfinrpkhg2z5jeasu`
3. 微信验证内容匹配，确认域名所有权

## 技术说明

### Astro项目配置
在Astro静态站点生成器中：
- `public/` 目录中的文件被视为静态资源
- 构建时自动复制到 `dist/` 输出目录
- 可通过根路径直接访问

### 文件管理
```bash
# 源文件位置
public/d4e020feafa7d5274ed5dbc8eb191e7b.txt

# 构建后位置  
dist/d4e020feafa7d5274ed5dbc8eb191e7b.txt

# 旧文件 (已删除)
# public/by687dm0txw1ovfinrpkhg2z5q3jeasu.txt
```

## 维护指南

### 注意事项
1. **不要删除**: 此文件是微信验证必需的，删除会导致验证失败
2. **不要修改**: 文件内容和文件名必须保持原样
3. **不要移动**: 必须保持在 `public/` 目录根级别

### 验证检查
定期检查文件是否可访问：
```bash
# 检查本地构建
curl -I http://localhost:4321/by687dm0txw1ovfinrpkhg2z5q3jeasu.txt

# 检查生产环境
curl https://wordok.top/by687dm0txw1ovfinrpkhg2z5q3jeasu.txt
```

### 故障排除
如果微信验证失败：
1. 检查文件是否存在于 `dist/` 目录
2. 确认网站已成功部署
3. 验证URL访问返回正确内容
4. 检查是否有CDN缓存问题

## 相关配置

### Git管理
此文件已纳入版本控制，确保团队协作时不会丢失。

### 构建流程
每次 `npm run build` 时，文件会自动从 `public/` 复制到 `dist/`。

## 历史记录
- **2026-03-19**: 初始验证文件 `by687dm0txw1ovfinrpkhg2z5q3jeasu.txt` 添加
- **2026-03-25**: 创建此文档，记录验证文件管理信息
- **2026-03-25**: 微信平台重新生成验证文件，更新为 `d4e020feafa7d5274ed5dbc8eb191e7b.txt`，删除旧文件

---
**重要**: 此文件是微信平台验证的关键，请勿随意修改或删除。