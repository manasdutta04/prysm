const documentationContent = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: `
Prysm is an AI-driven system designed to automatically collect, analyze, and interpret customer feedback from multiple digital sources such as emails, support tickets, app reviews, and social media platforms. The system transforms unstructured feedback data into meaningful insights that help businesses understand customer sentiment, detect emerging issues, and make informed product or service improvements.

Conventional feedback analysis often involves manual reading and categorization of customer responses, which is time-consuming and prone to bias. Prysm addresses this challenge by leveraging Artificial Intelligence (AI) and Natural Language Processing (NLP) to automate feedback processing, clustering, and sentiment evaluation. The platform provides real-time analytics, enabling organizations to respond quickly to customer concerns and maintain a positive brand reputation.
`,
  },
  {
    id: "system-overview",
    title: "2. System Overview",
    content: `
Prysm functions as a web-based analytical dashboard that integrates modern AI and data visualization technologies. It consolidates feedback from multiple communication channels, processes it using NLP models, and presents summarized insights through an interactive dashboard.

The system follows a structured workflow comprising the following stages:

Data Ingestion: Collects feedback from multiple integrated sources such as Gmail, Slack, Twitter, and App Store reviews.

Preprocessing: Cleans and normalizes text, removing noise such as emojis, URLs, and duplicate entries.

AI Processing: Performs sentiment analysis, topic clustering, and summarization using OpenAI or HuggingFace APIs.

Trend Detection: Tracks changes in feedback patterns over time to identify rising or declining customer issues.

Visualization: Displays analyzed data through real-time charts, graphs, and AI-generated summaries.

Alert Generation: Notifies teams when critical trends or issues emerge, allowing timely action.

Through this pipeline, Prysm provides clear and actionable intelligence across departments, improving both efficiency and decision-making.
`,
  },
  {
    id: "system-requirements",
    title: "3. System Requirements",
    content: `
Hardware Requirements

Processor: Intel Core i3 or higher
RAM: Minimum 4 GB
Storage: 2 GB of free disk space
Internet: Required for data fetching and API communication

Software Requirements

Frontend: React.js or Next.js
Styling: Tailwind CSS
Backend: Node.js with Express.js
Database: MongoDB Atlas
Cache: Redis
AI APIs: OpenAI API or HuggingFace Transformers
Browser: Latest version of Google Chrome, Edge, or Firefox
Deployment: Vercel, Render, or AWS Lambda
`,
  },
  {
    id: "getting-started",
    title: "4. Getting Started",
    content: `
4.1 User Registration

Launch the Prysm web application.
Click on “Register” to create a new account.
Enter required details such as name, email, password, and department.
Verify the email address through the verification link sent to your inbox.
Once confirmed, log in using your credentials.

4.2 Login Procedure

Navigate to the Login page.
Enter your registered email ID and password.
Upon successful authentication, you will be redirected to the main dashboard.

4.3 Navigation Overview

After logging in, users can access all major features through the left-hand navigation panel. The navigation menu includes the following options:

Dashboard:
Displays real-time analytics, sentiment summaries, trending topics, and AI-generated insights.

Connect Apps:
Integrates Prysm with third-party platforms such as Gmail, Slack, Twitter (X), Facebook, Google Play, and the App Store.

Custom Data:
Allows users to upload manual feedback files in CSV or Excel format.

History:
Provides a chronological record of processed feedback sessions and alerts.

Help & Support:
Offers access to FAQs, troubleshooting guides, and support contact details.

Documentation:
Contains system architecture, AI workflow, API integrations, and feature explanations.
`,
  },
  {
    id: "functional-modules",
    title: "5. Functional Modules",
    content: `
5.1 Feedback Ingestion

Users can connect multiple feedback sources through the Connect Apps module. Supported platforms include Gmail, Slack, Twitter, Facebook, and app store APIs.

5.2 Data Preprocessing

Cleans and standardizes feedback text by removing unwanted symbols, links, emojis, and redundant spaces. Duplicate entries are filtered to ensure unique records. Non-English text is automatically translated into English.

5.3 Sentiment Analysis

Classifies feedback into Positive, Negative, and Neutral categories. Sentiment scores are displayed through charts to visualize customer mood distributions.

5.4 Topic Clustering

Feedback is converted into semantic embeddings using AI models. K-means or DBSCAN algorithms group similar comments into topics such as payment issues or feature requests.

5.5 Insight Generation

GPT-based summarization produces concise reports that highlight major issues or requests.

Example:
“This week, 35% of feedback mentioned login difficulties following the latest app update.”

5.6 Trend Detection

Compares topic frequencies and sentiment changes week-over-week to identify emerging issues or improvements.

5.7 Real-Time Alerts

If a spike in negative feedback occurs, Prysm sends alerts through Slack or email.

Example:
“Negative feedback on payment processing increased by 150% in the last 24 hours.”

5.8 Reporting

Generates automated reports filtered by sentiment, time period, or source. Exportable in PDF or Excel format.
`,
  },
  {
    id: "dashboard-overview",
    title: "6. Dashboard Overview",
    content: `
The dashboard is the main analytical hub of Prysm, providing real-time visualization of AI-processed feedback data.

Key components include:

Sentiment Overview: Displays positive, negative, and neutral feedback proportions.
Trending Topics: Lists the most frequently discussed themes detected by AI.
Source Distribution: Shows the share of feedback from each integrated source.
Trend Graphs: Illustrate weekly or monthly changes in sentiment.
Insight Panel: Provides AI-generated summaries.
Live Feed Section: Updates continuously when new data arrives.
`,
  },
  {
    id: "notifications-alerts",
    title: "7. Notifications and Alerts",
    content: `
Ensures all critical feedback trends are communicated promptly.

Slack Alerts: Integrated via Slack API to deliver messages directly to channels.
Email Alerts: Sent automatically through Gmail or Microsoft Graph APIs.
Custom Thresholds: Admins can set trigger limits, e.g., alert when negative feedback exceeds 100 mentions per day.
These notifications improve response speed and customer satisfaction.
`,
  },
  {
    id: "user-roles",
    title: "8. User Roles and Permissions",
    content: `
Prysm uses Role-Based Access Control (RBAC) with defined permissions:

Administrator — Manages users, integrations, and settings. (Full Access)
Product Manager — Views dashboards, reports, and insights. (Moderate Access)
Support Team Member — Reviews customer issues and complaint clusters. (Limited Access)

Authentication is secured with JWT (JSON Web Tokens) ensuring encrypted sessions.
`,
  },
  {
    id: "troubleshooting",
    title: "9. Troubleshooting",
    content: `
<table style="width:100%; border-collapse: collapse; margin-top: 1rem;">
  <thead>
    <tr style="background-color: #1f1f22; color: #ffffff; text-align: left;">
      <th style="padding: 10px; border: 1px solid #2c2c2e;">Problem</th>
      <th style="padding: 10px; border: 1px solid #2c2c2e;">Possible Cause</th>
      <th style="padding: 10px; border: 1px solid #2c2c2e;">Solution</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #2c2c2e;">Feedback not appearing on the dashboard</td>
      <td style="padding: 10px; border: 1px solid #2c2c2e;">API integration failure</td>
      <td style="padding: 10px; border: 1px solid #2c2c2e;">Reconnect data source under Connect Apps</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #2c2c2e;">Alerts not received</td>
      <td style="padding: 10px; border: 1px solid #2c2c2e;">Notification settings misconfigured</td>
      <td style="padding: 10px; border: 1px solid #2c2c2e;">Verify Slack or email configurations</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #2c2c2e;">Login unsuccessful</td>
      <td style="padding: 10px; border: 1px solid #2c2c2e;">Incorrect credentials</td>
      <td style="padding: 10px; border: 1px solid #2c2c2e;">Reset password or contact administrator</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #2c2c2e;">Slow dashboard loading</td>
      <td style="padding: 10px; border: 1px solid #2c2c2e;">High data volume or weak internet</td>
      <td style="padding: 10px; border: 1px solid #2c2c2e;">Refresh page or retry with stable connection</td>
    </tr>
  </tbody>
</table>
`,
  },
  {
    id: "conclusion",
    title: "10. Conclusion",
    content: `
Prysm: AI-Driven Customer Feedback Analyzer provides an automated, intelligent approach to understanding and managing customer sentiments. By combining AI, NLP, and real-time visualization, it transforms raw feedback into actionable intelligence.

Its ability to detect trends, pinpoint issues, and generate insights empowers organizations to respond faster and enhance customer experiences.

Prysm represents a major step forward in feedback management—bridging the gap between data collection and actionable improvement strategies.
`,
  },
];

export default documentationContent;
