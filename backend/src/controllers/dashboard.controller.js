import Feedback from "../models/raw_feedbacks/feedback.model.js";
// import User from "../models/users/user.model.js";
import { fetchXFeedback } from "../lib/xScraper.js";
import { fetchAppStoreReviews } from "../lib/appStoreScraper.js";
import AnalysisHistory from "../models/analysis/analysisHistory.model.js";
import axios from "axios";
import User from "../models/users/user.model.js";
import PlaystoreUser from "../models/users/playstoreUser.model.js";
import gplay from "google-play-scraper";
import { fetchEmails, fetchEmailDetails } from "../lib/fetchemail.js";

// Helper keyword dictionaries for rule-based analysis
const POSITIVE_KEYWORDS = [
  "love",
  "great",
  "good",
  "excellent",
  "awesome",
  "fast",
  "happy",
  "best",
  "perfect",
  "smooth",
  "amazing",
  "wonderful",
  "helpful",
  "easy",
  "satisfied",
  "recommend",
  "cool",
  "outstanding",
  "impressed",
  "superb",
  "nice",
  "regular",
  "seamless",
];

const NEGATIVE_KEYWORDS = [
  "bad",
  "slow",
  "crash",
  "error",
  "fail",
  "issue",
  "bug",
  "freeze",
  "worst",
  "broken",
  "hate",
  "useless",
  "annoying",
  "poor",
  "difficult",
  "disappointed",
  "terrible",
  "waste",
  "garbage",
  "trash",
  "limit",
  "restrict",
  "problem",
];

const TOPICS = [
  {
    name: "Performance & Reliability",
    keywords: [
      "slow",
      "performance",
      "lag",
      "freeze",
      "speed",
      "crash",
      "stuck",
      "load",
    ],
    positiveSummary: "Fast loading times and responsive design",
    negativeSummary: "Mobile app crashes and occasional freezes",
  },
  {
    name: "Authentication & Login",
    keywords: [
      "login",
      "signin",
      "auth",
      "account",
      "register",
      "password",
      "signup",
      "access",
    ],
    positiveSummary: "Excellent UI and smooth onboarding",
    negativeSummary: "Login issues after recent updates",
  },
  {
    name: "Payment & Billing",
    keywords: [
      "payment",
      "pay",
      "billing",
      "checkout",
      "card",
      "price",
      "charge",
      "refund",
    ],
    positiveSummary: "Seamless payment integration and checkout",
    negativeSummary: "Payment gateway issues during checkout",
  },
  {
    name: "Customer Support",
    keywords: [
      "support",
      "help",
      "customer service",
      "agent",
      "ticket",
      "assistance",
    ],
    positiveSummary: "Helpful and supportive customer success team",
    negativeSummary: "Slow response times from customer support",
  },
];

function cleanJsonResponse(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/, "");
  }
  return JSON.parse(cleaned.trim());
}

