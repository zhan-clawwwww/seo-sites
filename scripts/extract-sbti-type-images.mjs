/**
 * One-shot: 将 public/sbti/main.js 中 TYPE_IMAGES 的 base64 拆到 public/sbti/types/，
 * 并把 TYPE_IMAGES 改为 URL 引用，减小 JS 体积、利于 GitHub Pages 缓存。
 * 用法: node scripts/extract-sbti-type-images.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const mainPath = path.join(root, "public", "sbti", "main.js");
const outDir = path.join(root, "public", "sbti", "types");

const content = fs.readFileSync(mainPath, "utf8");

const pairRe = /"([^"]+)":\s*"(data:image\/(?:png|jpeg|jpg);base64,[^"]+)"/g;
const entries = [];
let m;
while ((m = pairRe.exec(content)) !== null) {
  entries.push({ key: m[1], dataUrl: m[2] });
}

if (entries.length === 0) {
  console.error("未找到任何 data:image 嵌入，已跳过。");
  process.exit(1);
}

console.log("找到嵌入图片:", entries.length);

fs.mkdirSync(outDir, { recursive: true });

const mapping = [];
for (const { key, dataUrl } of entries) {
  const mimeMatch = dataUrl.match(/^data:image\/(png|jpeg|jpg);base64,(.+)$/s);
  if (!mimeMatch) {
    throw new Error(`无法解析 data URL: ${key}`);
  }
  const ext = mimeMatch[1] === "png" ? "png" : "jpg";
  const buf = Buffer.from(mimeMatch[2], "base64");
  const safe = key.replace(/[^a-zA-Z0-9_-]/g, "_");
  const filename = `${safe}.${ext}`;
  const filePath = path.join(outDir, filename);
  fs.writeFileSync(filePath, buf);
  mapping.push({ key, relPath: `/sbti/types/${filename}` });
  console.log("  ", key, "->", filename, `(${Math.round(buf.length / 1024)} KB)`);
}

const newBlock = `const TYPE_IMAGES = {\n${mapping.map(({ key, relPath }) => `    ${JSON.stringify(key)}: ${JSON.stringify(relPath)}`).join(",\n")}\n};`;

const typeImagesRe = /const TYPE_IMAGES = \{[\s\S]*?\n\};/;
if (!typeImagesRe.test(content)) {
  throw new Error("未匹配到 const TYPE_IMAGES = { ... }; 块");
}

const newContent = content.replace(typeImagesRe, newBlock);
fs.writeFileSync(mainPath, newContent);
console.log("已更新 main.js，约", Math.round(newContent.length / 1024), "KB（原约", Math.round(content.length / 1024), "KB）");
