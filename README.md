# 🌾 உழவர் மித்ரா — Uzhavar Mitra

> **Your AI-powered farming companion for Tamil Nadu**

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Click%20Here-brightgreen?style=for-the-badge)](https://your-deployment-link-here.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-uzhavar--mitra-181717?style=for-the-badge&logo=github)](https://github.com/YOUR_USERNAME/uzhavar-mitra)
[![Made with Claude](https://img.shields.io/badge/AI-Claude%20API-orange?style=for-the-badge)](https://anthropic.com)
[![Tamil Nadu](https://img.shields.io/badge/Region-Tamil%20Nadu-blue?style=for-the-badge)](https://tn.gov.in)

---

## 🔗 Live Demo

> **👉 [INSERT YOUR DEPLOYED URL HERE]**
>
> _e.g. `https://uzhavar-mitra.vercel.app` — replace both this line and the_
> _"Live Demo" badge link above once you've deployed on Vercel._

---

## 📖 About

**Uzhavar Mitra (உழவர் மித்ரா)** is a bilingual (Tamil/English) AI-powered agricultural assistant web app built specifically for Tamil Nadu farmers. It provides real-time weather, live government mandi prices, crop guides, pest management, government schemes, and an AI chatbot — all in a single-file web app.

Built as a Mini Project by a Computer Science & Engineering student at **VSB Engineering College, Karur**.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Sign In with Google | One-tap sign-in alongside email/password (needs your own free Google Client ID) |
| 🤖 AI Chatbot | Claude-powered farming assistant (Tamil & English) |
| 🌦️ Live Weather | GPS-based real-time weather via OpenWeatherMap, key hidden server-side (like the AI key) with an optional "⚙️ API key settings" panel for your own key |
| 📊 Market Prices | Live mandi prices from **data.gov.in AGMARKNET**, proxied through a Vercel serverless function for reliability, with an optional personal key via "⚙️ API key settings" (Official Govt) |
| 🌱 Crop Guide | 40+ Tamil Nadu crops with care tips & schedules |
| 🐛 Pest Guide | Common pests, symptoms & treatment for TN crops |
| 📅 Farm Diary | Personal farm activity tracker |
| 🧪 Soil Calculator | Fertilizer & soil health calculator |
| 📜 Govt Schemes | PM-KISAN, TNAU schemes & how to apply |
| 🌐 Bilingual | Full Tamil + English language toggle |
| 🗓️ Harvest Calendar | Season-wise crop planning for Tamil Nadu |

---

## 🛠️ Tech Stack

- **Frontend** — Pure HTML, CSS, JavaScript (single file)
- **Auth** — Email/password (stored in `localStorage`, demo-grade only) + optional Google Sign-In via Google Identity Services
- **AI** — Anthropic Claude API (`claude-sonnet-4-6`), via a serverless proxy (needs your own key)
- **Weather** — OpenWeatherMap API, proxied through `/api/weather.js` so the key is never exposed in client code (falls back to a direct browser call only if you've entered your own personal key and no server is available)
- **Market Prices** — data.gov.in AGMARKNET API, proxied through `/api/market.js` (server-to-server, no CORS proxy needed) with a browser-side CORS-proxy fallback for static hosting
- **Backend Proxy** — Vercel Serverless Functions (`/api/ai.js` for AI, `/api/weather.js` for weather, `/api/market.js` for market prices)
- **Deployment** — Vercel (required for AI chat, hidden-key weather, and reliable live market prices — see Troubleshooting below for the static-hosting fallback)

---

## 📁 Project Structure

```
uzhavar-mitra/
├── index.html          ← Main app (UI + JS logic). Calls /api/weather and
│                          /api/market — no keys live in this file anymore.
├── api/
│   ├── ai.js              ← Vercel proxy for Claude API — needs a key you set
│   │                          up (Anthropic doesn't allow safe direct-from-
│   │                          browser calls)
│   ├── weather.js          ← Vercel proxy for OpenWeatherMap — hides the key
│   │                           server-side, same pattern as ai.js. Works with
│   │                           zero setup (optional WEATHER_API_KEY).
│   └── market.js           ← Vercel proxy for AGMARKNET market prices — avoids
│                               the flaky public CORS proxies used previously.
│                               Works with zero setup (optional MARKET_API_KEY).
├── package.json
├── .env.example        ← Template for environment variables
├── .gitignore
└── README.md
```

### Why every API call goes through a server now

Calling Claude's API directly from the browser would expose your Anthropic key
to anyone who views the page source — it can never be "safely" hidden
client-side. So AI chat is proxied through a small serverless function that
runs on Vercel's servers, using a key stored in Vercel's **Environment
Variables** (never sent to the browser, never committed to GitHub).

Weather used to work by putting an OpenWeatherMap key straight into
`index.html` as a plain constant — visible to anyone who viewed page source or
opened DevTools. It's now hidden the same way as the AI key: `/api/weather.js`
holds the key server-side, and the browser only ever calls that endpoint.

Market prices technically *can* be called straight from the browser, but
data.gov.in doesn't allow cross-origin requests, so that path used to depend
on free public CORS proxies (allorigins.win, corsproxy.io, codetabs.com) which
are often slow, down, or rate-limited. Routing it through `/api/market.js`
instead makes it a normal server-to-server call with no CORS proxy involved.

```
Browser  --->  /api/weather.js (Vercel server, key hidden)  --->  OpenWeatherMap
Browser  --->  /api/market.js (Vercel server)                --->  data.gov.in / AGMARKNET
Browser  --->  /api/ai.js (Vercel server, your real key)     --->  Anthropic API
```

This means **weather and market prices now require deployment to Vercel** to
work with zero configuration — the same requirement AI chat already had. If
you don't want to deploy at all, you can still get weather working locally by
adding your own free OpenWeatherMap key in the app's **Account → ⚙️ API key
settings** panel; the app will fall back to calling OpenWeatherMap directly
from the browser using that personal key when `/api/weather` isn't reachable.
Market prices fall back the same way to the old CORS-proxy chain when
`/api/market` isn't reachable.

---

## 🚀 Deploy Your Own

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/uzhavar-mitra.git
cd uzhavar-mitra
```

### 2. Get an API Key
- **Claude API** (required, only for AI chat) → [console.anthropic.com](https://console.anthropic.com) → Settings → API Keys
- **Weather** works out of the box once deployed (uses a shared server-side
  fallback key). *(Optional)* for guaranteed no-rate-limit weather, get your
  own free key at [openweathermap.org](https://openweathermap.org/api) and
  either set it as the `WEATHER_API_KEY` environment variable in Vercel (see
  below), or paste it into the app's **Account → ⚙️ API key settings** panel
  (per-browser, no redeploy needed).
- **Market prices** need nothing from you — they work out of the box once
  deployed.
- *(Optional)* to enable the **"Continue with Google"** button:
  1. Go to [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
  2. Create an **OAuth Client ID** → Application type **Web application**
  3. Under **Authorized JavaScript origins**, add your deployed URL (and
     `http://localhost:3000` or similar for local testing)
  4. Copy the Client ID and paste it into the `GOOGLE_CLIENT_ID` constant near
     the bottom of the `<script>` in `index.html`
  Until you do this, the button shows a friendly message explaining what's
  missing instead of failing silently.

### 3. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/uzhavar-mitra.git
git push -u origin main
```
`.env` is already excluded via `.gitignore`, so even if you create one locally
for testing, it won't be pushed.

### 4. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your GitHub repo
2. Vercel auto-detects the static `index.html` + `/api` functions — no build
   command needed, leave the defaults
3. Before (or right after) deploying, go to **Settings → Environment Variables** and add:

| Key | Value |
|---|---|
| `ANTHROPIC_API_KEY` | your Claude API key (required) |
| `WEATHER_API_KEY` | your own OpenWeatherMap key (optional — falls back to a shared server-side demo key if unset) |
| `MARKET_API_KEY` | your own data.gov.in key (optional — falls back to the official public sample key if unset) |

Only `ANTHROPIC_API_KEY` is required. Weather and market prices work with
zero extra environment variables once deployed on Vercel.

4. Click **Deploy** → once live, add the URL to the **Live Demo** section at the
   top of this README ✅

### 5. Test it
Open your deployed URL and check:
- Weather loads on the home screen (works immediately, even before deploying)
- "🔄 Refresh prices" under Market Prices shows live data instead of the fallback list
- The AI chat panel responds (this is the one that needs `ANTHROPIC_API_KEY` set)

---

## 🔐 Environment Variables

```env
ANTHROPIC_API_KEY=your-anthropic-key-here
```

This is the only key you need to set. Weather and market prices use keys
already bundled in `index.html` and require no configuration.

> ⚠️ Never commit real API keys. Use `.env` locally (it's gitignored) and Vercel
> Environment Variables in production. Rotate/regenerate any key that was ever
> committed to a public repo or pasted into client-side code.

---

## 🩺 Troubleshooting

If something isn't working after deploying, open your browser's DevTools →
Console tab — every failed API call now logs the real error before falling
back to cached/default content, instead of failing silently.

**AI chat only gives default/fallback answers**
- `/api/ai` is failing — check `ANTHROPIC_API_KEY` is set in Vercel and
  **redeploy** (env vars set after a deploy don't apply retroactively)
- Confirm the site is actually deployed on Vercel (or another host with
  serverless functions) — `/api/ai` doesn't exist on plain static hosting.
  Weather and market prices don't have this requirement; only AI chat does.

**Weather doesn't load**
- If deployed on Vercel, this now goes through `/api/weather.js` (key hidden
  server-side) — check **Vercel Dashboard → your project → Deployments →
  Functions logs** for the real error (401 = bad key, 429 = rate limit).
- If you're opening `index.html` as a static file with no server, weather
  only works if you've added your own key in **Account → ⚙️ API key
  settings** — otherwise there's no key available client-side anymore (by
  design, so nothing is exposed in page source).

**"Continue with Google" shows an error instead of signing in**
- This means `GOOGLE_CLIENT_ID` in `index.html` is still the placeholder
  value. Follow the setup steps in "Get an API Key" above to create your own
  OAuth Client ID and paste it in — this can't work with a shared/bundled key
  the way weather does, since it has to be registered to your exact domain.

**Market prices show "cached" instead of live**
- If deployed on Vercel, this now goes through `/api/market.js` first (a
  normal server call, no CORS proxy) — check **Vercel Dashboard → your
  project → Deployments → Functions logs** for the real error.
- If you're opening `index.html` as a static file with no server, it falls
  back to public CORS proxies (`allorigins.win`, `corsproxy.io`,
  `codetabs.com`), which can be slow/overloaded; retry "Refresh prices" or
  deploy to Vercel for the more reliable server-side path.

You can also check **Vercel Dashboard → your project → Deployments →
Functions logs** for server-side errors without exposing your keys.

---

## 📸 Screenshots

> *(Add your screenshots here after deployment)*

| Home & Weather | Market Prices | AI Chatbot |
|---|---|---|
| ![Weather](screenshots/weather.png) | ![Market](screenshots/market.png) | ![Chat](screenshots/chat.png) |

---

## 👨‍💻 Developer

**Sandy**
- 🎓 B.E. Computer Science & Engineering — VSB Engineering College, Karur
- 💼 AI Web Developer Intern — InAmigos Foundation
- 📍 Tirupur, Tamil Nadu

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <b>🌾 Built with ❤️ for Tamil Nadu Farmers 🌾</b><br/>
  <i>உழவே உயிர் — Farming is Life</i>
</div>
