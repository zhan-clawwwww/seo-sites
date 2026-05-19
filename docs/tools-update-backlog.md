# Tools 专栏更新 backlog

> 与 `docs/SEO-编写标准与更新要求.md` §2.3 配套：每次四专栏 SEO 日更时同步维护 `/tools/`。

## 每次日更必做

- [ ] `sites/site-a/posts/` 新增 **1～2 篇**中文教程，链到 `https://wordok.top/tools/` 对应 Tab
- [ ] 评估 **1 项**可上线小功能；能 Ship 则同批 push
- [ ] 在 `memory/YYYY-MM-DD.md` 记录教程标题与功能点

## 2026-05-19 已完成

| 类型 | 内容 |
|------|------|
| 功能 | 图片压缩：目标体积 (KB) +「按目标体积自动调质量」+ EXIF 去除勾选 |
| 教程 | `how-to-compress-image-to-target-kb.md`、`how-to-resize-id-photo-online.md` |
| SEO 批次 | ai/web3/tesla/apple 各 3 篇，`pubDate: 2026-05-19` |

## 待探索小功能（候选）

| 优先级 | 功能 | 说明 |
|--------|------|------|
| P1 | 批量压缩/下载 | 多选文件队列处理（注意内存上限） |
| P1 | 压缩预设芯片 | 一键 100KB / 200KB / 500KB |
| P2 | 证件照预设 | 裁切 Tab 增加 295×413、413×579 一键比例 |
| P2 | 图片旋转 90° | 裁切/调整前修正方向 |
| P3 | 在线简单去水印区选 | 将 `tools/remove-watermark.mjs` 能力做成浏览器 Tab（需 Canvas 区域选择） |
| P3 | HEIC 转 JPG | 依赖浏览器是否可读 HEIC |

## 教程选题池（site-a 中文）

- 护照/签证照片像素与背景要求
- WEBP 与 JPG 在工具箱里怎么选
- 自媒体封面图尺寸（公众号、小红书 safe area）
- 批量加水印工作流（平铺水印 Tab）
