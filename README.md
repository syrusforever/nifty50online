# NIFTY 50 LIVE TRADER

Static demo of a NIFTY 50 trading UI (no backend). This repo contains a single-file, client-side trading demo that fetches quote data via a public proxy and simulates orders locally.

Important: the app is a demo only — it does not place real trades and uses public/free endpoints that may be rate-limited or blocked.

## Where the app lives
- index.html — the single-file trading app (now served from the repository root on the setup branch)
- trading — original single-file app (kept for reference)
- index.html.placeholder — backed-up original placeholder HTML

## How to run locally
The repository includes a tiny dev helper. From the repository root:

1. Install (optional) and run the local static server:

```bash
npm install
npm start
```

This runs a simple static server on http://localhost:8000 and serves index.html.

Alternatively you can use Python's http.server:

```bash
# from repo root
echo "Using index.html as the app" && python3 -m http.server 8000
```

## Limitations and recommendations
- Data source: the app requests Yahoo Finance using a public AllOrigins proxy (`https://api.allorigins.win/raw?url=...`). Public proxies can be unreliable, rate-limited, or blocked. The app falls back to generated mock prices when the fetch fails.
- CORS and keys: Yahoo endpoints are not intended for direct browser usage. For production, run a small server-side proxy or use a supported market-data provider that offers CORS-enabled endpoints or an official API key.
- Security: do not embed private API keys in client-side code. If you add a provider that requires a key, keep the key on a server you control and proxy requests.
- Reliability: consider using a paid market-data provider (IEX, Polygon, Alpha Vantage, Twelve Data, etc.) or exchange-licensed feeds if you need production-grade data and SLAs.

## Next steps I applied
- Copied the single-file app into `index.html` on branch `setup/trading-app` so the app is served from the repo root.
- Added `package.json` with a `start` script to make local preview easier.
- Backed up the old placeholder to `index.html.placeholder`.

## What I will do next (and what I can't do from here)
- I created a new branch `setup/trading-app` containing the changes above.
- I can create a `gh-pages` branch with the same files so GitHub Pages can serve the app automatically; I will create it next.
- I cannot create the GitHub Pull Request from this environment. After I push the `gh-pages` branch I will tell you exactly how to open the PR from `setup/trading-app` into `main` (it’s a one-click operation in the GitHub UI) and I can provide a suggested PR title and body.

---

If you'd like, I can also:
- Split the single-file app into `index.html` + `assets/` and smaller JS files for maintainability.
- Add a small Node.js Express proxy example (server.js) to demonstrate secure server-side data fetching.

