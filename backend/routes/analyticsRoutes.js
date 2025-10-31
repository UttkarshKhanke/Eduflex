import express from "express";
import { getCourseAnalytics, getInstructorAnalytics } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/course/:courseId", protect, getCourseAnalytics);
router.get("/instructor", protect, getInstructorAnalytics);

export default router;
