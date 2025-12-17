const gplay = require("google-play-scraper");
const Review = require("../models/review");
/**
 * Fetch & store Google Play reviews
 * @param {string} appId - e.g. com.spotify.music
 * @param {number} limit - total reviews to fetch
 */
async function fetchAndStoreReviews(appId, limit = 100) {
  let collected = 0;
  let token = null;
  const saved = {
    inserted: 0,
    updated: 0
  };
  while (collected < limit) {
    const batchSize = Math.min(40, limit - collected);
    const res = await gplay.reviews({
      appId,
      sort: gplay.sort.NEWEST,
      num: batchSize,
      token
    });
    if (!res || !res.data || res.data.length === 0) break;
    for (const r of res.data) {
      const doc = {
        reviewId: `${r.id}_${appId}`,
        appId,
        userName: r.userName,
        rating: r.score,
        reviewText: r.text,
        reviewDate: r.date ? new Date(r.date) : null,
        source: "Google Play Store",
        raw: r
      };
      const result = await Review.updateOne(
        { reviewId: doc.reviewId },
        { $set: doc },
        { upsert: true }
      );
      if (result.upsertedCount > 0) saved.inserted++;
      else saved.updated++;
      collected++;
    }
    token = res.nextToken;
    if (!token) break;
  }
  return { collected, saved };
}
module.exports = { fetchAndStoreReviews };
