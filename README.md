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
| 🤖 AI Chatbot | Claude-powered farming assistant (Tamil & English) |
| 🌦️ Live Weather | GPS-based real-time weather via OpenWeatherMap |
| 📊 Market Prices | Live mandi prices from **data.gov.in AGMARKNET** (Official Govt) |
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
- **AI** — Anthropic Claude API (`claude-sonnet-4-6`), via a serverless proxy (needs your own key)
- **Weather** — OpenWeatherMap API, called directly from the browser (works with zero setup)
- **Market Prices** — data.gov.in AGMARKNET API, called directly from the browser (works with zero setup)
- **Backend Proxy** — Vercel Serverless Function (`/api/ai.js` — required for AI only)
- **Deployment** — Vercel (or any static host, if you don't need the AI chat)

---

## 📁 Project Structure

```
uzhavar-mitra/
├── index.html          ← Main app (UI + JS logic). Weather & market prices
│                          call their APIs directly — no setup needed.
├── api/
│   └── ai.js             ← Vercel proxy for Claude API — the ONLY piece that
│                            needs a key you set up (Anthropic doesn't allow
│                            safe direct-from-browser calls)
├── package.json
├── .env.example        ← Template for environment variables
├── .gitignore
└── README.md
```

### Why only AI needs a server

Calling Claude's API directly from the browser would expose your Anthropic key
to anyone who views the page source — it can never be "safely" hidden
client-side, and Anthropic doesn't provide a public shared key the way some
government/weather APIs do. So AI chat is proxied through a small serverless
function that runs on Vercel's servers, using a key stored in Vercel's
**Environment Variables** (never sent to the browser, never committed to GitHub):

```
Browser  --->  OpenWeatherMap directly (bundled free key, no server needed)
Browser  --->  data.gov.in / AGMARKNET directly (their official public demo key, no server needed)
Browser  --->  /api/ai.js (Vercel server, your real key)  --->  Anthropic API
```

Weather and market prices work the moment you open `index.html` — even without
deploying anything. The bundled keys are shared by everyone using this code,
so if you ever hit a rate-limit error, get your own free key (links below) and
swap it into the `OWM_KEY` constant near the top of the `<script>` in
`index.html` (for weather — market prices already use data.gov.in's official
shared key, which is meant to be used this way).

---

## 🚀 Deploy Your Own

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/uzhavar-mitra.git
cd uzhavar-mitra
```

### 2. Get an API Key
- **Claude API** (required, only for AI chat) → [console.anthropic.com](https://console.anthropic.com) → Settings → API Keys
- Weather and market prices need nothing from you — they work out of the box.
- *(Optional)* if you ever hit a rate limit on the bundled OpenWeatherMap key,
  get your own free one at [openweathermap.org](https://openweathermap.org/api)
  and swap it into `OWM_KEY` in `index.html`.

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
| `ANTHROPIC_API_KEY` | your Claude API key |

That's the only one required. Weather and market prices work without any
environment variables at all.

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
- This calls OpenWeatherMap directly with the bundled key — no deploy or env
  var needed. If it fails, check DevTools Console for the exact error; a 429
  means the shared bundled key is rate-limited (get your own free key and
  swap it into `OWM_KEY` in `index.html`).

**Market prices show "cached" instead of live**
- This calls data.gov.in directly via a CORS proxy — no deploy or env var
  needed. Check DevTools Console for the error. The public CORS proxy
  (`api.allorigins.win`) can occasionally be slow/overloaded; retry the
  "Refresh prices" button, it usually recovers within a minute or two.

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
