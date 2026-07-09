# Uzhavar Mitra — Deployment Guide

## What changed and why

Your original file called the AI and the weather API **directly from the browser**.
That means any API key placed there is visible to anyone who views the page source —
so it can never be "safely" stored client-side, no matter how it's hidden.

This version adds two small serverless functions (`/api/ai.js` and `/api/weather.js`)
that run on Vercel's servers. The browser calls *those*, and the functions call
Anthropic / OpenWeatherMap using keys stored in Vercel's **Environment Variables**
— which are never sent to the browser and never appear in your GitHub repo.

```
Browser  --->  /api/ai.js (Vercel server, has the real key)  --->  Anthropic API
Browser  --->  /api/weather.js (Vercel server, has the real key)  --->  OpenWeatherMap API
```

## Files

- `index.html` — your app, unchanged except it now calls `/api/ai` and `/api/weather`
  instead of a placeholder Worker URL and a hardcoded key.
- `api/ai.js` — proxies Claude/Anthropic calls.
- `api/weather.js` — proxies OpenWeatherMap calls.
- `.env.example` — shows which environment variables are needed (no real values).

## 1. Get your API keys

- **Anthropic (Claude) key**: https://console.anthropic.com/ → Settings → API Keys
- **OpenWeatherMap key**: https://home.openweathermap.org/api_keys
  - ⚠️ The key that was in your original file (`49f83bbd...`) was already exposed
    publicly. Generate a **new** key on OpenWeatherMap and use that instead —
    treat the old one as compromised.

## 2. Push this project to GitHub

```bash
cd uzhavar-mitra
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

`.env` is already excluded via `.gitignore`, so even if you create one locally
for testing, it won't be pushed.

## 3. Deploy on Vercel

1. Go to https://vercel.com → **Add New Project** → import your GitHub repo.
2. Vercel will auto-detect it (static `index.html` + `/api` functions). No build
   command is needed — leave the defaults.
3. Before clicking Deploy (or right after, then redeploy), go to
   **Settings → Environment Variables** and add:

   | Name | Value |
   |---|---|
   | `ANTHROPIC_API_KEY` | your real Anthropic key |
   | `OWM_API_KEY` | your real (new) OpenWeatherMap key |

4. Click **Deploy**. Once it's live, the AI assistant and live market prices
   (which both go through `/api/ai`) and the weather widgets (through
   `/api/weather`) should all work.

## 4. Test it

Open your deployed URL and check:
- Weather loads on the home screen.
- "Refresh prices" under market prices shows live data instead of the fallback list.
- The AI chat panel responds.

If something fails, check **Vercel Dashboard → your project → Deployments →
Functions logs** — it will show the actual error from Anthropic/OpenWeatherMap
without exposing your key.

## Key-safety checklist

- ✅ Never put an API key directly in `index.html` or any file the browser downloads.
- ✅ Keep keys only in Vercel's Environment Variables (or a local `.env` that's gitignored).
- ✅ Rotate/regenerate any key that was ever committed to a public repo or pasted into client-side code.
- ✅ `.gitignore` already excludes `.env` so you don't accidentally commit secrets.
