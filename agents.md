# Prysm: AI-Driven Customer Feedback Analyzer - Agent Guide

Welcome, Agent! This document provides the necessary context and technical guidelines for working on the **Prysm** codebase.

## 🚀 Project Overview
Prysm is a tool designed to ingest customer feedback from multiple sources (Social Media, App Stores, etc.) and use AI to cluster them into topics and generate actionable insights.

### Core Features
- **Data Ingestion**: Real-time "OG" scraping of X (Twitter) and App Store (iOS) data without official API keys.
- **Dashboard**: High-level overview of sentiment, emerging issues, and feedback trends.
- **Connect Apps**: A modular system for linking external feedback sources.
- **AI Processing**: (Planned) Sentiment analysis and topic clustering.

## 🛠 Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS, Lucide Icons, Shadcn UI.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Axios.
- **Scraping**: `rss-parser` (Nitter mirrors for X), `app-store-scraper` (Apple App Store).
- **State Management**: Zustand (Auth, Dashboard state).

## 📁 Repository Structure
```text
prysm/
├── frontend/             # React Application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Main application views
│   │   ├── store/        # Zustand state stores
│   │   └── lib/          # API & helper functions
├── backend/              # Node.js Express API
│   ├── src/
│   │   ├── controllers/  # Route logic
│   │   ├── routes/       # API endpoints
│   │   ├── lib/          # Scraping & utility libraries
│   │   └── models/       # MongoDB schemas
└── agents.md             # This guide
```

## 🔑 Key Workflows
### Connecting X (Twitter)
- **Scraper**: Uses `backend/src/lib/xScraper.js` which rotates through multiple Nitter instances.
- **Logic**: Fetches RSS feeds for public handles to avoid API rate limits and costs.

### Connecting App Store
- **Scraper**: Uses `backend/src/lib/appStoreScraper.js` via the `app-store-scraper` NPM package.
- **Logic**: Search-based discovery of apps and review ingestion.

## 📝 Development Guidelines
1. **Design Aesthetics**: Prysm aims for a premium, Apple-style UI. Use glassmorphism, subtle gradients, and smooth transitions.
2. **Mocking**: During development without a live MongoDB, the `useAuthStore` uses a mock session (admin@prysm.ai / password123).
3. **Linting**: Ensure all code passes `npm run lint` in the `frontend` directory before pushing. CI will fail on unused variables or directives.
4. **Branching**: Use descriptive branch names like `X-connect` or `app-store-connect`.

## ⚙️ Running the Project
### Backend
```bash
cd backend
npm install
npm run dev # Runs on http://localhost:5000
```
*Requires `.env` with `MONGO_URI` and `JWT_SECRET`.*

### Frontend
```bash
cd frontend
npm install
npm run dev # Runs on http://localhost:5173
```

## 🎯 Current Objectives
- Implement Google/Gmail real-time ingestion.
- Integrate LangChain for sentiment analysis of the scraped feedback.
- Build the "Emerging Issues" alert system.

---
*Happy Coding, Agent!*
