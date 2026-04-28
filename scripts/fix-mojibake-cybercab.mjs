import fs from "node:fs";

const p = "sites/tesla/posts/tesla-2026-04-28-cybercab-production-ramp-fsd-parity-strategy.md";
let t = fs.readFileSync(p, "utf8");

// Common UTF-8 read-as-Windows-1252 mojibake repairs
const rep = [
  ["â€œ", '"'],
  ["â€", '"'],
  ["â", "—"],
  ["â", "–"],
  ["â", "'"],
  ["Ã—", "×"],
];

for (const [a, b] of rep) t = t.split(a).join(b);

fs.writeFileSync(p, t);
console.log("ok");
