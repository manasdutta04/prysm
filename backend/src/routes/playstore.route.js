import express from "express";
import {
  connectPlaystore,
  disconnectPlaystore,
  fetchAndSaveReviews,
  getStatus,
} from "../controllers/playstore.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Check connection status
router.get("/status", protectRoute, getStatus);

// Connect a Play Store app
router.post("/connect", protectRoute, connectPlaystore);

// Disconnect
router.post("/disconnect", protectRoute, disconnectPlaystore);

// Fetch & save reviews
router.get("/reviews", protectRoute, fetchAndSaveReviews);

export default router;