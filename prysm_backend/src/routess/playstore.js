const express = require("express");
const router = express.Router();
const { fetchAndStoreReviews } = require("../services/playstoreService");

/**
 * POST /api/playstore/fetch
 * Body: { appId: 'com.spotify.music', limit: 500 }
 */
router.post("/fetch", async (req, res) => {
  const { appId, limit } = req.body;

  if (!appId) {
    return res.status(400).json({ success: false, error: "appId required" });
  }

  try {
    const result = await fetchAndStoreReviews(appId, limit || 500);

    return res.json({
      success: true,
      appId,
      collected: result.collected,
      saved: result.saved
    });
  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;
