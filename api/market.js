// /api/market.js
// Runs on Vercel's servers, never in the user's browser.
//
// Market prices used to be fetched straight from the browser through public
// CORS proxies (allorigins.win, corsproxy.io, codetabs.com). Those proxies are
// free, shared, and frequently down or rate-limited — which is the most common
// reason "live market price" stops working. This function calls data.gov.in's
// AGMARKNET API directly, server-to-server, so no CORS proxy is needed at all.
//
// No signup is required to deploy this: it uses data.gov.in's official public
// sample key (the same one shown in their own docs), exactly like before.
// If you ever get your own data.gov.in key, you can optionally set it as the
// MARKET_API_KEY environment variable in Vercel and this function will use it
// instead automatically.

export default async function handler(req, res) {
  const { key } = req.query || {};
  // A visitor's own personal key (entered in the app's "API key settings"
  // panel) takes priority if provided, otherwise we use the server's key,
  // otherwise the official public sample key.
  const apiKey = (key && String(key).trim()) || process.env.MARKET_API_KEY || '579b464db66ec23bdd000001cdd3946e44ce4aad38d07013c9cc7be';

  const targetUrl =
    'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070' +
    '?api-key=' + encodeURIComponent(apiKey) +
    '&format=json&limit=500&filters%5Bstate%5D=Tamil+Nadu';

  try {
    const upstream = await fetch(targetUrl, { signal: AbortSignal.timeout(9000) });

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: 'AGMARKNET responded with ' + upstream.status });
    }

    const data = await upstream.json();

    // Cache for a few minutes at the edge/CDN — mandi prices don't change second to second,
    // and this keeps us well within data.gov.in's rate limits.
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(data);
  } catch (err) {
    console.error('Market proxy error:', err);
    return res.status(502).json({ error: 'Market proxy request failed: ' + (err.message || 'unknown error') });
  }
}
