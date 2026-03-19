#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { readdirSync } from "fs";

const postsDir = join(process.cwd(), "sites", "apple", "posts");
const files = readdirSync(postsDir).filter((f) => f.endsWith(".md"));

for (const file of files) {
  const path = join(postsDir, file);
  let content = readFileSync(path, "utf-8");

  // Fix 1: backtick-n between description and keywords
  content = content.replace(/\.\"`nkeywords:/g, '."\nkeywords:');

  // Fix 2: ["Phone -> ["iPhone (restore lost 'i')
  content = content.replace(/\[\"Phone /g, '["iPhone ');

  // Fix 3: MacBook titles with 13" or 15" etc that break YAML
  content = content.replace(/title: "([^"]*?)(\d+)"([^"]*?)"/g, (_, before, num, after) => {
    return `title: "${before}${num} inch${after}"`;
  });

  writeFileSync(path, content);
}
console.log(`Fixed ${files.length} files`);
