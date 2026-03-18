import gplay from "google-play-scraper";
import Feedback from "../models/raw_feedback/feedback.models.js";
import PlaystoreUser from "../models/users/playstoreUser.model.js";

/**
 * @route POST /api/playstore/connect
 */
export const connectPlaystore = async (req, res) => {
  const { appId } = req.body;
  const userId = req.user._id;

  try {
    if (!appId) {
      return res.status(400).json({ message: "appId is required" });
    }

    const appInfo = await gplay.app({ appId });

    const playstoreUser = await PlaystoreUser.findOneAndUpdate(
      { userId },
      {
        userId,
        appId,
        appName: appInfo.title || "",
        isConnected: true,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "Play Store connected successfully",
      appId: playstoreUser.appId,
      appName: playstoreUser.appName,
    });
  } catch (error) {
    console.error("❌ Error in connectPlaystore controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @route POST /api/playstore/disconnect
 */
export const disconnectPlaystore = async (req, res) => {
  const userId = req.user._id;

  try {
    await PlaystoreUser.findOneAndUpdate(
      { userId },
      { isConnected: false }
    );

    res.status(200).json({ message: "Play Store disconnected successfully" });
  } catch (error) {
    console.error("❌ Error in disconnectPlaystore controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @route GET /api/playstore/reviews
 */
export const fetchAndSaveReviews = async (req, res) => {
  const userId = req.user._id;

  try {
    const playstoreUser = await PlaystoreUser.findOne({
      userId,
      isConnected: true,
    });

    if (!playstoreUser) {
      return res.status(400).json({
        message: "No Play Store app connected. Please connect first.",
      });
    }

    const { appId } = playstoreUser;

    const result = await gplay.reviews({
      appId,
      lang: "en",
      country: "us",
      sort: gplay.sort.NEWEST,
      num: 100,
    });

    const reviews = result.data;

    const saveResults = await Promise.allSettled(
      reviews.map((review) =>
        Feedback.findOneAndUpdate(
          { externalId: review.id, source: "playstore" },
          {
            userId,
            source: "playstore",
            externalId: review.id,
            content: review.text,
            timestamp: new Date(review.date),
            metadata: {
              userName: review.userName,
              score: review.score,
              thumbsUp: review.thumbsUp,
              appId,
              replyText: review.replyText || "",
            },
          },
          { upsert: true, new: true }
        )
      )
    );

    const saved = saveResults.filter((r) => r.status === "fulfilled").length;
    const failed = saveResults.filter((r) => r.status === "rejected").length;

    res.status(200).json({
      message: `Fetched ${reviews.length} reviews. Saved: ${saved}, Skipped/Failed: ${failed}`,
      totalFetched: reviews.length,
      saved,
    });
  } catch (error) {
    console.error("❌ Error in fetchAndSaveReviews controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @route GET /api/playstore/status
 */
export const getStatus = async (req, res) => {
  const userId = req.user._id;

  try {
    const playstoreUser = await PlaystoreUser.findOne({ userId });

    if (!playstoreUser) {
      return res.status(200).json({ isConnected: false });
    }

    res.status(200).json({
      isConnected: playstoreUser.isConnected,
      appId: playstoreUser.appId,
      appName: playstoreUser.appName,
    });
  } catch (error) {
    console.error("❌ Error in getStatus controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};