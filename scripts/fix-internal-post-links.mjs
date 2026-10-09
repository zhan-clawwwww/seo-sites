import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const SITE_DIRS = ["vpn-usa", "web3", "apple"];
const RESERVED = new Set([
  "posts",
  "disclosure",
  "contact",
  "privacy",
  "terms",
  "about",
  "ai-frontiers",
  "privacy-security",
]);

const linkRe = /\]\(\/(vpn-usa|web3|apple)\/([^)]+)\)/g;
/** Legacy typo: /vpn-usa-for-foo → /vpn-usa/posts/usa-vpn-for-foo/ */
const vpnUsaLegacySlugRe = /\]\(\/(vpn-usa-[a-z0-9-]+)\)/g;

function fixContent(text) {
  let out = text.replace(vpnUsaLegacySlugRe, (match, legacySlug) => {
    const tail = legacySlug.replace(/^vpn-usa-/, "");
    if (!tail) return match;
    return `](/vpn-usa/posts/usa-vpn-${tail}/)`;
  });
  out = out.replace(linkRe, (match, site, rest) => {
    const segment = rest.replace(/\/$/, "").split("/")[0];
    if (RESERVED.has(segment)) return match;
    if (rest.startsWith("posts/")) return match;
    const normalized = rest.endsWith("/") ? rest : `${rest}/`;
    return `](/${site}/posts/${normalized})`;
  });
  return out;
}

let filesChanged = 0;
let linksFixed = 0;

for (const site of SITE_DIRS) {
  const dir = path.join(ROOT, "sites", site, "posts");
  if (!fs.existsSync(dir)) continue;
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith(".md")) continue;
    const fp = path.join(dir, name);
    const before = fs.readFileSync(fp, "utf8");
    const after = fixContent(before);
    if (after !== before) {
      const count = [...before.matchAll(linkRe)].filter((m) => {
        const rest = m[2];
        const segment = rest.replace(/\/$/, "").split("/")[0];
        return !RESERVED.has(segment) && !rest.startsWith("posts/");
      }).length;
      fs.writeFileSync(fp, after);
      filesChanged++;
      linksFixed += count;
      console.log(`fixed ${fp} (${count} links)`);
    }
  }
}

console.log(`Done: ${filesChanged} files, ~${linksFixed} links`);
