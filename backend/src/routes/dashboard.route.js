import express from "express";
import { fetchAndAnalyzeData, getAnalysisHistory, testLlmConnection, getOllamaModels } from "../controllers/dashboard.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/fetch-and-analyze", protectRoute, fetchAndAnalyzeData);
router.post("/test-connection", protectRoute, testLlmConnection);
router.post("/ollama-models", protectRoute, getOllamaModels);
router.get("/history", protectRoute, getAnalysisHistory);

export default router;
