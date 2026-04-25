# Prysm: AI-Driven Customer Feedback Analyzer - Agent Configuration and Development Guide

This document provides the canonical technical context, architectural decisions, and specific instructions for AI agents working on the Prysm repository.

## 1. Project Overview and Product Vision

Prysm is an AI-driven platform designed to automate the customer feedback analysis pipeline. It ingests massive volumes of unstructured feedback from diverse channels (social media, app reviews, support tickets) and utilizes AI to categorize data, detect trends, and extract actionable insights in real-time. 

Instead of presenting raw sentiment scores, Prysm pinpoints specific issues and prioritizes them for product managers and customer success teams.

### Core Features (Current & Planned)
*   **Data Ingestion**: Aggregation of data via real-time public scraping ("OG" data) and API connectors.
*   **AI Processing**: Sentiment analysis, topic clustering, and insight generation using LLMs.
*   **Real-Time Alerts**: Proactive notifications for "emerging issues" before they escalate.
*   **Dashboard**: Centralized, department-specific reports and visualizations.

## 2. Technology Stack and Architecture

### Frontend
*   **Core**: React.js, Vite
*   **Styling**: Tailwind CSS, generic UI components (Shadcn UI patterns), Lucide Icons
*   **State Management**: Zustand
*   **Data Visualization**: (Planned) Chart.js or Recharts
*   **Real-time Communication**: (Planned) Socket.io client

### Backend
*   **Core**: Node.js, Express.js
*   **Database**: MongoDB (via Mongoose)
*   **Data Ingestion Modules**:
    *   **X (Twitter)**: Utilizes `rss-parser` to scrape data from Nitter instances (`src/lib/xScraper.js`). This avoids official API rate limits and key requirements.
    *   **Apple App Store**: Utilizes the `app-store-scraper` package (`src/lib/appStoreScraper.js`) for direct review and app metadata ingestion.
*   **AI Orchestration**: (Planned) LangChain.js for multi-step AI tasks.
*   **Real-time Communication**: (Planned) Socket.io server.

## 3. Repository Structure

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

## 4. Agent Development Instructions and Constraints

When writing code or implementing features, AI agents must adhere to the following rules:

### Data Ingestion and Integrations
*   **Scraping First**: Prioritize public scraping methods over official API integrations that require complex authentication or paid tiers. The architecture relies on "OG" data fetching (e.g., Nitter for X, `app-store-scraper` for iOS).
*   **Resiliency**: Scrapers must implement fallbacks. For example, the `xScraper.js` must iterate through an array of known Nitter instances if one fails.

### Authentication and State
*   **Global Auth Modal**: The application uses a unified `AuthModal` component over the root dashboard for login/registration instead of dedicated routes (`/login` or `/register`).
*   **Mock Environment**: The application currently relies on a mock authentication bypass within `frontend/src/store/useAuthStore.js` to facilitate rapid frontend development without a live MongoDB connection. 
    *   **Demo Credentials** are used (e.g. `admin@prysm.ai` / `password123`) but removed from the UI for production feel.
    *   **Persistence**: Session state is persisted using `localStorage`.
*   **Future RBAC**: Ensure that any new dashboard routes or backend endpoints are structured to support future Role-Based Access Control (RBAC) via JWTs.

### UI/UX and Design Standards
*   **Premium Aesthetics**: Prysm targets enterprise users. The UI must utilize modern design principles: glassmorphism, subtle gradients, clean typography, and smooth transitions. Avoid default browser styling.
*   **Component Modularity**: Build reusable components in `frontend/src/components/`. The integration modals (e.g., `app-store-connect-modal.jsx`, `x-connect-modal.jsx`) serve as the standard pattern for adding new data sources.

### Code Quality
*   **Linting**: All frontend code must pass `npm run lint` cleanly. Unused variables and unnecessary eslint-disable directives will cause CI failures.

## 5. Deployment Architecture

Prysm utilizes a decoupled deployment architecture optimized for performance and long-running background tasks.

*   **Frontend (Vercel)**: Hosted on Vercel's Edge Network for fast static delivery.
    *   **Env Variables**: `VITE_API_URL` (Must point to the Render backend URL, e.g., `https://prysm-backend.onrender.com/api`).
*   **Backend (Render)**: Hosted on Render as a persistent Web Service. Render is chosen over Vercel serverless functions because scraping tasks can exceed Vercel's 10-second timeout, and Render supports persistent WebSockets for future real-time updates.
    *   **Env Variables**: 
        *   `FRONTEND_URL` (Must point to the Vercel URL, e.g., `https://prysm.vercel.app` for CORS validation).
        *   `MONGO_URI` (Database connection string).
        *   `JWT_SECRET` (For future RBAC implementation).
*   **Infrastructure as Code**: The backend deployment is defined via `render.yaml` in the root directory.

## 6. Current Implementation Roadmap

Agents should be aware of the following immediate development priorities:

1.  **AI Pipeline Integration**: Implement the preprocessing and LangChain.js orchestration layer to cluster the raw data currently being fetched by the X and App Store scrapers.
2.  **Live Dashboard Updates**: Integrate Socket.io to push real-time scraping results and AI insights directly to the frontend dashboard.
3.  **Alerting Logic**: Develop the trend detection algorithm to trigger alerts based on specific percentage increases in negative sentiment topics.
