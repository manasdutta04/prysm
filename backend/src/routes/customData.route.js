import express from "express";
import multer from "multer";
import { uploadCustomData, getUploadHistory } from "../controllers/customData.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import path from "path";

const router = express.Router();

const upload = multer({ dest: path.join(process.cwd(), "tmp_uploads") });

router.post("/upload", protectRoute, upload.single("file"), uploadCustomData);
router.get("/history", protectRoute, getUploadHistory);

export default router;
