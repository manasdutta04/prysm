const documentationContent = [
  {
    id: "quick-start",
    title: "1. Quick Start",
    content: `
Prysm is a web app for collecting customer feedback from app stores, X, Gmail, and CSV uploads, then analyzing it with your own AI API key. There is nothing to install — use the version already deployed on Vercel in your browser.

Open the app and go to /login to create an account or sign in. After login you land on the Dashboard.

Recommended first-time flow:
Create your account at /login
Configure an LLM provider and API key in /settings
Connect at least one data source in /connect-apps (or upload CSV at /custom-data)
Return to /dashboard, pick a date range, and click Fetch Data
Review results and open /history for past analysis runs

Example:
You connect your App Store app on Monday, set Gemini in Settings, then fetch the last 30 days of reviews on the Dashboard to get sentiment breakdowns and AI-written insights.
`,
  },
  {
    id: "ai-setup",
    title: "2. Configure Your AI (Settings)",
    content: `
Prysm uses a Bring Your Own Key (BYOK) model. Your LLM API key stays in your browser localStorage — it is not saved on Prysm servers. You must configure this before Fetch Data will work.

Go to /settings and complete these steps:

1. Select a provider tile at the top (Gemini, OpenAI, Claude, Groq, or Ollama for local use).
2. Choose a model version from the dropdown.
3. Paste your API key (cloud providers) or enter your Ollama URL (default http://localhost:11434).
4. Click Test Connection to verify the setup.
5. Click Save Config to store settings in your browser.

Where to get API keys:

Gemini (Google): https://aistudio.google.com/apikey
OpenAI: https://platform.openai.com/api-keys
Claude (Anthropic): https://console.anthropic.com/settings/keys
Groq: https://console.groq.com/keys
Ollama (local): No API key — install Ollama on your machine and run a model (e.g. ollama run llama3). Prysm must be able to reach your Ollama URL; local Ollama only works if you run Prysm locally, not from the Vercel deployment talking to your localhost.

Example:
Select Gemini, paste a key from Google AI Studio, pick gemini-2.5-flash, test the connection, then save.
`,
  },
  {
    id: "connect-sources",
    title: "3. Connect Data Sources",
    content: `
Go to /connect-apps to link feedback sources. Each connected app stores its status in your browser and syncs data when you run Fetch Data on the Dashboard.

App Store: Click Connect, search for your iOS app, and confirm. Reviews are scraped from the public App Store (up to 10 pages of recent reviews per fetch).

Play Store: Click Connect, enter your Android app ID, and connect. The dashboard Fetch Data button will pull the latest reviews automatically.

X (Twitter): Click Connect and enter the X account handle to track. Prysm uses public Nitter RSS feeds — only the most recent posts are available per scrape; older posts accumulate in the database over repeated fetches.

Gmail: Click Connect on the Gmail card to start Google OAuth. Complete sign-in with Google when prompted. Gmail data is stored in the database and included in analysis by date range.

Custom CSV: Go to /custom-data to upload a .csv file instead of or in addition to connected apps. See the CSV section below for required columns.
`,
  },
  {
    id: "custom-csv",
    title: "4. Upload Custom CSV Data",
    content: `
Go to /custom-data to drag and drop or browse for a .csv file.

Your file must include these columns (extra columns are ignored):

source: Where the feedback came from (e.g. support, survey, app)
date or timestamp: When the feedback was received
feedback or comment: The actual customer text

Only .csv files are accepted. After a successful upload, the rows are saved to your account and included the next time you Fetch Data on the Dashboard for a matching date range.

Example:
A file with columns source, date, feedback — one row per support ticket — can be uploaded alongside App Store reviews for a unified analysis.
`,
  },
  {
    id: "dashboard",
    title: "5. Dashboard — Fetch & Analyze",
    content: `
The Dashboard at /dashboard is where analysis happens.

1. Set the From and To dates (defaults to the last 30 days).
2. Click Fetch Data.

What Fetch Data does:
Runs scrapers for your connected App Store, Play Store, X, and Gmail sources (if connected)
Loads feedback already stored in MongoDB for all sources (including CSV custom uploads) within your date range
Sends batched feedback to your configured LLM using the API key from Settings
Returns AI summary, key insights, areas to improve, sentiment gauge, performance metrics, and source breakdown charts

The page updates with live results. Use the metric tabs under Performance Metrics to switch between satisfaction, response time, and volume views. Download PDF exports the current dashboard snapshot when data is loaded.

Important: Fetch Data automatically pulls new Gmail messages for connected accounts from the last 30 days.
`,
  },
  {
    id: "history",
    title: "6. Analysis History",
    content: `
Go to /history to see every completed analysis run saved to your account.

Each card shows:
The date range that was analyzed
When the run completed
Total feedback volume and satisfaction score
A sentiment bar (positive, negative, neutral)

Click a card to expand it and read the Key Insights and Areas to Improve captured for that session. History is useful for comparing runs week over week without re-fetching.
`,
  },
  {
    id: "account",
    title: "7. Account",
    content: `
Go to /account to update your profile name, email, and password. Changes apply to your Prysm login session.

Your LLM keys and connected-app preferences remain in browser localStorage (Settings and Connect Apps), not in the account profile fields.
`,
  },
  {
    id: "troubleshooting",
    title: "8. Troubleshooting",
    content: `
<table style="width:100%; border-collapse: collapse; margin-top: 1rem;">
  <thead>
    <tr style="background-color: #1f1f22; color: #ffffff; text-align: left;">
      <th style="padding: 10px; border: 1px solid #2c2c2e;">Problem</th>
      <th style="padding: 10px; border: 1px solid #2c2c2e;">What to try</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #2c2c2e;">Fetch Data fails or shows no insights</td>
      <td style="padding: 10px; border: 1px solid #2c2c2e;">Open /settings — confirm provider, model, and API key are saved. Run Test Connection first.</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #2c2c2e;">No feedback in the selected date range</td>
      <td style="padding: 10px; border: 1px solid #2c2c2e;">Connect apps or upload CSV first. Widen the From/To dates. For X, run Fetch Data regularly — Nitter only exposes recent posts per scrape.</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #2c2c2e;">Ollama connection fails on Vercel</td>
      <td style="padding: 10px; border: 1px solid #2c2c2e;">The deployed app cannot reach localhost on your PC. Use Gemini, OpenAI, Claude, or Groq with a cloud API key instead.</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #2c2c2e;">CSV upload rejected</td>
      <td style="padding: 10px; border: 1px solid #2c2c2e;">Use .csv only. Include source, date (or timestamp), and feedback (or comment) columns.</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #2c2c2e;">Settings lost after clearing browser data</td>
      <td style="padding: 10px; border: 1px solid #2c2c2e;">API keys live in localStorage. Re-enter them in /settings and save again.</td>
    </tr>
  </tbody>
</table>
`,
  },
];

export default documentationContent;
