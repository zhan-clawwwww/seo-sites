#!/usr/bin/env node
/**
 * 批量修复 vpn-usa 文章 frontmatter：
 * 1. 添加 author: "vpn-expert"（若缺失）
 * 2. 将 keywords 从字符串改为数组格式
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDir = path.join(__dirname, "..", "sites", "vpn-usa", "posts");

const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
let authorAdded = 0;
let keywordsFixed = 0;

for (const file of files) {
  const filePath = path.join(postsDir, file);
  let content = fs.readFileSync(filePath, "utf8");

  let modified = false;

  // 1. 添加 author（若缺失）
  if (!content.includes("author:")) {
    // 在 pubDate 后面添加，若无 pubDate 则在 description 后面添加
    if (content.includes("pubDate:")) {
      content = content.replace(
        /(pubDate:\s*"[^"]*")\n/,
        '$1\nauthor: "vpn-expert"\n'
      );
    } else if (content.includes("description:")) {
      content = content.replace(
        /(description:\s*"[^"]*")\n/,
        '$1\nauthor: "vpn-expert"\n'
      );
    } else {
      // 在 title 后面添加
      content = content.replace(
        /(title:\s*"[^"]*")\n/,
        '$1\nauthor: "vpn-expert"\n'
      );
    }
    authorAdded++;
    modified = true;
  }

  // 2. keywords 字符串转数组（仅当是字符串格式时）
  const keywordsStringMatch = content.match(/^keywords:\s*"([^"]*)"\s*$/m);
  if (keywordsStringMatch) {
    const kwStr = keywordsStringMatch[1];
    const arr = kwStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const newKeywords = 'keywords: [' + arr.map((k) => `"${k}"`).join(", ") + "]";
    content = content.replace(/^keywords:\s*"[^"]*"\s*$/m, newKeywords);
    keywordsFixed++;
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
  }
}

console.log(`处理完成: ${files.length} 个文件`);
console.log(`- 添加 author: ${authorAdded} 篇`);
console.log(`- 转换 keywords: ${keywordsFixed} 篇`);
