NIFTY50 Online — demo trading UI

This repository contains a single-file, client-side trading demo (index.html) and a small server-side proxy example (server.js) to safely fetch market quotes.

Why the proxy?
- Browser-based calls to Yahoo Finance were previously done via a public proxy; that is unreliable and unsafe for production.
- The server-side proxy centralizes upstream requests, hides any API keys, and implements caching and rate-limiting.

Quick start (development)

1) Install dependencies (for the proxy):

   npm install express express-rate-limit cors node-fetch dotenv

2) Start the static preview (serves index.html on port 8000):

   npm start

3) In a second terminal, start the proxy (default port 3000):

   npm run serve:proxy

4) Open the app in your browser:

   http://localhost:8000

Notes for development
- The client calls the relative path `/api/quote` — in production you should run a reverse-proxy so both the UI and API share the same origin, or update the client to call the API origin explicitly.
- The proxy currently uses a small in-memory cache. For production, use Redis or similar when running multiple instances.
- Restrict CORS in production (the example enables CORS for development convenience).

Production hardening
- Do not use public proxies from client-side code. Keep API keys on the server.
- Pin or vendor third-party libraries (consider bundling lightweight-charts instead of CDN usage), add SRI if you must use CDN.
- Add Content Security Policy (CSP) headers and move inline scripts to an external bundle.
- Run secret scanning and dependency scanning (Dependabot, Snyk, or GitHub Advanced Security).

If you want, I can:
- Update the client to explicitly call http://localhost:3000 during development (helps when running the static server on 8000 and the proxy on 3000).
- Replace innerHTML usage with safe DOM APIs to prevent XSS.
- Add a dev script that runs both static server and proxy concurrently with a single command.
