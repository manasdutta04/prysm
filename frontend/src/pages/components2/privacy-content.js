const privacyContent = [
  {
    id: "information-collected",
    title: "1. Information Collected",
    content: [
      "Prysm collects information necessary to provide customer feedback analytics and reporting services.",
      "This information may include account registration details such as name and email address, synchronized feedback data from connected services, uploaded datasets, analysis history, and platform usage information.",
      "Feedback data may originate from connected integrations including Gmail, X (Twitter), Apple App Store, Google Play Store, and manually uploaded files."
    ]
  },

  {
    id: "use-of-information",
    title: "2. How We Use Information",
    content: [
      "Prysm uses collected information to provide sentiment analysis, topic clustering, trend detection, dashboard visualizations, reporting, and AI-generated insights.",
      "Feedback data may be processed and stored within MongoDB-backed infrastructure to support historical reporting, analytics generation, and user-requested processing.",
      "When AI analysis is requested, feedback content may be transmitted to the language model provider selected by the user for inference and response generation."
    ]
  },

  {
    id: "local-credentials",
    title: "3. Security of Local Credentials",
    content: [
      "Prysm follows a Bring Your Own Key (BYOK) architecture.",
      "API credentials for supported providers including Google Gemini, OpenAI, Anthropic Claude, Groq, and compatible AI services are stored locally in the user's browser using localStorage.",
      "These credentials are not permanently stored on Prysm servers.",
      "When required for execution, API credentials may be transmitted securely through HTTPS request headers and are discarded immediately after request completion.",
      "Users remain responsible for securing their devices, browsers, and local storage environments."
    ]
  },

  {
    id: "third-party-services",
    title: "4. Third-Party API Services",
    content: [
      "Prysm integrates with third-party services including Gmail, X (Twitter), Apple App Store, Google Play Store, and AI model providers.",
      "When users connect external services, Prysm may access and process feedback data made available through those integrations.",
      "Prysm does not sell, distribute, rent, or transfer Gmail data to third parties.",
      "Gmail data is accessed solely for providing feedback analysis functionality and is handled in accordance with the Google API Services User Data Policy.",
      "Users are also subject to the privacy policies and terms of any third-party platforms they choose to connect."
    ]
  },

  {
    id: "cookies-storage",
    title: "5. Cookies & Local Storage",
    content: [
      "Prysm may use browser storage technologies, including localStorage, to improve user experience and maintain configuration settings.",
      "Locally stored information may include selected AI providers, model preferences, connected application states, interface preferences, and BYOK API credentials.",
      "Users may clear browser storage at any time through their browser settings, though doing so may remove saved configurations."
    ]
  },

  {
    id: "contact",
    title: "6. Contact Information",
    content: [
      "Questions, concerns, or requests regarding this Privacy Policy may be directed to the Prysm support team.",
      "Users may contact the organization through the Help & Support section of the platform or through officially published support channels.",
      "We will make reasonable efforts to respond to privacy-related inquiries in a timely manner."
    ]
  }
];

export default privacyContent;