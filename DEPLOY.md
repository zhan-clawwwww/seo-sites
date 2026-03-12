# Cloudflare Pages 部署说明

## 部署步骤

1. 将代码推送到 Git 仓库（GitHub/GitLab/Bitbucket）
2. 登录 Cloudflare Dashboard → Pages → 创建项目
3. 连接 Git 仓库
4. 配置构建设置：
   - **构建命令**: `npm run build`
   - **输出目录**: `dist`
   - **Node.js 版本**: 18.x 或更高
5. 环境变量（Settings → Environment variables）：
   | 变量名 | 值 | 说明 |
   |--------|-----|------|
   | `ENABLED_SITES` | `site-a` | 启用的站点，逗号分隔 |
   | `PUBLIC_ROOT_BASE_URL` | `https://techreviewpro.com` | 根域名，用于根页 canonical、robots |
6. 点击"保存并部署"
7. 绑定自定义域名（Custom domains）

## 注意事项

- 项目为纯静态输出（SSG），无需服务器
- 所有站点配置在 `sites/*/config.json` 中
- 上线前请完成 `PRODUCTION_READY.md` 中的检查项

