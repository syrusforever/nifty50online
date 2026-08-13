async function fetchAllPrices() {
  const symbols = NIFTY50_SYMBOLS.map(s => s.replace('.NS','')).join(',');
  try {
    const resp = await fetch(`/api/quote?symbols=${encodeURIComponent(symbols)}`);
    if (!resp.ok) throw new Error('proxy fetch failed');
    const data = await resp.json();
    const quotes = data.quoteResponse?.result || [];
    quotes.forEach(q => {
      const sym = q.symbol + '.NS';
      stockData[sym] = {
        price: q.regularMarketPrice,
        change: q.regularMarketChangePercent,
        name: q.shortName || q.symbol,
        ngvs: NGVS_SCORES[sym] || 70
      };
    });
  } catch (err) {
    console.error('Quote fetch error, using mock', err);
    // fallback to mock
    NIFTY50_SYMBOLS.forEach(sym => {
      if (!stockData[sym]) stockData[sym] = {
        price: Math.random()*1000+500,
        change: (Math.random()-0.5)*5,
        name: sym.replace('.NS',''),
        ngvs: NGVS_SCORES[sym] || 70
      };
    });
  }
  renderWatchlist();
  updatePortfolioSummary();
  updateMarketTicker();
  updateOrderSummary();
  if (selectedSymbol && stockData[selectedSymbol]) updateChartForSymbol();
}
