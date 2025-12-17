const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    appId: String,
    reviewId: { type: String, unique: true },
    userName: String,
    rating: Number,
    reviewText: String,
    reviewDate: Date,
    version: String,
    source: {
      type: String,
      default: "Google Play Store"
    }
  },
  { timestamps: true }
);
reviewSchema.index({ reviewId: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
