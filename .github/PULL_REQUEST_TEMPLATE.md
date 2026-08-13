---
name: Serve trading app from root, add dev start + notes
about: PR to copy trading app to repo root, add package.json start script and README notes
---

This PR copies the single-file trading demo into index.html so the app is served from the repository root, adds a small dev helper (package.json) to make local preview simple, and updates the README with run instructions and limitations.

What changed
- index.html: single-file trading app now served from repo root (copied from trading)
- package.json: dev helper with start script for local preview
- README.md: run instructions and limitations (proxy, CORS, fallback)
- index.html.placeholder: backup of previous placeholder

How to test
1. Clone the repo and checkout this branch:
   git fetch origin
   git checkout setup/trading-app
2. Run locally:
   npm install
   npm start
3. Open http://localhost:8000

Notes
- The app uses a public proxy (api.allorigins.win) for Yahoo Finance; this is demo-only and may fail or be rate-limited.
- For production, add a server-side proxy or use a paid market-data provider with proper CORS and keys.
