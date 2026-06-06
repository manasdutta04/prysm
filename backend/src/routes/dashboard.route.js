import express from "express";
import { fetchAndAnalyzeData, getAnalysisHistory } from "../controllers/dashboard.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/fetch-and-analyze", protectRoute, fetchAndAnalyzeData);
router.get("/history", protectRoute, getAnalysisHistory);

export default router;
