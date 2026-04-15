import mongoose from "mongoose";

const gmailUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },

    gmail: {
      accessToken: { type: String },
      refreshToken: { type: String },
      tokenExpiry: { type: Date },
    },
  },
  { timestamps: true }
);
const GmailUser = mongoose.model("GmailUser", gmailUserSchema);
export default GmailUser;
