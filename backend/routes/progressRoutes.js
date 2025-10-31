import express from "express";
import { getUserProgress, getCourseProgress } from "../controllers/progressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/student", protect, getUserProgress);
router.get("/course/:courseId", protect, getCourseProgress);

export default router;
