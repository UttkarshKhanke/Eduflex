import Course from "../models/Course.js";
import Progress from "../models/Progress.js";
import Quiz from "../models/Quiz.js";
import mongoose from "mongoose";

/**
 * Get analytics for a specific course
 * Route: GET /api/analytics/course/:courseId
 */
export const getCourseAnalytics = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Validate course existence
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Get all progress records for this course
    const progressData = await Progress.find({ course: courseId });

    if (progressData.length === 0)
      return res.status(200).json({ message: "No progress data yet", stats: {} });

    // Compute analytics
    const totalStudents = progressData.length;
    const avgScore =
      progressData.reduce((acc, p) => acc + p.score, 0) / progressData.length;
    const avgPercentage =
      progressData.reduce((acc, p) => acc + p.percentage, 0) / progressData.length;

    const highScorers = progressData.filter((p) => p.percentage >= 80).length;
    const lowScorers = progressData.filter((p) => p.percentage < 40).length;

    res.status(200).json({
      course: course.title,
      totalStudents,
      avgScore: avgScore.toFixed(2),
      avgPercentage: avgPercentage.toFixed(2),
      highScorers,
      lowScorers,
    });
  } catch (error) {
    console.error("Course analytics error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get global analytics for instructor
 * Route: GET /api/analytics/instructor
 */
export const getInstructorAnalytics = async (req, res) => {
  try {
    const instructorId = req.user.id;

    // Get all instructor courses
    const courses = await Course.find({ instructor: instructorId });
    const courseIds = courses.map((c) => c._id);

    // Get all progress records for instructor’s courses
    const progressRecords = await Progress.find({ course: { $in: courseIds } });

    const totalStudents = new Set(progressRecords.map((p) => p.student.toString())).size;
    const totalCourses = courses.length;
    const totalQuizzes = await Quiz.countDocuments({ instructor: instructorId });

    const avgPercentage =
      progressRecords.length > 0
        ? (
            progressRecords.reduce((acc, p) => acc + p.percentage, 0) /
            progressRecords.length
          ).toFixed(2)
        : 0;

    res.status(200).json({
      instructor: req.user.id,
      totalCourses,
      totalStudents,
      totalQuizzes,
      avgPerformance: avgPercentage,
    });
  } catch (error) {
    console.error("Instructor analytics error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
