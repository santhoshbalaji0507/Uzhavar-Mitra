// /api/weather.js
// Proxies OpenWeatherMap requests so the API key stays server-side
// (in Vercel's Environment Variables as OWM_API_KEY), instead of sitting
// in plain text inside the browser's JavaScript.

export default async function handler(req, res) {
  const apiKey = process.env.OWM_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfigured: OWM_API_KEY is not set' });
  }

  const { type, lat, lon, q } = req.query;

  let url;
  switch (type) {
    case 'weather':
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      break;
    case 'forecast':
      url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      break;
    case 'uvi':
      url = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      break;
    case 'geo':
      url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q || '')}&limit=1&appid=${apiKey}`;
      break;
    default:
      return res.status(400).json({ error: 'Invalid or missing "type" query param' });
  }

  try {
    const owmRes = await fetch(url);
    const data = await owmRes.json();
    return res.status(owmRes.status).json(data);
  } catch (err) {
    console.error('Weather proxy error:', err);
    return res.status(500).json({ error: 'Weather proxy request failed' });
  }
}
