// backend/controllers/analyticsController.js
import Course from "../models/Course.js";
import Progress from "../models/Progress.js";
import Quiz from "../models/quizModel.js";
import QuizAttempt from "../models/quizAttemptModel.js";

/**
 * Get unified dashboard analytics for both roles
 * Route: GET /api/analytics/stats
 */
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    // ---------------- Instructor Dashboard ----------------
    if (userRole === "instructor") {
      const courses =
        (await Course.find({ instructor: userId }))?.length > 0
          ? await Course.find({ instructor: userId })
          : await Course.find({ createdBy: userId });

      const totalCourses = courses.length;

      const quizzes =
        (await Quiz.find({ instructor: userId }))?.length > 0
          ? await Quiz.find({ instructor: userId })
          : await Quiz.find({ createdBy: userId });

      const totalQuizzes = quizzes.length;

      const courseIds = courses.map((c) => c._id);
      const progressRecords = await Progress.find({
        course: { $in: courseIds },
      });

      const totalStudents = new Set(
        progressRecords.map((p) => p.student.toString())
      ).size;

      const avgPerformance =
        progressRecords.length > 0
          ? (
              progressRecords.reduce((acc, p) => acc + (p.percentage || 0), 0) /
              progressRecords.length
            ).toFixed(2)
          : 0;

      return res.status(200).json({
        role: "instructor",
        stats: {
          totalCourses,
          totalQuizzes,
          totalStudents,
          avgPerformance,
        },
      });
    }

    // ---------------- Student Dashboard ----------------
    if (userRole === "student") {
      // 🟩 Fetch course progress
      const progressRecords = await Progress.find({ student: userId });

      const totalCourses = progressRecords.length;
      const completedCourses = progressRecords.filter(
        (p) => p.percentage === 100
      ).length;
      const overallProgress =
        progressRecords.length > 0
          ? (
              progressRecords.reduce((acc, p) => acc + (p.percentage || 0), 0) /
              progressRecords.length
            ).toFixed(2)
          : 0;

      // 🟦 Fetch quiz completion stats
      const allQuizzes = await Quiz.countDocuments();
      const completedQuizzes = await QuizAttempt.countDocuments({
        student: userId,
      });

      return res.status(200).json({
        role: "student",
        stats: {
          enrolledCourses: totalCourses,
          coursesCompleted: completedCourses,
          quizzesCompleted: completedQuizzes,
          totalQuizzes: allQuizzes,
          overallProgress,
        },
      });
    }

    return res.status(400).json({ message: "Invalid user role" });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