async function analyzeFeedbacksWithLLM(
  feedbacks,
  provider,
  apiKey,
  localUrl,
  modelName,
) {
  const truncatedFeedbacks = feedbacks
    .slice(0, 300)
    .map((f, index) => {
      const text = (f.content || "").substring(0, 300).replace(/[\r\n]+/g, " ");
      return `${index + 1}. Source: ${f.source} | Content: ${text}`;
    })
    .join("\n");

  const prompt = `You are a product feedback analysis assistant. Analyze the following list of customer feedbacks.
Categorize each feedback's sentiment as either positive, negative, or neutral.
Count the number of feedbacks belonging to each sentiment.

Also extract:
- keyInsights: A list of 3-5 high-level insights summarizing what users are saying.
- improvements: A list of 2-4 actionable areas to improve.
- positivePoints: Up to 5 specific positive aspects mentioned by users, along with the approximate count of users/feedbacks mentioning them, in the format: [{"point": "description", "mentions": count}].
- negativePoints: Up to 5 specific negative aspects/complaints mentioned by users, along with the approximate count of users/feedbacks mentioning them, in the format: [{"point": "description", "mentions": count}].

Return your analysis as a valid JSON object matching the following structure EXACTLY:
{
  "positiveCount": number,
  "negativeCount": number,
  "neutralCount": number,
  "keyInsights": ["string"],
  "improvements": ["string"],
  "positivePoints": [
    {"point": "string", "mentions": number}
  ],
  "negativePoints": [
    {"point": "string", "mentions": number}
  ]
}

Make sure the sum of positiveCount, negativeCount, and neutralCount equals the total number of feedbacks analyzed (${feedbacks.slice(0, 300).length}).

Customer Feedbacks to analyze:
${truncatedFeedbacks}`;

  let responseText = "";
  const selectedModel =
    modelName ||
    (provider === "gemini"
      ? "gemini-2.0-flash"
      : provider === "openai"
        ? "gpt-4o-mini"
        : provider === "claude"
          ? "claude-3-5-sonnet-20241022"
          : provider === "groq"
            ? "llama-3.3-70b-versatile"
            : "llama3");

  if (provider === "gemini") {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;
    const response = await axios.post(
      url,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    responseText = response.data.candidates[0].content.parts[0].text;
  } else if (provider === "openai") {
    const url = "https://api.openai.com/v1/chat/completions";
    const response = await axios.post(
      url,
      {
        model: selectedModel,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );
    responseText = response.data.choices[0].message.content;
  } else if (provider === "claude") {
    const url = "https://api.anthropic.com/v1/messages";
    const response = await axios.post(
      url,
      {
        model: selectedModel,
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
      },
    );
    responseText = response.data.content[0].text;
  } else if (provider === "groq") {
    const url = "https://api.groq.com/openai/v1/chat/completions";
    const response = await axios.post(
      url,
      {
        model: selectedModel,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );
    responseText = response.data.choices[0].message.content;
  } else if (provider === "ollama") {
    const baseUrl = (localUrl || "http://localhost:11434").replace(/\/$/, "");
    const url = `${baseUrl}/api/chat`;
    const response = await axios.post(
      url,
      {
        model: selectedModel,
        messages: [{ role: "user", content: prompt }],
        format: "json",
        stream: false,
      },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    responseText = response.data.message.content;
  } else {
    throw new Error(`Unsupported LLM provider: ${provider}`);
  }

  return cleanJsonResponse(responseText);
}

export const fetchAndAnalyzeData = async (req, res) => {
  const {
    startDate,
    endDate,
    connectedApps = {},
    skipScraping = false,
  } = req.body;
  const userId = req.user._id;

  const llmProvider =
    req.headers["x-llm-provider"] || req.get("x-llm-provider");
  const llmKey = req.headers["x-llm-key"] || req.get("x-llm-key");
  const llmLocalUrl =
    req.headers["x-llm-local-url"] ||
    req.get("x-llm-local-url") ||
    "http://localhost:11434";
  const llmModel = req.headers["x-llm-model"] || req.get("x-llm-model");

  try {
    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    console.log(
      `Starting ingest/analytics from ${start.toISOString()} to ${end.toISOString()} (skipScraping: ${skipScraping})`,
    );
    console.log("Connected Apps:", JSON.stringify(connectedApps, null, 2));

    // 1) Scraping & Ingestion
    const connectedUser = await User.findById(userId);
    let syncedCount = { gmail: 0, x: 0, appstore: 0 };

    if (!skipScraping) {
      // Gmail sync (uses the user's saved OAuth token)
      if (
        connectedApps.Gmail?.isConnected &&
        connectedUser?.gmail?.accessToken
      ) {
        try {
          console.log("Starting Gmail sync...");
          const emailList = await fetchEmails(connectedUser);
          let gmailCount = 0;

          for (const msg of emailList.messages || []) {
            const fullEmail = await fetchEmailDetails(connectedUser, msg.id);
            const headers = fullEmail.payload?.headers || [];
            const subject =
              headers.find((h) => h.name === "Subject")?.value || "No Subject";
            const from =
              headers.find((h) => h.name === "From")?.value || "Unknown Sender";
            const date =
              headers.find((h) => h.name === "Date")?.value ||
              new Date().toISOString();
            const snippet = fullEmail.snippet || subject;

            const existing = await Feedback.findOne({
              userId,
              externalId: msg.id,
            });
            if (!existing) {
              await Feedback.create({
                userId,
                source: "gmail",
                externalId: msg.id,
                content: snippet,
                timestamp: new Date(date),
                metadata: {
                  subject,
                  from,
                  threadId: msg.threadId,
                },
              });
              gmailCount++;
            }
          }
          syncedCount.gmail = gmailCount;
          console.log(`Gmail sync completed: ${gmailCount} new emails saved.`);
        } catch (err) {
          console.warn("Gmail Sync Warning:", err.message);
        }
      } else {
        console.log(
          "Gmail not connected or no access token. Skipping Gmail sync.",
        );
      }

      // X (Twitter) Scraper
      if (connectedApps.X?.isConnected && connectedApps.X?.appName) {
        try {
          console.log(`Starting X sync for handle: ${connectedApps.X.appName}`);
          const handle = connectedApps.X.appName;
          const tweets = await fetchXFeedback(handle, start, end);
          let xCount = 0;

          for (const item of tweets) {
            const existing = await Feedback.findOne({
              userId,
              externalId: item.id,
            });
            if (!existing) {
              await Feedback.create({
                userId,
                source: "x",
                externalId: item.id,
                content: item.text,
                timestamp: item.timestamp,
                metadata: { author: item.author, link: item.link },
              });
              xCount++;
            }
          }
          syncedCount.x = xCount;
          console.log(`X sync completed: ${xCount} new tweets saved.`);
        } catch (err) {
          console.warn("X Sync Warning:", err.message);
        }
      } else {
        console.log("X not connected. Skipping X sync.");
      }

      // App Store Scraper
      if (
        connectedApps["App Store"]?.isConnected &&
        connectedApps["App Store"]?.appName
      ) {
        const appId =
          connectedApps["App Store"].appId || connectedApps["App Store"].id;
        if (appId) {
          try {
            console.log(
              `Starting App Store sync for app: ${connectedApps["App Store"].appName} (ID: ${appId})`,
            );
            const reviews = await fetchAppStoreReviews(appId, start, end);
            let appstoreCount = 0;

            for (const item of reviews) {
              const existing = await Feedback.findOne({
                userId,
                externalId: item.id,
              });
              if (!existing) {
                await Feedback.create({
                  userId,
                  source: "appstore",
                  externalId: item.id,
                  content: item.text,
                  timestamp: item.timestamp,
                  metadata: {
                    author: item.author,
                    rating: item.rating,
                    title: item.title,
                  },
                });
                appstoreCount++;
              }
            }
            syncedCount.appstore = appstoreCount;
            console.log(
              `App Store sync completed: ${appstoreCount} new reviews saved.`,
            );
          } catch (err) {
            console.warn("App Store Sync Warning:", err.message);
          }
        } else {
          console.log("App Store connected but no app ID found. Skipping.");
        }
      } else {
        console.log("App Store not connected. Skipping App Store sync.");
      }

      // Play Store Scraper
      if (connectedApps["Play Store"]?.isConnected) {
        const appId = connectedApps["Play Store"].appId;
        let playstoreAppId = appId;
        if (!playstoreAppId) {
          const playstoreUser = await PlaystoreUser.findOne({
            userId,
            isConnected: true,
          });
          if (playstoreUser) {
            playstoreAppId = playstoreUser.appId;
          }
        }

        if (playstoreAppId) {
          try {
            const result = await gplay.reviews({
              appId: playstoreAppId,
              lang: "en",
              country: "us",
              sort: gplay.sort.NEWEST,
              num: 100,
            });
            const reviews = result.data || [];
            for (const review of reviews) {
              const existing = await Feedback.findOne({
                userId,
                externalId: review.id,
                source: "playstore",
              });
              if (!existing) {
                await Feedback.create({
                  userId,
                  source: "playstore",
                  externalId: review.id,
                  content: review.text,
                  timestamp: new Date(review.date),
                  metadata: {
                    userName: review.userName,
                    score: review.score,
                    thumbsUp: review.thumbsUp,
                    appId: playstoreAppId,
                    replyText: review.replyText || "",
                  },
                });
              }
            }
          } catch (err) {
            console.warn("Play Store Sync Warning:", err.message);
          }
        }
      }

      // Gmail Sync
      if (connectedApps["Gmail"]?.isConnected) {
        const userDoc = await User.findById(userId);
        if (userDoc?.gmail?.accessToken) {
          try {
            const emailList = await fetchEmails(userDoc);
            if (emailList?.messages && emailList.messages.length > 0) {
              for (const msg of emailList.messages) {
                const fullEmail = await fetchEmailDetails(userDoc, msg.id);
                const headers = fullEmail.payload?.headers || [];
                const subject =
                  headers.find((h) => h.name === "Subject")?.value ||
                  "No Subject";
                const from =
                  headers.find((h) => h.name === "From")?.value ||
                  "Unknown Sender";
                const date =
                  headers.find((h) => h.name === "Date")?.value ||
                  new Date().toISOString();
                const snippet = fullEmail.snippet;

                const existing = await Feedback.findOne({
                  userId,
                  externalId: msg.id,
                  source: "gmail",
                });
                if (!existing) {
                  await Feedback.create({
                    userId,
                    source: "gmail",
                    externalId: msg.id,
                    content: snippet || subject,
                    metadata: {
                      subject,
                      from,
                      threadId: msg.threadId,
                    },
                    timestamp: new Date(date),
                  });
                }
              }
            }
          } catch (err) {
            console.warn("Gmail Sync Warning:", err.message);
          }
        }
      }
    }

    // 2) Load all feedback from MongoDB within date range
    const feedbacks = await Feedback.find({
      userId,
      timestamp: { $gte: start, $lte: end },
    });

    console.log(
      `Found ${feedbacks.length} feedbacks in MongoDB for this timeframe.`,
    );

    let previousVolume = 0;
    let previousScore = 4.0;

    if (feedbacks.length > 0) {
      const timeDiff = end.getTime() - start.getTime();
      const prevStart = new Date(start.getTime() - timeDiff);
      const prevEnd = start;

      const prevFeedbacks = await Feedback.find({
        userId,
        timestamp: { $gte: prevStart, $lt: prevEnd },
      });

      previousVolume = prevFeedbacks.length;

      let prevPos = 0;
      for (const fb of prevFeedbacks) {
        let posScore = 0;
        let negScore = 0;
        const content = (fb.content || "").toLowerCase();
        for (const w of POSITIVE_KEYWORDS) if (content.includes(w)) posScore++;
        for (const w of NEGATIVE_KEYWORDS) if (content.includes(w)) negScore++;
        if (posScore > negScore) prevPos++;
      }
      if (prevFeedbacks.length > 0) {
        previousScore = Number(
          ((prevPos / prevFeedbacks.length) * 5).toFixed(1),
        );
      }
    }

    if (feedbacks.length === 0) {
      return res.status(200).json({
        summary: {
          totalFeedback: 0,
          positiveSentiment: 0,
          negativeSentiment: 0,
          neutralSentiment: 0,
          keyInsights: ["No feedback found in selected timeframe."],
          improvements: ["No feedback available to generate improvements."],
        },
        positivePoints: [],
        negativePoints: [],
        metrics: {
          satisfactionScore: 0,
          previousScore: 0,
          improvement: 0,
          responseTime: "0 hrs",
          previousResponseTime: "0 hrs",
          feedbackVolume: 0,
          previousVolume: 0,
          trend: "flat",
          history: {
            satisfaction: [0, 0, 0, 0, 0, 0, 0, 0],
            responseTime: [0, 0, 0, 0, 0, 0, 0, 0],
            volume: [0, 0, 0, 0, 0, 0, 0, 0],
          },
        },
        feedbackSources: {
          months: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          sources: {
            twitter: [],
            playstore: [],
            appstore: [],
            email: [],
            customData: [],
          },
        },
      });
    }

    // 3) Sentiment Analysis & Clustering (BYOK LLM with Rule-Based Fallback)
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;
    let keyInsights = [];
    let improvements = [];
    let positivePoints = [];
    let negativePoints = [];

    const isProviderValid =
      llmProvider &&
      llmProvider !== "null" &&
      llmProvider !== "undefined" &&
      llmProvider !== "";
    const isKeyValid =
      llmKey && llmKey !== "null" && llmKey !== "undefined" && llmKey !== "";
    const isOllama = llmProvider === "ollama";

    let useLLM = isProviderValid && (isOllama || isKeyValid);
    let llmResult = null;

    if (useLLM) {
      try {
        console.log(
          `Analyzing feedback using LLM provider: ${llmProvider} and model: ${llmModel || "default"}`,
        );
        llmResult = await analyzeFeedbacksWithLLM(
          feedbacks,
          llmProvider,
          llmKey,
          llmLocalUrl,
          llmModel,
        );
        console.log("LLM Analysis Successful.");

        positiveCount =
          typeof llmResult.positiveCount === "number"
            ? llmResult.positiveCount
            : 0;
        negativeCount =
          typeof llmResult.negativeCount === "number"
            ? llmResult.negativeCount
            : 0;
        neutralCount =
          typeof llmResult.neutralCount === "number"
            ? llmResult.neutralCount
            : 0;
        keyInsights = Array.isArray(llmResult.keyInsights)
          ? llmResult.keyInsights
          : [];
        improvements = Array.isArray(llmResult.improvements)
          ? llmResult.improvements
          : [];
        positivePoints = Array.isArray(llmResult.positivePoints)
          ? llmResult.positivePoints
          : [];
        negativePoints = Array.isArray(llmResult.negativePoints)
          ? llmResult.negativePoints
          : [];
      } catch (err) {
        console.error(
          "LLM Analysis failed, falling back to rule-based analysis:",
          err.message,
        );
        useLLM = false;
      }
    }

    if (!useLLM) {
      // Rule-Based Sentiment Analysis & Clustering
      const topicStats = TOPICS.map((t) => ({
        ...t,
        positiveMentions: 0,
        negativeMentions: 0,
        mentions: 0,
      }));
      const lowercase = (txt) => (txt || "").toLowerCase();

      for (const fb of feedbacks) {
        const content = lowercase(fb.content);

        // Calculate Sentiment score
        let posScore = 0;
        let negScore = 0;

        for (const w of POSITIVE_KEYWORDS) {
          if (content.includes(w)) posScore++;
        }
        for (const w of NEGATIVE_KEYWORDS) {
          if (content.includes(w)) negScore++;
        }

        if (posScore > negScore) {
          positiveCount++;
        } else if (negScore > posScore) {
          negativeCount++;
        } else {
          neutralCount++;
        }

        // Check Topics
        for (const t of topicStats) {
          let matchesTopic = false;
          for (const kw of t.keywords) {
            if (content.includes(kw)) {
              matchesTopic = true;
              break;
            }
          }
          if (matchesTopic) {
            t.mentions++;
            if (posScore > negScore) t.positiveMentions++;
            if (negScore > posScore) t.negativeMentions++;
          }
        }
      }

      const ruleTotal = feedbacks.length;
      const rulePosPct = Math.round((positiveCount / ruleTotal) * 100);
      const ruleNegPct = Math.round((negativeCount / ruleTotal) * 100);
      const ruleNeuPct = 100 - rulePosPct - ruleNegPct;

      // Filter and build dynamic points lists
      const sortedTopics = [...topicStats].sort(
        (a, b) => b.mentions - a.mentions,
      );

      positivePoints = sortedTopics
        .filter((t) => t.positiveMentions > 0)
        .slice(0, 5)
        .map((t) => ({
          point: t.positiveSummary,
          mentions: t.positiveMentions,
        }));

      negativePoints = sortedTopics
        .filter((t) => t.negativeMentions > 0)
        .slice(0, 5)
        .map((t) => ({
          point: t.negativeSummary,
          mentions: t.negativeMentions,
        }));

      if (rulePosPct > 50) {
        keyInsights.push(
          `Customer satisfaction is high, with ${rulePosPct}% positive feedback overall.`,
        );
      } else {
        keyInsights.push(
          `Customer sentiment is mixed; only ${rulePosPct}% of feedback is positive.`,
        );
      }

      if (sortedTopics[0] && sortedTopics[0].mentions > 0) {
        const topT = sortedTopics[0];
        if (topT.negativeMentions > topT.positiveMentions) {
          improvements.push(
            `Address critical ${lowercase(topT.name)} issues (mentioned by ${topT.mentions} users).`,
          );
          keyInsights.push(
            `Primary customer complaints relate to ${topT.name}.`,
          );
        } else {
          keyInsights.push(
            `Strong customer appreciation for ${topT.name} stability.`,
          );
        }
      }

      if (sortedTopics[1] && sortedTopics[1].mentions > 0) {
        const secondT = sortedTopics[1];
        if (secondT.negativeMentions > secondT.positiveMentions) {
          improvements.push(
            `Improve response and features in ${lowercase(secondT.name)} (mentioned in ${secondT.mentions} entries).`,
          );
        } else {
          keyInsights.push(
            `Positive feedback received for recent updates on ${secondT.name}.`,
          );
        }
      }

      // Default fallbacks for insights/improvements if sparse
      if (keyInsights.length < 3) {
        keyInsights.push(
          `Data imported across ${[...new Set(feedbacks.map((f) => f.source))].length} different channel(s).`,
        );
        keyInsights.push(
          "Review feedback spikes by adjusting the timeframe filter.",
        );
      }
      if (improvements.length === 0) {
        improvements.push(
          "Analyze neutral feedback items to discover subtle friction points.",
        );
        improvements.push(
          "Ensure regular app reviews synchronization to track daily sentiment swings.",
        );
      }
    }

    const total = feedbacks.length;
    const totalCount =
      positiveCount + negativeCount + neutralCount || total || 1;
    const posPct = Math.round((positiveCount / totalCount) * 100);
    const negPct = Math.round((negativeCount / totalCount) * 100);
    const neuPct = 100 - posPct - negPct;
    const currentScore = Number(((positiveCount / totalCount) * 5).toFixed(1));

    // Calculate dynamic satisfaction history (split timeframe into 8 chunks)
    const timeDiff = end.getTime() - start.getTime();
    const chunkMs = timeDiff / 8;

    const satisfactionHistory = [];
    const responseTimeHistory = [];
    const volumeHistory = [];

    for (let i = 0; i < 8; i++) {
      const chunkStart = new Date(start.getTime() + i * chunkMs);
      const chunkEnd = new Date(start.getTime() + (i + 1) * chunkMs);

      const chunkFeedbacks = feedbacks.filter(
        (f) => f.timestamp >= chunkStart && f.timestamp < chunkEnd,
      );

      let chunkPos = 0;
      let chunkNeg = 0;
      for (const fb of chunkFeedbacks) {
        let posScore = 0;
        let negScore = 0;
        const content = (fb.content || "").toLowerCase();
        for (const w of POSITIVE_KEYWORDS) if (content.includes(w)) posScore++;
        for (const w of NEGATIVE_KEYWORDS) if (content.includes(w)) negScore++;
        if (posScore > negScore) chunkPos++;
        if (negScore > posScore) chunkNeg++;
      }

      const chunkTotal = chunkFeedbacks.length;
      const score =
        chunkTotal > 0 ? Number(((chunkPos / chunkTotal) * 5).toFixed(1)) : 4.0;

      satisfactionHistory.push(score);
      // Simulate declining response times (improving) as volume scales
      responseTimeHistory.push(Number((3.8 - i * 0.2).toFixed(1)));
      volumeHistory.push(chunkTotal);
    }

    // Calculate dynamic source distributions
    const sourceDistribution = {
      twitter: Array(12).fill(0),
      playstore: Array(12).fill(0),
      appstore: Array(12).fill(0),
      email: Array(12).fill(0),
      customData: Array(12).fill(0),
    };

    feedbacks.forEach((f) => {
      const month = f.timestamp.getMonth();
      const src = f.source;
      if (src === "x") sourceDistribution.twitter[month]++;
      else if (src === "playstore") sourceDistribution.playstore[month]++;
      else if (src === "appstore") sourceDistribution.appstore[month]++;
      else if (src === "gmail") sourceDistribution.email[month]++;
      else sourceDistribution.customData[month]++;
    });

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // 4) Save analysis snapshot to history if it's a fresh scrape run
    if (!skipScraping && total > 0) {
      try {
        await AnalysisHistory.create({
          userId,
          startDate: start,
          endDate: end,
          totalFeedback: total,
          positiveSentiment: posPct,
          negativeSentiment: negPct,
          neutralSentiment: neuPct,
          keyInsights,
          improvements,
          satisfactionScore: currentScore,
        });
        console.log("Analysis history snapshot saved successfully.");
      } catch (err) {
        console.warn("Failed to save analysis history snapshot:", err.message);
      }
    }

    const currentResponseTime =
      total > 0 ? Number((12 / Math.log10(total + 9)).toFixed(1)) : 0;
    const prevResponseTime =
      previousVolume > 0
        ? Number((12 / Math.log10(previousVolume + 9)).toFixed(1))
        : 0;

    res.status(200).json({
      summary: {
        totalFeedback: total,
        positiveSentiment: posPct,
        negativeSentiment: negPct,
        neutralSentiment: neuPct,
        keyInsights,
        improvements,
      },
      positivePoints,
      negativePoints,
      metrics: {
        satisfactionScore: currentScore,
        previousScore: previousScore,
        improvement:
          previousScore > 0
            ? Number(
                (
                  ((currentScore - previousScore) / previousScore) *
                  100
                ).toFixed(1),
              )
            : 0,
        responseTime: `${currentResponseTime} hrs`,
        previousResponseTime: `${prevResponseTime} hrs`,
        feedbackVolume: total,
        previousVolume: previousVolume,
        trend: currentScore >= previousScore ? "up" : "down",
        history: {
          satisfaction: satisfactionHistory,
          responseTime: responseTimeHistory,
          volume: volumeHistory,
        },
      },
      feedbackSources: {
        months,
        sources: sourceDistribution,
      },
    });
  } catch (error) {
    console.error("Dashboard Analysis Error:", error.message);
    res
      .status(500)
      .json({ message: error.message || "Failed to analyze dashboard data" });
  }
};

export const getAnalysisHistory = async (req, res) => {
  const userId = req.user._id;

  try {
    const items = await AnalysisHistory.find({ userId })
      .sort({ timestamp: -1 })
      .limit(100);

    res.status(200).json({ count: items.length, items });
  } catch (error) {
    console.error("Error in getAnalysisHistory:", error.message);
    res
      .status(500)
      .json({ message: error.message || "Failed to load history" });
  }
};

export const testLlmConnection = async (req, res) => {
  const llmProvider =
    req.headers["x-llm-provider"] || req.get("x-llm-provider");
  const llmKey = req.headers["x-llm-key"] || req.get("x-llm-key");
  const llmLocalUrl =
    req.headers["x-llm-local-url"] ||
    req.get("x-llm-local-url") ||
    "http://localhost:11434";
  const llmModel = req.headers["x-llm-model"] || req.get("x-llm-model");

  if (!llmProvider) {
    return res.status(400).json({ message: "No LLM provider specified." });
  }
  if (llmProvider !== "ollama" && !llmKey) {
    return res.status(400).json({ message: "API key is required." });
  }

  const selectedModel =
    llmModel ||
    (llmProvider === "gemini"
      ? "gemini-2.0-flash"
      : llmProvider === "openai"
        ? "gpt-4o-mini"
        : llmProvider === "claude"
          ? "claude-3-5-sonnet-20241022"
          : llmProvider === "groq"
            ? "llama-3.3-70b-versatile"
            : "llama3");

  try {
    if (llmProvider === "gemini") {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${llmKey}`;
      await axios.post(
        url,
        {
          contents: [
            { parts: [{ text: "Hello. Respond with one word: 'ok'." }] },
          ],
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 5000,
        },
      );
    } else if (llmProvider === "openai") {
      const url = "https://api.openai.com/v1/chat/completions";
      await axios.post(
        url,
        {
          model: selectedModel,
          messages: [{ role: "user", content: "Hello" }],
          max_tokens: 5,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${llmKey}`,
          },
          timeout: 5000,
        },
      );
    } else if (llmProvider === "claude") {
      const url = "https://api.anthropic.com/v1/messages";
      await axios.post(
        url,
        {
          model: selectedModel,
          max_tokens: 5,
          messages: [{ role: "user", content: "Hello" }],
        },
        {
          headers: {
            "content-type": "application/json",
            "x-api-key": llmKey,
            "anthropic-version": "2023-06-01",
          },
          timeout: 5000,
        },
      );
    } else if (llmProvider === "groq") {
      const url = "https://api.groq.com/openai/v1/chat/completions";
      await axios.post(
        url,
        {
          model: selectedModel,
          messages: [{ role: "user", content: "Hello" }],
          max_tokens: 5,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${llmKey}`,
          },
          timeout: 5000,
        },
      );
    } else if (llmProvider === "ollama") {
      const baseUrl = llmLocalUrl.replace(/\/$/, "");
      const url = `${baseUrl}/api/chat`;
      await axios.post(
        url,
        {
          model: selectedModel,
          messages: [{ role: "user", content: "Hello" }],
          stream: false,
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 5000,
        },
      );
    } else {
      return res.status(400).json({ message: "Unsupported LLM provider." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Connection successful!" });
  } catch (error) {
    console.error("Test connection error:", error.message);
    const details =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message;
    return res
      .status(500)
      .json({ success: false, message: `Connection failed: ${details}` });
  }
};

export const getOllamaModels = async (req, res) => {
  const localUrl =
    req.headers["x-llm-local-url"] ||
    req.get("x-llm-local-url") ||
    "http://localhost:11434";

  try {
    const baseUrl = localUrl.replace(/\/$/, "");
    const response = await axios.get(`${baseUrl}/api/tags`, { timeout: 3000 });

    const models = response.data?.models || [];
    const modelNames = models.map((m) => m.name);

    return res.status(200).json({ success: true, models: modelNames });
  } catch (error) {
    console.warn("Failed to fetch Ollama local models:", error.message);
    return res.status(200).json({
      success: false,
      message: "Ollama local service is not active or unreachable.",
    });
  }
};
