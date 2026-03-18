import mongoose from "mongoose";

const playstoreUserSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appId: { type: String, required: true },
    appName: { type: String, default: "" },
    isConnected: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const PlaystoreUser = mongoose.model("PlaystoreUser", playstoreUserSchema);
export default PlaystoreUser;