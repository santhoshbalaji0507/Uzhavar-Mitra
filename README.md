# 🌾 உழவர் மித்ரா — Uzhavar Mitra

> **Your AI-powered farming companion for Tamil Nadu**

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Click%20Here-brightgreen?style=for-the-badge)](https://your-deployment-link-here.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-uzhavar--mitra-181717?style=for-the-badge&logo=github)](https://github.com/YOUR_USERNAME/uzhavar-mitra)
[![Made with Claude](https://img.shields.io/badge/AI-Claude%20API-orange?style=for-the-badge)](https://anthropic.com)
[![Tamil Nadu](https://img.shields.io/badge/Region-Tamil%20Nadu-blue?style=for-the-badge)](https://tn.gov.in)

---

## 🔗 Live Demo

> **👉 [https://your-deployment-link-here.vercel.app](https://uzhavar-mitra.vercel.app/)**


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
- **AI** — Anthropic Claude API (`claude-sonnet-4-6`)
- **Weather** — OpenWeatherMap API
- **Market Prices** — data.gov.in AGMARKNET API (Official Government)
- **Backend Proxy** — Vercel Serverless Functions (`/api/ai.js`, `/api/weather.js`)
- **Deployment** — Vercel

---

## 📁 Project Structure

```
uzhavar-mitra/
├── index.html          ← Main app (UI + JS logic)
├── api/
│   ├── ai.js           ← Vercel proxy for Claude API
│   └── weather.js      ← Vercel proxy for OpenWeatherMap
├── package.json
├── .env.example        ← Template for environment variables
├── .gitignore
└── README.md
```

---

## 🚀 Deploy Your Own

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/uzhavar-mitra.git
cd uzhavar-mitra
```

### 2. Get API Keys
- **Claude API** → [console.anthropic.com](https://console.anthropic.com) → API Keys
- **OpenWeatherMap** → [openweathermap.org](https://openweathermap.org/api) → Sign up → API Keys (free)

### 3. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your GitHub repo
2. Framework Preset → **Other**
3. Go to **Settings → Environment Variables** → Add:

| Key | Value |
|---|---|
| `ANTHROPIC_API_KEY` | your Claude API key |
| `OWM_API_KEY` | your OpenWeatherMap API key |

4. Click **Deploy** → Done ✅

---

## 🔐 Environment Variables

```env
ANTHROPIC_API_KEY=your-anthropic-key-here
OWM_API_KEY=your-openweathermap-key-here
```

> ⚠️ Never commit real API keys. Use `.env` locally (it's gitignored) and Vercel Environment Variables in production.

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
