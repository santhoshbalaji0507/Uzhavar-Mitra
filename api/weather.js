// /api/weather.js
// Runs on Vercel's servers, never in the user's browser.
//
// Previously the OpenWeatherMap key sat in a plain JS constant inside
// index.html — visible to anyone who viewed page source or opened DevTools.
// This proxy fixes that the same way api/ai.js hides the Anthropic key: the
// key lives only in Vercel's Environment Variables (WEATHER_API_KEY), and the
// browser only ever talks to this endpoint, never to OpenWeatherMap directly.
//
// If WEATHER_API_KEY isn't set, this falls back to a shared demo key so the
// app still works out of the box right after deploying — but that fallback
// key lives here on the server only, and is never shipped to the browser.

export default async function handler(req, res) {
  const { type = 'weather', lat, lon, q, key } = req.query;

  // A visitor's own personal key (entered in the app's "API key settings"
  // panel) takes priority if provided, otherwise we use the server's key.
  const apiKey = (key && String(key).trim()) || process.env.WEATHER_API_KEY || 'f9f88d89e9f04f3a7c1fbbc4fe96cca3';

  const base = 'https://api.openweathermap.org';
  const endpoints = {
    weather:  `${base}/data/2.5/weather?lat=${encodeURIComponent(lat || '')}&lon=${encodeURIComponent(lon || '')}&appid=${apiKey}&units=metric`,
    forecast: `${base}/data/2.5/forecast?lat=${encodeURIComponent(lat || '')}&lon=${encodeURIComponent(lon || '')}&appid=${apiKey}&units=metric`,
    uvi:      `${base}/data/2.5/uvi?lat=${encodeURIComponent(lat || '')}&lon=${encodeURIComponent(lon || '')}&appid=${apiKey}`,
    geo:      `${base}/geo/1.0/direct?q=${encodeURIComponent(q || '')}&limit=1&appid=${apiKey}`,
  };
  const target = endpoints[type] || endpoints.weather;

  try {
    const upstream = await fetch(target, { signal: AbortSignal.timeout(9000) });
    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      // Forward OpenWeatherMap's real error (401 = bad key, 429 = rate limit)
      // so the app can show a useful message — without ever revealing the key.
      return res.status(upstream.status).json(
        data && Object.keys(data).length ? data : { message: 'OpenWeatherMap error ' + upstream.status }
      );
    }

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(data);
  } catch (err) {
    console.error('Weather proxy error:', err);
    return res.status(502).json({ message: 'Weather proxy request failed: ' + (err.message || 'unknown error') });
  }
}
