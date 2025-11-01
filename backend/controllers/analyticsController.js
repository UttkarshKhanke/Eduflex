import Course from "../models/Course.js";
import Progress from "../models/Progress.js";
import Quiz from "../models/quizModel.js";

/**
 * Get unified dashboard analytics
 * Route: GET /api/analytics/stats
 */
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // ---------- INSTRUCTOR ANALYTICS ----------
    if (userRole === "instructor") {
      // 🟦 Fetch all courses created by the instructor (check both field names)
      const courses =
        (await Course.find({ instructor: userId }))?.length > 0
          ? await Course.find({ instructor: userId })
          : await Course.find({ createdBy: userId });

      const totalCourses = courses.length;

      // 🟩 Fetch all quizzes created by this instructor (check both field names)
      const quizzes =
        (await Quiz.find({ instructor: userId }))?.length > 0
          ? await Quiz.find({ instructor: userId })
          : await Quiz.find({ createdBy: userId });

      const totalQuizzes = quizzes.length;

      // 🟨 Get progress data for all the instructor's courses
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

    // ---------- STUDENT ANALYTICS ----------
    if (userRole === "student") {
      const progressRecords = await Progress.find({ student: userId }).populate(
        "course"
      );

      const totalCourses = progressRecords.length;
      const completedCourses = progressRecords.filter(
        (p) => p.percentage === 100
      ).length;
      const avgPerformance =
        progressRecords.length > 0
          ? (
              progressRecords.reduce((acc, p) => acc + (p.percentage || 0), 0) /
              progressRecords.length
            ).toFixed(2)
          : 0;

      return res.status(200).json({
        role: "student",
        stats: {
          totalCourses,
          completedCourses,
          avgPerformance,
        },
      });
    }

    // ---------- INVALID ROLE ----------
    res.status(400).json({ message: "Invalid user role" });
  } catch (error) {
    console.error("Dashboard analytics error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
