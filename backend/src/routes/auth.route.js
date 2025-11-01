import express from "express";
import {
  signup,
  login,
  checkAuth,
  logout,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Register
router.post("/signup", signup);

// Login
router.post("/login", login);

//Logout
router.post("/logout", logout);

// Verify Token
router.get("/check", protectRoute, checkAuth);

export default router;
