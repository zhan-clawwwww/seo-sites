import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "portal-og.png");

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a"/>
      <stop offset="45%" style="stop-color:#1d4ed8"/>
      <stop offset="100%" style="stop-color:#7c3aed"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="80" y="180" fill="#ffffff" font-family="system-ui, sans-serif" font-size="64" font-weight="800">wordok.top</text>
  <text x="80" y="270" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="34" font-weight="500">Free tools · VPN · AI · Apple · Tesla · Web3</text>
  <text x="80" y="520" fill="#c7d2fe" font-family="system-ui, sans-serif" font-size="30" font-weight="600">Tech news portal &amp; image toolbox</text>
  <circle cx="1080" cy="120" r="52" fill="#ffffff18"/>
  <text x="1048" y="138" fill="#ffffff" font-family="system-ui, sans-serif" font-size="44">◎</text>
</svg>
`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync(out, png);
console.log("Wrote", out, `(${png.length} bytes)`);
