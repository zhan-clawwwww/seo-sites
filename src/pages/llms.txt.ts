import type { APIRoute } from "astro";
import { getPublicRootBaseUrl } from "../lib/root-base-url";
import { getAllSites, toCanonical } from "../lib/site-data";

export const prerender = true;

/**
 * Root llms.txt — machine-oriented site hints (community convention).
 */
export const GET: APIRoute = () => {
  const root = getPublicRootBaseUrl();
  const lines: string[] = [
    "# llms.txt",
    "> wordok.top — English editorial sites (tech, AI, Web3, EV, Apple, VPN, etc.).",
    "",
    "## Primary entry points",
    `- Home: ${toCanonical(root, "/")}`,
    `- HTML site map: ${toCanonical(root, "/sitemap/")}`,
    `- Sitemap index: ${toCanonical(root, "/sitemap_index.xml")}`,
    `- Full urlset: ${toCanonical(root, "/sitemap.xml")}`,
    `- Robots: ${toCanonical(root, "/robots.txt")}`,
    "",
    "## Structured / corpus channel",
    "High-structure reference posts plus plain-text mirrors:",
    `- Channel home: ${toCanonical(root, "/ai-corpus/")}`,
    `- Channel llms: ${toCanonical(root, "/ai-corpus/llms.txt")}`,
    "",
    "## URL patterns",
    "- Article HTML: `/{channel}/posts/{slug}/`",
    "- Plain text (ai-corpus): `/{channel}/posts/{slug}/plain.txt`",
    "- RSS: `/{channel}/rss.xml`",
    "",
    "## Enabled channels",
  ];

  for (const s of getAllSites()) {
    lines.push(`- ${s.slug}: ${toCanonical(root, `/${s.slug}/`)}`);
  }

  lines.push("", "## Note", "Editorial analysis only where stated; verify facts for regulated domains.", "");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
