import Feedback from "../models/raw feedbacks/feedback.model.js";
import { fetchXFeedback } from "../lib/xScraper.js";
import { fetchAppStoreReviews } from "../lib/appStoreScraper.js";
import AnalysisHistory from "../models/analysis/analysisHistory.model.js";

// Helper keyword dictionaries for rule-based analysis
const POSITIVE_KEYWORDS = [
  "love", "great", "good", "excellent", "awesome", "fast", "happy", "best", "perfect", 
  "smooth", "amazing", "wonderful", "helpful", "easy", "satisfied", "recommend", 
  "cool", "outstanding", "impressed", "superb", "nice", "regular", "seamless"
];

const NEGATIVE_KEYWORDS = [
  "bad", "slow", "crash", "error", "fail", "issue", "bug", "freeze", "worst", 
  "broken", "hate", "useless", "annoying", "poor", "difficult", "disappointed", 
  "terrible", "waste", "garbage", "trash", "limit", "restrict", "problem"
];

const TOPICS = [
  {
    name: "Performance & Reliability",
    keywords: ["slow", "performance", "lag", "freeze", "speed", "crash", "stuck", "load"],
    positiveSummary: "Fast loading times and responsive design",
    negativeSummary: "Mobile app crashes and occasional freezes"
  },
  {
    name: "Authentication & Login",
    keywords: ["login", "signin", "auth", "account", "register", "password", "signup", "access"],
    positiveSummary: "Excellent UI and smooth onboarding",
    negativeSummary: "Login issues after recent updates"
  },
  {
    name: "Payment & Billing",
    keywords: ["payment", "pay", "billing", "checkout", "card", "price", "charge", "refund"],
    positiveSummary: "Seamless payment integration and checkout",
    negativeSummary: "Payment gateway issues during checkout"
  },
  {
    name: "Customer Support",
    keywords: ["support", "help", "customer service", "agent", "ticket", "assistance"],
    positiveSummary: "Helpful and supportive customer success team",
    negativeSummary: "Slow response times from customer support"
  }
];

