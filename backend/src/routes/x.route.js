import express from "express";
import { getXFeedback } from "../controllers/x.controller.js";

const router = express.Router();

router.get("/feedback/:handle", getXFeedback);

export default router;
