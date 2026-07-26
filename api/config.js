// /api/config.js
// Serves public config values (like GOOGLE_CLIENT_ID) from Vercel
// Environment Variables to the browser safely.
//
// WHY THIS FILE EXISTS:
// index.html is a static file — it cannot read process.env directly.
// So we expose a tiny API endpoint that the browser calls on load,
// which returns only the values that are SAFE to expose to the frontend.
//
// GOOGLE_CLIENT_ID is safe to expose (it's not a secret).
// GOOGLE_CLIENT_SECRET is NOT used here — Google One Tap / GSI login
// works with Client ID only; no secret is needed for this flow.

export default function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=3600'); // cache for 1 hour
  return res.status(200).json({
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  });
}
