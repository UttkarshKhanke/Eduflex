import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getUserProgress,
  toggleModuleCompletion,
  completeCourse,
} from "../controllers/progressController.js";

const router = express.Router();

/* =========================================================
   ✅ Get user progress for a course
   ========================================================= */
router.get("/:courseId", verifyToken, getUserProgress);

/* =========================================================
   ✅ Toggle a specific module’s completion
   ========================================================= */
router.put("/:courseId/module/:moduleIndex", verifyToken, toggleModuleCompletion);

/* =========================================================
   ✅ Mark entire course as completed
   ========================================================= */
router.put("/:courseId/complete", verifyToken, completeCourse);

export default router;
