// server.js
// Simple server-side proxy for market quotes (demo). Do not expose private keys in client-side code.

const express = require('express');
// Use Node 18+ global fetch. Ensure you're running Node 18+ or provide a fetch polyfill.
if (typeof fetch === 'undefined') {
  console.warn('Global fetch is not available. Please run this server with Node 18+ or add a fetch polyfill.');
}
const rateLimit = require('express-rate-limit');
const cors = require('cors');
require('dotenv').config();

const QuickLRU = require('quick-lru');

const app = express();
const PORT = process.env.PORT || 3000;
// CACHE_TTL in seconds in .env; convert to ms here
const CACHE_TTL = parseInt(process.env.CACHE_TTL || '15', 10) * 1000; // seconds -> ms
// CACHE_MAX_SIZE controls LRU capacity (number of distinct keys)
const CACHE_MAX_SIZE = parseInt(process.env.CACHE_MAX_SIZE || '500', 10);

app.use(cors()); // restrict in production: cors({ origin: 'https://yourdomain.com' })

// LRU cache with max size and TTL (maxAge in ms)
const cache = new QuickLRU({ maxSize: CACHE_MAX_SIZE, maxAge: CACHE_TTL });

const limiter = rateLimit({
  windowMs: 60_000, // 1 minute
  max: 60, // adjust as needed
});
app.use(limiter);

// Very small whitelist/validation for symbols: letters, digits, comma
function validateSymbols(raw) {
  if (!raw) return null;
  const cleaned = String(raw).toUpperCase().replace(/[^A-Z0-9,]/g, '');
  if (!cleaned) return null;
  // Optionally further restrict to NIFTY50 list if you want
  return cleaned;
}

app.get('/api/quote', async (req, res) => {
  try {
    if (typeof fetch === 'undefined') {
      return res.status(500).json({
        error: 'server_fetch_unavailable',
        message: 'Global fetch is not available on this Node runtime. Use Node 18+ or add a fetch polyfill.'
      });
    }

    const symbols = validateSymbols(req.query.symbols);
    if (!symbols) return res.status(400).json({ error: 'missing or invalid symbols' });

    const cacheKey = `quote:${symbols}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Example upstream call to Yahoo Finance
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols)}`;
    const upstreamRes = await fetch(url, { method: 'GET' });
    if (!upstreamRes.ok) {
      const text = await upstreamRes.text();
      // Log upstream details server-side, but avoid exposing raw upstream text in production
      console.error('Upstream fetch error', upstreamRes.status, text ? text.slice(0, 200) : '');
      return res.status(502).json({ error: 'upstream error' });
    }
    const json = await upstreamRes.json();

    // Basic validation: ensure object shape
    if (!json || !json.quoteResponse) return res.status(502).json({ error: 'unexpected upstream response' });

    cache.set(cacheKey, json);
    return res.json(json);
  } catch (err) {
    console.error('Proxy error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server proxy listening on ${PORT}`);
});
