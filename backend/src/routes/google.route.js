import express from "express";
import {
  connectGoogle,
  googleCallback,
  getUserEmails,
} from "../controllers/google.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// user must be logged in before connecting gmail
router.get("/connect", protectRoute, connectGoogle);

router.get("/callback", googleCallback);

router.get("/emails", protectRoute, getUserEmails);

export default router;
