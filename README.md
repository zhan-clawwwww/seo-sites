# Best USA VPN — SEO 联盟站

基于 **Astro** 构建的 VPN 评测 SEO 站，部署在 GitHub Pages，域名 `wordok.top`。

## 📖 操作手册

**所有操作说明、待办清单、部署流程、变现配置，全部在：**

👉 **[TODO.md](./TODO.md)**

## 快速开始

```powershell
npm install
$env:ENABLED_SITES="vpn-usa"
npm run dev
# 浏览器打开 http://localhost:4321/vpn-usa/
```

## 项目结构

```
sites/vpn-usa/        ← 网站内容（文章 + 配置）
src/                  ← 框架代码（一般不改）
public/CNAME          ← 域名配置（wordok.top）
.github/workflows/    ← 自动部署（push 后自动触发）
```

## 技术栈

- **Astro 5** — 静态站点生成
- **GitHub Pages** — 免费托管
- **GitHub Actions** — 自动 CI/CD
