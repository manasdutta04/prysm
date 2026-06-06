# 2. Technology Stack & Database Schemas

Prysm is built on a React, Express.js, and MongoDB stack.

---

## 1. Technical Architecture

* **Frontend Framework**: React.js configured with Vite.
* **Backend Framework**: Node.js and Express.js.
* **Database Access**: MongoDB Atlas queried via Mongoose.
* **Zustand Store**: Session JWT storage and profile updates handled client-side inside [useAuthStore.js](file:///c:/Coding%20Workspace/prysm/frontend/src/store/useAuthStore.js).
* **Charts & Icons**: Lucide Icons and `@mui/x-charts` for dashboard comparison trends.

---

## 2. Directory Layout Reference

```text
prysm/
├── .agent/               # AI Agent documentation files
├── frontend/             # Vite React client
│   ├── src/
│   │   ├── components/   # Modals (x-connect, app-sidebar, auth-modal)
│   │   ├── pages/        # Dashboard, Connect-Apps, Custom-Data, History
│   │   ├── store/        # Zustand stores
│   │   └── lib/          # axios.js instance pointing to backend
├── backend/              # Express API server
│   ├── src/
│   │   ├── controllers/  # auth, customData, google, appstore, dashboard controllers
│   │   ├── routes/       # API routes
│   │   ├── lib/          # db, xScraper, appStoreScraper utilities
│   │   └── models/       # Mongoose Schemas (feedback, user, analysisHistory)
└── agents.md             # High-level entry index pointing here
```

---

## 3. Database Schema Reference

### A. Feedback Schema
Defines the structure for all normalized customer comments.
* **Location**: [feedback.model.js](file:///c:/Coding%20Workspace/prysm/backend/src/models/raw%20feedbacks/feedback.model.js)
* **Fields**:
  * `userId`: Reference to the `User` owner.
  * `source`: Enum string (`gmail`, `x`, `playstore`, `appstore`, `custom`).
  * `externalId`: Unique ID representing the review ID, email ID, or tweet ID to prevent duplicate imports.
  * `content`: The raw feedback text.
  * `metadata`: Mixed JSON object storing ratings, user handles, subject lines, or link URLs.
  * `timestamp`: Creation date of the feedback comment.

### B. User Schema
Manages user authentication and Google token access.
* **Location**: [user.model.js](file:///c:/Coding%20Workspace/prysm/backend/src/models/users/user.model.js)
* **Fields**:
  * `email`, `fullName`, `password` (hashed with bcrypt).
  * `gmail`: Object containing `accessToken`, `refreshToken`, and `tokenExpiry` dates.

### C. Analysis History Schema
Saves the results of analysis runs for the History view.
* **Location**: [analysisHistory.model.js](file:///c:/Coding%20Workspace/prysm/backend/src/models/analysis/analysisHistory.model.js)
* **Fields**:
  * `userId`: Reference to `User` owner.
  * `startDate` & `endDate`: Timeframe queried.
  * `timestamp`: Time of analysis execution.
  * `totalFeedback`: Feedbacks volume analyzed.
  * `positiveSentiment`, `negativeSentiment`, `neutralSentiment`: Percentage integers.
  * `keyInsights`: Array of generated string summaries.
  * `improvements`: Array of action item strings.
  * `satisfactionScore`: Dynamic score from 0.0 to 5.0.

### D. Teammate Schema (Preserve)
* **Location**: [gmailUser.model.js](file:///c:/Coding%20Workspace/prysm/backend/src/models/users/gmailUser.model.js)
* Used by another teammate for separate operations. Do NOT modify or delete.

---

## 4. Bring Your Own Key (BYOK) Backend Integrations

The backend dynamically maps user-provided API credentials from headers to individual model classes in LangChain.js.

### A. Core AI Dependencies
The Node.js server uses the following LangChain adapter modules:
* `@langchain/openai` for GPT family models.
* `@langchain/google-genai` for Gemini family models.
* `@langchain/anthropic` for Claude family models.

### B. Dynamic Model Factory Pattern
The backend router dynamically instantiates the LLM engine per request using the client request headers:
```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const provider = req.headers["x-llm-provider"];
const apiKey = req.headers["x-llm-key"];

let modelInstance;
if (provider === "gemini") {
  modelInstance = new ChatGoogleGenerativeAI({ apiKey, model: "gemini-1.5-flash" });
} else if (provider === "openai") {
  modelInstance = new ChatOpenAI({ openAIApiKey: apiKey, modelName: "gpt-4o" });
}
```
This instance is then fed the prompt template to return structured output matching the `AnalysisHistory` schema.
