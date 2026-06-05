import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  // 1) Internal reference
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // 2) Source of feedback
  source: {
    type: String,
    enum: ["gmail", "x", "playstore", "appstore"],
    required: true,
  },

  // 3) External ID from the platform (email ID, tweet ID, review ID)
  externalId: { type: String, required: true },

  // 4) Main text content of the feedback
  content: { type: String, required: true },

  // 5) Flexible metadata (varies by platform)
  metadata: {
    type: mongoose.Schema.Types.Mixed, // allows JSON object
    default: {},
  },

  // 6) Timestamp (feedback creation time)
  timestamp: { type: Date, required: true, default: Date.now },
});

export default mongoose.model("Feedback", FeedbackSchema);
