# Prysm - AI-Driven Customer Feedback Analyzer

## Overview

Prysm is an AI-driven system designed to automatically collect, analyze, and interpret customer feedback from multiple digital sources such as emails, support tickets, app reviews, and social media platforms. The system transforms unstructured feedback data into meaningful insights that help businesses understand customer sentiment, detect emerging issues, and make informed product or service improvements.

Conventional feedback analysis often involves manual reading and categorization of customer responses, which is time-consuming and prone to bias. Prysm addresses this challenge by leveraging Artificial Intelligence (AI) and Natural Language Processing (NLP) to automate feedback processing, clustering, and sentiment evaluation. The platform provides real-time analytics, enabling organizations to respond quickly to customer concerns and maintain a positive brand reputation.

## Features

- AI-driven sentiment analysis & trend detection
- "Emerging issues" alerts before they blow up
- Department-specific reports (Support, Product, Marketing)
- Slack & email notifications
- Unique Angle: Goes beyond sentiment → actually tells teams what to fix
- Target Users: Product managers, Large organisations, customer success teams

## System Overview

Prysm functions as a web-based analytical dashboard that integrates modern AI and data visualization technologies. It consolidates feedback from multiple communication channels, processes it using NLP models, and presents summarized insights through an interactive dashboard.

The system follows a structured workflow comprising the following stages:

1. **Data Ingestion**: Collects feedback from multiple integrated sources such as Gmail, Slack, Twitter, and App Store reviews.
2. **Preprocessing**: Cleans and normalizes text, removing noise such as emojis, URLs, and duplicate entries.
3. **AI Processing**: Performs sentiment analysis, topic clustering, and summarization using OpenAI or HuggingFace APIs.
4. **Trend Detection**: Tracks changes in feedback patterns over time to identify rising or declining customer issues.
5. **Visualization**: Displays analyzed data through real-time charts, graphs, and AI-generated summaries.
6. **Alert Generation**: Notifies teams when critical trends or issues emerge, allowing timely action.

Through this pipeline, Prysm provides clear and actionable intelligence across departments, improving both efficiency and decision-making.



## Getting Started

### User Registration

1. Launch the Prysm web application.
2. Click on "Register" to create a new account.
3. Enter required details such as name, email, password, and department.
4. Verify the email address through the verification link sent to your inbox.
5. Once confirmed, log in using your credentials.

### Login Procedure

1. Navigate to the Login page.
2. Enter your registered email ID and password.
3. Upon successful authentication, you will be redirected to the main dashboard.

### Navigation Overview

After logging in, users can access all major features through the left-hand navigation panel. The navigation menu includes the following options:

- **Dashboard**: Displays real-time analytics, sentiment summaries, trending topics, and AI-generated insights.
- **Connect Apps**: Integrates Prysm with third-party platforms such as Gmail, Slack, Twitter (X), Facebook, Google Play, and the App Store.
- **Custom Data**: Allows users to upload manual feedback files in CSV or Excel format.
- **History**: Provides a chronological record of processed feedback sessions and alerts.
- **Help & Support**: Offers access to FAQs, troubleshooting guides, and support contact details.
- **Documentation**: Contains system architecture, AI workflow, API integrations, and feature explanations.

## Functional Modules

### 5.1 Feedback Ingestion

Users can connect multiple feedback sources through the Connect Apps module. Supported platforms include Gmail, Slack, Twitter, Facebook, and app store APIs.

### 5.2 Data Preprocessing

Cleans and standardizes feedback text by removing unwanted symbols, links, emojis, and redundant spaces. Duplicate entries are filtered to ensure unique records. Non-English text is automatically translated into English.

### 5.3 Sentiment Analysis

Classifies feedback into Positive, Negative, and Neutral categories. Sentiment scores are displayed through charts to visualize customer mood distributions.

### 5.4 Topic Clustering

Feedback is converted into semantic embeddings using AI models. K-means or DBSCAN algorithms group similar comments into topics such as payment issues or feature requests.

### 5.5 Insight Generation

GPT-based summarization produces concise reports that highlight major issues or requests.

**Example**: "This week, 35% of feedback mentioned login difficulties following the latest app update."

### 5.6 Trend Detection

Compares topic frequencies and sentiment changes week-over-week to identify emerging issues or improvements.

### 5.7 Real-Time Alerts

If a spike in negative feedback occurs, Prysm sends alerts through Slack or email.

**Example**: "Negative feedback on payment processing increased by 150% in the last 24 hours."

### 5.8 Reporting

Generates automated reports filtered by sentiment, time period, or source. Exportable in PDF or Excel format.

## Dashboard Overview

The dashboard is the main analytical hub of Prysm, providing real-time visualization of AI-processed feedback data.

Key components include:

- **Sentiment Overview**: Displays positive, negative, and neutral feedback proportions.
- **Trending Topics**: Lists the most frequently discussed themes detected by AI.
- **Source Distribution**: Shows the share of feedback from each integrated source.
- **Trend Graphs**: Illustrate weekly or monthly changes in sentiment.
- **Insight Panel**: Provides AI-generated summaries.
- **Live Feed Section**: Updates continuously when new data arrives.

## Notifications and Alerts

Ensures all critical feedback trends are communicated promptly.

- **Slack Alerts**: Integrated via Slack API to deliver messages directly to channels.
- **Email Alerts**: Sent automatically through Gmail or Microsoft Graph APIs.
- **Custom Thresholds**: Admins can set trigger limits, e.g., alert when negative feedback exceeds 100 mentions per day.

These notifications improve response speed and customer satisfaction.

## User Roles and Permissions

Prysm uses Role-Based Access Control (RBAC) with defined permissions:

- **Administrator** — Manages users, integrations, and settings. (Full Access)
- **Product Manager** — Views dashboards, reports, and insights. (Moderate Access)
- **Support Team Member** — Reviews customer issues and complaint clusters. (Limited Access)
