# Pull request: feat/server-proxy → main

## Summary
Adds a small Express proxy that fetches market quotes from Yahoo Finance on behalf of the client, implements short in-memory caching and rate-limiting, and updates the client to call `/api/quote`. Also includes a README with run instructions and a .env.example.

## What changed
- server.js: Express proxy (validates symbols, caches results, rate-limits).
- index.html: client fetch now calls `/api/quote` and falls back to mock data when the proxy fails.
- package.json: added `serve:proxy` script to run the proxy.
- .env.example: sample configuration values.
- README.md: development & security notes.

## Testing
1. npm install express express-rate-limit cors node-fetch dotenv
2. npm start
3. npm run serve:proxy
4. Open http://localhost:8000 and verify the app loads and the network tab shows calls to /api/quote.

## Notes
- The proxy enables CORS for development; restrict CORS in production.
- Consider replacing in-memory cache with Redis for multi-instance deployments.
