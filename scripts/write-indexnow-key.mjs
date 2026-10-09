/**
 * Writes IndexNow verification file to public/ at build time.
 * Key must come from INDEXNOW_KEY env only — never commit the file to git.
 */
import { writeFileSync, unlinkSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const key = (process.env.INDEXNOW_KEY ?? "").trim();

if (!key) {
  console.log("write-indexnow-key: INDEXNOW_KEY unset — skipping verification file");
  process.exit(0);
}

if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) {
  console.error("write-indexnow-key: INDEXNOW_KEY has invalid format");
  process.exit(1);
}

// Remove stale hex verification files from older builds (local only)
try {
  for (const name of readdirSync(publicDir)) {
    if (/^[0-9a-f]{32}\.txt$/i.test(name) && name !== `${key}.txt`) {
      unlinkSync(join(publicDir, name));
    }
  }
} catch {
  /* ignore */
}

const out = join(publicDir, `${key}.txt`);
writeFileSync(out, `${key}\n`, "utf8");
console.log(`write-indexnow-key: wrote public/${key}.txt (from env)`);
