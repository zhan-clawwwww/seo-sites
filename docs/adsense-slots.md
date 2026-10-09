# AdSense ad slot IDs (wordok.top)

Ad slot values are **public** in HTML (`data-ad-slot`). Do not treat them as secrets.

## Where to configure

1. **GitHub Actions → Repository → Settings → Variables** (recommended for deploy builds)
   - `PUBLIC_ADSENSE_AD_SLOT` — optional in-article / display unit slot ID (empty = no in-article unit rendered)
   - `PUBLIC_ADSENSE_PUBLISHER_ID` — optional override of the default publisher ID

2. **Per-site `sites/<channel>/config.json`** — `adsense.adSlot` overrides the env var for that channel only.

3. **Local `.env`** (not committed): same `PUBLIC_*` names; use `node --env-file=.env` or export before `npm run build`.

Do **not** invent or commit real slot IDs in the repo. Leave defaults empty so CI builds without AdSense units until you paste IDs from the AdSense UI.

## In-article ads

Article templates only render `<ins class="adsbygoogle">` when `resolveAdsense()` returns a non-empty `adSlot` (from config or `PUBLIC_ADSENSE_AD_SLOT`).

## CMP / Funding Choices (optional)

Privacy & messaging (Funding Choices) is **off by default**. See `PUBLIC_ENABLE_ADSENSE_FUNDING_CHOICES` in `.env.example` and the commented hook in `BaseLayout.astro` / `AiNewsLayout.astro`. Enable only after configuring a real message type in the AdSense dashboard — never ship a placeholder CMP.
