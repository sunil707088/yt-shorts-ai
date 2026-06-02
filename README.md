# 🎬 YouTube Shorts Idea Machine AI

A production-ready SaaS web application for generating viral YouTube Shorts content using Google Gemini AI.

## ✨ Features

- **25+ AI-powered tools** for content creation
- **Idea Generator** — 30 unique viral ideas with virality, difficulty, and engagement scores
- **Script Generator** — Complete scripts with hooks, CTAs, captions, and hashtags
- **Hook Generator** — 20 hooks across 8 psychological categories
- **CTA Generator, Title Generator, Hashtag Generator, Thumbnail Text, Bio Generator**
- **Script Rewriter** — AI-powered script optimization with score improvements
- **Long Form → Shorts Converter** — Extract viral Shorts from long content
- **Content Repurposer** — Adapt content for TikTok, Instagram, LinkedIn, Twitter
- **Viral Analyzer** — Detailed viral potential breakdown with 6 scoring dimensions
- **Performance Predictor** — View, engagement, and viral probability predictions
- **Trending Discovery** — AI-powered trend analysis for any niche
- **Viral Keywords** — High-impact keywords for titles, hooks, and descriptions
- **AI Assistant Chat** — ShortsGPT — your personal content strategist
- **Multi-Platform Generator** — Create platform-optimized content in one click
- **Content Calendar** — AI-generated posting schedules
- **Series Planner** — Plan episodic binge-worthy series
- **Collab Ideas** — Creative collaboration concepts
- **Saved Library** — Save and organize your best content
- **History** — Track all generations
- **Export Center** — Download as TXT, CSV, or PDF

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS |
| Animation | Framer Motion |
| State | Zustand + LocalStorage |
| Routing | React Router v6 |
| AI | Google Gemini 2.5 Flash |
| Backend | Vercel Serverless Functions |
| Fonts | Clash Display + Satoshi |

## 🚀 Quick Start

### 1. Clone and install

```bash
git clone https://github.com/yourusername/yt-shorts-idea-machine.git
cd yt-shorts-idea-machine
npm install
```

### 2. Set up environment variables

Create `.env.local` for frontend (optional overrides):
```
VITE_API_BASE=/api
```

For Vercel backend, set:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key at: https://aistudio.google.com/app/apikey

### 3. Run locally

```bash
# Frontend only (uses Vercel CLI for API)
npm run dev

# With Vercel CLI (recommended for full functionality)
npm install -g vercel
vercel dev
```

### 4. Deploy to Vercel

```bash
vercel deploy
```

In Vercel dashboard, add environment variable:
- `GEMINI_API_KEY` = your key

## 📁 Project Structure

```
yt-shorts-idea-machine/
├── api/                    # Vercel Serverless Functions
│   ├── generate.js         # All generation endpoints
│   ├── analyze.js          # Viral analysis + performance prediction
│   ├── assistant.js        # AI chat assistant
│   ├── repurpose.js        # Content repurposing
│   └── trends.js           # Trend discovery
├── src/
│   ├── pages/              # All page components
│   ├── components/
│   │   ├── layout/         # Sidebar, Header
│   │   └── shared/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── store/              # Zustand global state
│   ├── services/           # Gemini API client
│   ├── utils/              # Helper functions
│   └── layouts/            # Page layouts
├── vercel.json             # Vercel deployment config
├── vite.config.js          # Vite configuration
└── tailwind.config.js      # Tailwind configuration
```

## 🔒 Security

- ✅ API keys **never** exposed to frontend
- ✅ All AI requests route through Vercel serverless functions
- ✅ Environment variables only in Vercel dashboard
- ✅ CORS headers configured on all API routes
- ✅ Rate limiting with exponential backoff retry

## 🎨 UI Features

- 🌙 Dark / Light mode toggle (persisted)
- 📱 Mobile-first responsive design
- ✨ Glassmorphism cards
- 🎭 Framer Motion page transitions
- 💀 Loading skeletons
- 🔔 Toast notifications
- 📋 One-click copy buttons
- 📥 Export to TXT, CSV, PDF
- 💾 LocalStorage persistence for all data

## 📊 Gemini API Usage

The app uses `gemini-2.5-flash` for all generations with:
- Retry handling (3 attempts with exponential backoff)
- Structured JSON output for all responses
- Temperature 0.7–0.9 depending on task
- System instructions per endpoint type

## 🤝 Contributing

Pull requests welcome! Please open an issue first to discuss what you'd like to change.

## 📄 License

MIT — free to use, modify, and deploy.