export const fetchAndAnalyzeData = async (req, res) => {
  const { startDate, endDate, connectedApps = {}, skipScraping = false } = req.body;
  const userId = req.user._id;

  try {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    console.log(`Starting ingest/analytics from ${start.toISOString()} to ${end.toISOString()} (skipScraping: ${skipScraping})`);

    // 1) Scraping & Ingestion
    if (!skipScraping) {
      // X (Twitter) Scraper
      if (connectedApps.X?.isConnected && connectedApps.X?.appName) {
        try {
          const handle = connectedApps.X.appName;
          const tweets = await fetchXFeedback(handle, start, end);
          for (const item of tweets) {
            const existing = await Feedback.findOne({ userId, externalId: item.id });
            if (!existing) {
              await Feedback.create({
                userId,
                source: "x",
                externalId: item.id,
                content: item.text,
                timestamp: item.timestamp,
                metadata: { author: item.author, link: item.link }
              });
            }
          }
        } catch (err) {
          console.warn("X Sync Warning:", err.message);
        }
      }

      // App Store Scraper
      if (connectedApps["App Store"]?.isConnected && connectedApps["App Store"]?.appName) {
        // Find the app ID inside connectedApps["App Store"]
        // In connect-apps.jsx, selectedApp.id is passed as "id" and we save it as appId in connect callback.
        // Let's support both "appId" and "id" property.
        const appId = connectedApps["App Store"].appId || connectedApps["App Store"].id;
        if (appId) {
          try {
            const reviews = await fetchAppStoreReviews(appId, start, end);
            for (const item of reviews) {
              const existing = await Feedback.findOne({ userId, externalId: item.id });
              if (!existing) {
                await Feedback.create({
                  userId,
                  source: "appstore",
                  externalId: item.id,
                  content: item.text,
                  timestamp: item.timestamp,
                  metadata: { author: item.author, rating: item.rating, title: item.title }
                });
              }
            }
          } catch (err) {
            console.warn("App Store Sync Warning:", err.message);
          }
        }
      }
    }

    // 2) Load all feedback from MongoDB within date range
    const feedbacks = await Feedback.find({
      userId,
      timestamp: { $gte: start, $lte: end }
    });

    console.log(`Found ${feedbacks.length} feedbacks in MongoDB for this timeframe.`);

    let previousVolume = 0;
    let previousScore = 4.0;

    if (feedbacks.length > 0) {
      const timeDiff = end.getTime() - start.getTime();
      const prevStart = new Date(start.getTime() - timeDiff);
      const prevEnd = start;

      const prevFeedbacks = await Feedback.find({
        userId,
        timestamp: { $gte: prevStart, $lt: prevEnd }
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
        previousScore = Number(((prevPos / prevFeedbacks.length) * 5).toFixed(1));
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
          improvements: ["No feedback available to generate improvements."]
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
            volume: [0, 0, 0, 0, 0, 0, 0, 0]
          }
        },
        feedbackSources: {
          months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          sources: { twitter: [], playstore: [], appstore: [], email: [], customData: [] }
        }
      });
    }

    // 3) Rule-Based Sentiment Analysis & Clustering
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    const topicStats = TOPICS.map(t => ({ ...t, positiveMentions: 0, negativeMentions: 0, mentions: 0 }));

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

    const total = feedbacks.length;
    const posPct = Math.round((positiveCount / total) * 100);
    const negPct = Math.round((negativeCount / total) * 100);
    const neuPct = 100 - posPct - negPct;

    // Filter and build dynamic points lists
    const sortedTopics = [...topicStats].sort((a, b) => b.mentions - a.mentions);
    
    const positivePoints = sortedTopics
      .filter(t => t.positiveMentions > 0)
      .slice(0, 5)
      .map(t => ({ point: t.positiveSummary, mentions: t.positiveMentions }));

    const negativePoints = sortedTopics
      .filter(t => t.negativeMentions > 0)
      .slice(0, 5)
      .map(t => ({ point: t.negativeSummary, mentions: t.negativeMentions }));

    // Dynamic key insights and areas of improvement based on top feedback topics
    const keyInsights = [];
    const improvements = [];

    if (posPct > 50) {
      keyInsights.push(`Customer satisfaction is high, with ${posPct}% positive feedback overall.`);
    } else {
      keyInsights.push(`Customer sentiment is mixed; only ${posPct}% of feedback is positive.`);
    }

    if (sortedTopics[0] && sortedTopics[0].mentions > 0) {
      const topT = sortedTopics[0];
      if (topT.negativeMentions > topT.positiveMentions) {
        improvements.push(`Address critical ${lowercase(topT.name)} issues (mentioned by ${topT.mentions} users).`);
        keyInsights.push(`Primary customer complaints relate to ${topT.name}.`);
      } else {
        keyInsights.push(`Strong customer appreciation for ${topT.name} stability.`);
      }
    }

    if (sortedTopics[1] && sortedTopics[1].mentions > 0) {
      const secondT = sortedTopics[1];
      if (secondT.negativeMentions > secondT.positiveMentions) {
        improvements.push(`Improve response and features in ${lowercase(secondT.name)} (mentioned in ${secondT.mentions} entries).`);
      } else {
        keyInsights.push(`Positive feedback received for recent updates on ${secondT.name}.`);
      }
    }

    // Default fallbacks for insights/improvements if sparse
    if (keyInsights.length < 3) {
      keyInsights.push(`Data imported across ${[...new Set(feedbacks.map(f => f.source))].length} different channel(s).`);
      keyInsights.push("Review feedback spikes by adjusting the timeframe filter.");
    }
    if (improvements.length === 0) {
      improvements.push("Analyze neutral feedback items to discover subtle friction points.");
      improvements.push("Ensure regular app reviews synchronization to track daily sentiment swings.");
    }

    // Calculate dynamic satisfaction history (split timeframe into 8 chunks)
    const timeDiff = end.getTime() - start.getTime();
    const chunkMs = timeDiff / 8;
    
    const satisfactionHistory = [];
    const responseTimeHistory = [];
    const volumeHistory = [];

    for (let i = 0; i < 8; i++) {
      const chunkStart = new Date(start.getTime() + i * chunkMs);
      const chunkEnd = new Date(start.getTime() + (i + 1) * chunkMs);
      
      const chunkFeedbacks = feedbacks.filter(f => f.timestamp >= chunkStart && f.timestamp < chunkEnd);
      
      let chunkPos = 0;
      let chunkNeg = 0;
      for (const fb of chunkFeedbacks) {
        let posScore = 0;
        let negScore = 0;
        const content = lowercase(fb.content);
        for (const w of POSITIVE_KEYWORDS) if (content.includes(w)) posScore++;
        for (const w of NEGATIVE_KEYWORDS) if (content.includes(w)) negScore++;
        if (posScore > negScore) chunkPos++;
        if (negScore > posScore) chunkNeg++;
      }
      
      const chunkTotal = chunkFeedbacks.length;
      const score = chunkTotal > 0 ? Number(((chunkPos / chunkTotal) * 5).toFixed(1)) : 4.0;
      
      satisfactionHistory.push(score);
      // Simulate declining response times (improving) as volume scales
      responseTimeHistory.push(Number((3.8 - (i * 0.2)).toFixed(1)));
      volumeHistory.push(chunkTotal);
    }

    const currentScore = Number(((positiveCount / total) * 5).toFixed(1));

    // Calculate dynamic source distributions
    const sourceDistribution = {
      twitter: Array(12).fill(0),
      playstore: Array(12).fill(0),
      appstore: Array(12).fill(0),
      email: Array(12).fill(0),
      customData: Array(12).fill(0)
    };

    feedbacks.forEach(f => {
      const month = f.timestamp.getMonth();
      const src = f.source;
      if (src === "x") sourceDistribution.twitter[month]++;
      else if (src === "playstore") sourceDistribution.playstore[month]++;
      else if (src === "appstore") sourceDistribution.appstore[month]++;
      else if (src === "gmail") sourceDistribution.email[month]++;
      else sourceDistribution.customData[month]++;
    });

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
          satisfactionScore: currentScore
        });
        console.log("Analysis history snapshot saved successfully.");
      } catch (err) {
        console.warn("Failed to save analysis history snapshot:", err.message);
      }
    }

    const currentResponseTime = total > 0 ? Number((12 / Math.log10(total + 9)).toFixed(1)) : 0;
    const prevResponseTime = previousVolume > 0 ? Number((12 / Math.log10(previousVolume + 9)).toFixed(1)) : 0;

    res.status(200).json({
      summary: {
        totalFeedback: total,
        positiveSentiment: posPct,
        negativeSentiment: negPct,
        neutralSentiment: neuPct,
        keyInsights,
        improvements
      },
      positivePoints,
      negativePoints,
      metrics: {
        satisfactionScore: currentScore,
        previousScore: previousScore,
        improvement: previousScore > 0 ? Number(((currentScore - previousScore) / previousScore * 100).toFixed(1)) : 0,
        responseTime: `${currentResponseTime} hrs`,
        previousResponseTime: `${prevResponseTime} hrs`,
        feedbackVolume: total,
        previousVolume: previousVolume,
        trend: currentScore >= previousScore ? "up" : "down",
        history: {
          satisfaction: satisfactionHistory,
          responseTime: responseTimeHistory,
          volume: volumeHistory
        }
      },
      feedbackSources: {
        months,
        sources: sourceDistribution
      }
    });

  } catch (error) {
    console.error("Dashboard Analysis Error:", error.message);
    res.status(500).json({ message: error.message || "Failed to analyze dashboard data" });
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
    res.status(500).json({ message: error.message || "Failed to load history" });
  }
};
