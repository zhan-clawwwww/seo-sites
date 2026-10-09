import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "tools-og.png");

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e3a5f"/>
      <stop offset="50%" style="stop-color:#2563eb"/>
      <stop offset="100%" style="stop-color:#7c3aed"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="80" y="200" fill="#ffffff" font-family="system-ui, sans-serif" font-size="72" font-weight="800">图片处理百宝箱</text>
  <text x="80" y="290" fill="#e0e7ff" font-family="system-ui, sans-serif" font-size="36" font-weight="500">压缩 · 转换 · 裁切 · 水印</text>
  <text x="80" y="520" fill="#c7d2fe" font-family="system-ui, sans-serif" font-size="32" font-weight="600">wordok.top/tools</text>
  <circle cx="1050" cy="120" r="48" fill="#ffffff22"/>
  <text x="1020" y="135" fill="#ffffff" font-family="system-ui, sans-serif" font-size="48">🛠️</text>
</svg>
`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync(out, png);
console.log("Wrote", out, `(${png.length} bytes)`);
