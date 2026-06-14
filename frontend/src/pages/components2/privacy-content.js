const privacyContent = [
  {
    id: "information-collected",
    title: "1. Information Collected & Consent Notice (DPDP Act, 2023)",
    content: [
      "Prysm operates as a Data Fiduciary under the Digital Personal Data Protection (DPDP) Act, 2023. We collect and process personal data only for specific, lawful purposes with your explicit, unambiguous, and revocable consent, or where otherwise permitted under applicable law.",
      "We collect account registration details (such as your name, business email address, and designation), synchronized feedback datasets from your connected integrations (including Gmail, X/Twitter, Apple App Store, and Google Play Store), manual file uploads, and platform usage metrics.",
      "The collection of this data is necessary to perform sentiment analysis, topic extraction, and analytics visualizations."
    ]
  },

  {
    id: "use-of-information",
    title: "2. How We Use Information & Purpose Limitation",
    content: [
      "We process your data strictly to provide the Prysm analytics dashboard, generate strategic priority matrices, compile downloadable PDF summaries, and process AI-generated feedback insights.",
      "Feedback datasets and processed results are securely stored at our company database. We do not use your personal data for any purpose other than what has been explicitly consented to.",
      "When you initiate AI analysis, only the relevant feedback content is transmitted to the third-party language model provider you selected. Such transmission is governed by your own API configurations."
    ]
  },

  {
    id: "local-credentials",
    title: "3. Security of Local Credentials & BYOK Model",
    content: [
      "Under our Bring Your Own Key (BYOK) model, your API keys for Google Gemini, OpenAI, Anthropic, Groq, or other providers are stored locally in your browser's localStorage.",
      "These credentials are never stored permanently at our company database or servers.",
      "They are transmitted encrypted over HTTPS request headers for real-time API execution and discarded immediately. You remain responsible for maintaining the security of your local environment."
    ]
  },

  {
    id: "third-party-services",
    title: "4. Third-Party API Integrations & Data Sharing",
    content: [
      "Prysm links to external platforms to fetch feedback. We do not sell, rent, trade, or share your personal data with third parties for marketing or any other commercial purposes.",
      "Gmail data access complies strictly with Google API Services User Data Policies and is processed locally or stored at our company database solely for generating analytics reports as directed by you.",
      "All processing is bounded by the privacy policies of the connected platforms (e.g., Apple, Google, X)."
    ]
  },

  {
    id: "cookies-storage",
    title: "5. Cookies & Local Storage",
    content: [
      "We use essential cookies and browser local storage to maintain session states, selected UI preferences, and local BYOK credentials.",
      "You can clear your browser storage at any time, which will immediately remove all local configurations and API credentials."
    ]
  },

  {
    id: "data-rights-india",
    title: "6. Rights of Data Principals under DPDP Act, 2023",
    content: [
      "As a Data Principal under the DPDP Act, 2023, you have the following statutory rights:",
      "Right to Access: You may request a summary of your personal data being processed, the identities of all data fiduciaries with whom it has been shared, and details of processing.",
      "Right to Correction and Erasure: You have the right to correct inaccurate data, complete incomplete data, and request the deletion of your data when the purpose of collection has been completed or consent is withdrawn.",
      "Right to Withdraw Consent: You can withdraw your consent for data processing at any time. Upon receipt of withdrawal, we will cease processing your personal data, unless permitted or required under applicable laws.",
      "Right to Grievance Redressal: You can register a complaint or grievance with our Grievance Officer regarding any act or omission concerning your data rights.",
      "Right to Nominate: You have the right to nominate another individual to exercise your rights on your behalf in the event of your death or incapacity."
    ]
  },

  {
    id: "grievance-redressal",
    title: "7. Grievance Officer & Redressal Mechanism",
    content: [
      "If you have any questions, concerns, or wish to exercise your rights as a Data Principal under the DPDP Act, please contact our designated Grievance Officer:",
      "We will acknowledge your request within 24 hours and resolve your grievance in accordance with the timelines established under the DPDP Act, 2023. If you are unsatisfied with our resolution, you have the right to escalate your complaint to the Data Protection Board of India (DPBI)."
    ]
  },

  {
    id: "language-notice",
    title: "8. Language of Notice & Accessibility",
    content: [
      "In accordance with Section 5(3) of the DPDP Act, 2023, you have the right to access this privacy notice and consent request in English or in any of the 22 languages specified in the Eighth Schedule to the Constitution of India.",
      "To request a copy of this notice translated into an official regional language, please contact our Grievance Officer."
    ]
  }
];

export default privacyContent;