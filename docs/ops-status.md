# wordok.top — SEO ops status (public)

Last updated: **2026-10-09** (UTC). No secrets or API keys in this file.

## Live site

- **Canonical origin:** [https://wordok.top/](https://wordok.top/)
- **Deploy:** GitHub Actions → GitHub Pages on `main`
- **Discovery:** Dynamic `robots.txt`, `sitemap_index.xml`, root `sitemap.xml`, per-channel `/…/sitemap.xml`

## Recent technical SEO fixes (shipped on `main`)

| Area | What we did |
|------|-------------|
| **Internal links** | Normalized `/{site}/posts/{slug}/` paths for vpn-usa, web3, apple; fixed legacy `/vpn-usa-…` typos (`scripts/fix-internal-post-links.mjs`) |
| **Thin / template content** | `noindex, follow` + **excluded from sitemaps** for template slugs (`-high-quality-*`, `*-comprehensive-analysis`, placeholder markers) and thin Apple device spec pages (`src/lib/post-indexing.ts`) |
| **TOC** | Article TOC uses Astro `mod.getHeadings()` when available so anchor slugs match rendered headings |
| **Authors** | Post pages resolve `frontmatter.author` → `src/lib/authors.ts` with per-channel defaults (E-E-A-T) |
| **List pages** | Channel `/posts/` meta & OG descriptions use channel-specific copy (`postsListMetaDescription`) |
| **404 / zh-CN** | Dedicated 404 page; Chinese content `lang` handling where configured |
| **Ads** | Google AdSense via env / site config (no Ezoic conflict); see `docs/adsense-slots.md` |
| **OG images** | Homepage `portal-og.png`, tools hub `tools-og.png`, fallback `og-default.png` |
| **IndexNow** | Optional post-deploy workflow; requires `INDEXNOW_KEY` in repo secrets only (not committed) |

## Owner checklist (manual)

- [ ] Google Search Console: property `wordok.top`, submit sitemaps if needed
- [ ] GA4: verify data stream (see `docs/google-analytics-4-data-stream.md`)
- [ ] AdSense: replace placeholder slot IDs in env / `sites/vpn-usa/config.json` when approved
- [ ] Expand thin Apple spec pages before removing `noindex` (target 600+ words of unique copy)

## Ryze / GSC automation

Deferred in agent runs when connectors are skipped; no change to crawl policy above.
