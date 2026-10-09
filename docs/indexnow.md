# IndexNow (wordok.top)

The API key must **never** be committed. Use GitHub Actions **Secrets** → `INDEXNOW_KEY`.

## Verification file

During `npm run build`, `scripts/write-indexnow-key.mjs` writes `public/<INDEXNOW_KEY>.txt` when the env var is set. The deploy workflow passes `secrets.INDEXNOW_KEY` into the build step so the file is published on GitHub Pages without storing the key in git.

## Submitting URLs

After deploy:

```bash
INDEXNOW_KEY=your_key npm run submit:indexnow:all-sites
```

Or rely on `.github/workflows/indexnow-after-deploy.yml`, which runs when the Pages deploy workflow succeeds (skips if the secret is unset).
