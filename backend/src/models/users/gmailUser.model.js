import mongoose from "mongoose";

const gmailUserSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    tokenExpiryDate: { type: Date, required: true },
  },
  { timestamps: true }
);
const GmailUser = monngoose.model("GmailUser", gmailUserSchema);
export default GmailUser;
