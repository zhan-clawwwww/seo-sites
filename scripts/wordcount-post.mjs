import fs from "node:fs";

const p = process.argv[2];
if (!p) {
  console.error("Usage: node wordcount-post.mjs <path-to-post.md>");
  process.exit(1);
}
const t = fs.readFileSync(p, "utf8");
const m = t.match(/^---[\s\S]*?---\s*([\s\S]*)$/);
const w = m ? m[1].trim().split(/\s+/).filter(Boolean).length : 0;
console.log(w);
