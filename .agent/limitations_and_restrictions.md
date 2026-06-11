# 3. Limitations, Restrictions, & Team Ownership Rules

As Prysm is a collaborative project worked on by multiple developers and AI agents, specific boundaries must be respected.

---

## 1. Collaborative Ownership Rules (CRITICAL)

### A. Preserved Teammate Files
The following files are managed by another teammate. Under no circumstances should any agent delete, refactor, or modify these files:
* **[fetchEmailDetails.js](file:///c:/Coding%20Workspace/prysm/backend/src/lib/fetchEmailDetails.js)**: Holds duplicate helper functions. Do not modify.
* **[gmailUser.model.js](file:///c:/Coding%20Workspace/prysm/backend/src/models/users/gmailUser.model.js)**: Contains secondary user modeling. Do not modify.

### B. Scoped Dashboard Ingestion
* The Fetch Data button on the Dashboard is strictly scoped to execute scrapes for X (Twitter) and the Apple App Store only.
* Do NOT trigger automated Gmail API fetches from the dashboard. Gmail syncing is handled separately by the teammate's Gmail button flows on the Connect page.
* Gmail feedbacks are loaded from the database and filtered by timeframe dates, but the dashboard must never make active requests to Google API.

---

## 2. API & Scraper Limitations

### A. X (Twitter) Nitter Feeds
* **Mechanism**: Scrapes public Nitter RSS instances to bypass official API pricing.
* **Constraint**: Nitter RSS only exposes the 20 most recent posts of an account timeline. Historical timeframe requests (e.g. searching 6 months ago) cannot fetch old posts directly from Nitter RSS.
* **Ingestion Strategy**: The system stores all scraped tweets in MongoDB. Successive scrapes accumulate data over time, allowing historical timeframe searches from the database.

### B. Apple App Store reviews
* **Mechanism**: Queries App Store listings via `app-store-scraper`.
* **Constraint**: The App Store limits review scraping to a maximum of 10 pages (500 reviews).
* **Ingestion Strategy**: We paginate pages 1 to 10 in [appStoreScraper.js](file:///c:/Coding%20Workspace/prysm/backend/src/lib/appStoreScraper.js) sorted by RECENT. We compare each review's date against the user's selected `startDate` and terminate scraper requests early once we hit reviews older than the start range.

### C. Google Play Store reviews
* **Mechanism**: Queries Play Store listings via `google-play-scraper`.
* **Constraint**: Fetches up to 100 newest reviews per request.
* **Ingestion Strategy**: Queries reviews sorted by `NEWEST` (`gplay.sort.NEWEST`) for the configured App ID and persists them in MongoDB.

### D. Cost Restrictions
* Do not introduce paid APIs (such as OpenAI or paid scrapers) in default branches. All operations must run using free scrapers, local rule-based analysis tools, or "Bring Your Own API Key" settings configurations where LLM costs are borne by the user's personal keys.

---

## 3. Route Protection & Layout Rules

### A. Layout Separation
* **Authenticated vs Public**: Unauthenticated routes (`/`, `/login`, `/terms`, `/privacy`) must be kept completely separate from the authenticated sidebar layout wrapper. Any layout leaks (such as the sidebar appearing on the landing page) are prohibited.
* **Redirection Rules**:
  * Unauthenticated users hitting `/` see the Landing Page, `/login` see the LoginPage, `/terms` see the TermsPage, `/privacy` see the PrivacyPage. Any other route redirects to `/`.
  * Authenticated users hitting `/` or `/login` are automatically redirected to `/dashboard`. Any invalid subpath redirects to `/dashboard`.
* **Sidebar Integrity**: The sidebar footer must dynamically fetch active session data from `useAuthStore` rather than relying on static placeholders. Sizing of the sidebar container is fixed via `className="w-64 shrink-0"` to prevent dynamic layout shifts caused by user email/name text length.
