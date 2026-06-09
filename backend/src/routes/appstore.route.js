import express from "express";
import { getAppReviews, searchApps } from "../controllers/appstore.controller.js";

const router = express.Router();

router.get("/search", searchApps);
router.get("/reviews/:id", getAppReviews);

export default router;
