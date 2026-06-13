# 1. Product Vision & Feature Scope

Prysm is an AI-driven customer feedback aggregator and analyzer designed for Product Managers and Customer Success teams. It unifies scattered customer feedback channels into a single workspace, processes the raw inputs, and yields actionable insights.

---

## 1. Unified User Flow

The core user experience is structured around the following sequence:

```text
[1. User Authentication]  --- Logged-out users start at / on the Landing Page and authenticate via /login.
           |                  After login, / is the Dashboard home inside the authenticated layout.
           │
[2. Ingestion Connectors] --- User connects Gmail, X, or searches App Store / Play Store on Connect Apps.
           │
[3. Custom Uploads]       --- Drag-and-drop CSV uploads for manual entries.
           │
[4. Fetch & Timeframe]    --- User selects Date Timeframe bounds (From -> To) on the Dashboard
           │                  and clicks "Fetch Data".
           │
[5. Ingestion Pipeline]   --- Backend triggers active scrapers for App Store, Play Store, X, and Gmail sync, parses and
           │                  persists records in MongoDB Feedback model.
           │
[6. Processing & AI]      --- Queries DB for feedbacks in date range, runs dynamic analysis,
           │                  logs results in AnalysisHistory, and updates metrics charts.
           │
[7. Collapsible History]  --- Finished fetches are saved as analysis summary cards in History.
```

---

## 2. Main Feature Modules

### A. The Dashboard & Timeframe Selector
* **Visual Summary Widget**: Displays Key Insights and Areas to Improve dynamically.
* **Date Picker Range Selector**: Custom dark HTML date selectors allowing the user to select specific date ranges (defaults to the last 30 days).
* **Feedback Distribution (Sentiment Gauge)**: An SVG circle gauge showing Positive, Negative, and Neutral percentages.
* **Comparison Line Charts**: Powered by `@mui/x-charts` showing volume trends grouped by month and source.
* **Positive and Negative Lists**: Displays specific customer concerns and highlights, showing the density of mentions.
* **Notification Modal**: A popup modal that provides in-app alerts on feedback trends and system notifications.

### B. App Integration Connectors
Located under **Connect Apps**. Allows the user to link their platforms:
1. **Gmail**: Standard OAuth configuration managed through Google Redirect.
2. **X (Twitter)**: Public Nitter RSS scraper.
3. **App Store**: Searches the App Store and locks onto an application ID.
4. **Play Store**: Searches the Play Store and locks onto an application ID to fetch reviews.

### C. Custom Data
Allows importing CSV files. Columns are normalized (`source`, `date`, `comment`/`feedback`), associated with the user, and saved to MongoDB.

### D. Analysis Session History
Instead of raw comments logs, the **History** tab displays historical logs of completed analysis sessions.
* Card items show: timeframe range, execution timestamp, total volume, and overall satisfaction score.
* Includes a multi-colored inline sentiment progress bar.
* Expandable section lists the exact Key Insights and Areas to Improve calculated for that run.

### E. Account Management & Settings
Allows users to manage their profile data and configure API keys.

### F. Documentation & Support
Provides access to system architecture details, feature explanations, and help resources.

---

## 3. Bring Your Own API Key (BYOK) Specifications

To respect user data privacy and keep server execution costs at zero, the application supports client-supplied credentials for LLM analysis.

### A. Key Acquisition & Storage
* Users input their API keys for chosen LLM providers (Gemini, Anthropic, OpenAI, or local models) in the settings panel.
* These keys are stored client-side in the browser's `localStorage` and never permanently stored on the centralized server database.

### B. Header Injection Pipeline
* When calling the fetch or analyze endpoints, the client must inject the credentials into request headers:
  * `X-LLM-Provider`: The provider name (e.g., `gemini`, `openai`, `anthropic`).
  * `X-LLM-Key`: The raw API token.
* The backend reads these headers, dynamically initializes the appropriate LangChain model instance, processes the request, and discards the credentials immediately upon completion.
