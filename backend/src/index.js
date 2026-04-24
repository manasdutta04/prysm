import express from "express";
import { connectDB } from "./lib/db.js";
// import connectDB from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import googleRoutes from "./routes/google.route.js";
import xRoutes from "./routes/x.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

//middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

//for local mongodb testing

// connectDB("mongodb://localhost:27017/prysm-users").then(() => {
//   console.log("Mongodb Connected");
// });

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/auth/google", googleRoutes);

app.use("/api/x", xRoutes);

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
