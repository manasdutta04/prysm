import mongoose from "mongoose";

const AnalysisHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  timestamp: { type: Date, default: Date.now },
  totalFeedback: { type: Number, required: true },
  positiveSentiment: { type: Number, required: true },
  negativeSentiment: { type: Number, required: true },
  neutralSentiment: { type: Number, required: true },
  keyInsights: [{ type: String }],
  improvements: [{ type: String }],
  satisfactionScore: { type: Number, required: true }
});

const AnalysisHistory = mongoose.model("AnalysisHistory", AnalysisHistorySchema);
export default AnalysisHistory;
