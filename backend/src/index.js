import express from "express";
import { connectDB } from "./lib/db.js";
// import connectDB from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import playstoreRoutes from "./routes/playstore.route.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";

import googleRoutes from "./routes/google.route.js";
import xRoutes from "./routes/x.route.js";
import appStoreRoutes from "./routes/appstore.route.js";
import customDataRoutes from "./routes/customData.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const normalizeOrigin = (value) => {
  if (!value) return "";
  try {
    return new URL(value).origin;
  } catch {
    return value.replace(/\/+$/, "");
  }
};

const allowedOrigins = new Set(
  [
    process.env.FRONTEND_URL,
    "https://getprysm.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
  ]
    .filter(Boolean)
    .map(normalizeOrigin),
);

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      const normalizedOrigin = normalizeOrigin(origin);

      if (!origin || allowedOrigins.has(normalizedOrigin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

//for local mongodb testing
// connectDB("mongodb://localhost:27017/prysm-users").then(() => {
//   console.log("Mongodb Connected");
// });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/playstore", playstoreRoutes);

app.use("/api/auth/google", googleRoutes);

app.use("/api/x", xRoutes);

app.use("/api/appstore", appStoreRoutes);
app.use("/api/custom-data", customDataRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // ensure upload tmp directory exists
  const tmpDir = `${process.cwd()}/tmp_uploads`;
  try {
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
  } catch (e) {
    console.warn("Could not create tmp_uploads folder", e.message);
  }

  connectDB();
});