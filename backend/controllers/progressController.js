// controllers/progressController.js
import Progress from "../models/Progress.js";
import Course from "../models/Course.js";

/* =========================================================
   ✅ Get user progress for a course
   ========================================================= */
export const getUserProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    let progress = await Progress.findOne({ course: courseId, student: userId });

    // If no progress exists, initialize one
    if (!progress) {
      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ message: "Course not found" });

      progress = new Progress({
        student: userId,
        course: courseId,
        moduleProgress: course.modules.map((mod) => ({
          moduleId: mod._id,
          isCompleted: false,
        })),
        totalLessons: course.modules.length,
        completedLessons: 0,
      });

      await progress.save();
    }

    res.status(200).json(progress);
  } catch (error) {
    console.error("❌ Error fetching user progress:", error);
    res.status(500).json({ message: "Error fetching user progress", error: error.message });
  }
};

/* =========================================================
   ✅ Toggle module completion (complete/incomplete)
   ========================================================= */
export const toggleModuleCompletion = async (req, res) => {
  try {
    const { courseId, moduleIndex } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    let progress = await Progress.findOne({ student: userId, course: courseId });
    if (!progress)
      return res.status(404).json({ message: "Progress not found for this course" });

    // Prevent unmarking if course is already completed
    if (progress.courseCompleted)
      return res
        .status(400)
        .json({ message: "Course already completed — cannot unmark modules" });

    const moduleProgress = progress.moduleProgress[moduleIndex];
    if (!moduleProgress)
      return res.status(404).json({ message: "Module progress not found" });

    // Toggle module completion
    moduleProgress.isCompleted = !moduleProgress.isCompleted;

    // Recalculate progress
    progress.completedLessons = progress.moduleProgress.filter((m) => m.isCompleted).length;
    progress.percentage =
      (progress.completedLessons / progress.moduleProgress.length) * 100;

    await progress.save();
    res.status(200).json({
      message: `Module ${moduleProgress.isCompleted ? "completed" : "incomplete"}`,
      progress,
    });
  } catch (error) {
    console.error("❌ Error toggling module completion:", error);
    res
      .status(500)
      .json({ message: "Error toggling module completion", error: error.message });
  }
};

/* =========================================================
   ✅ Mark entire course as completed
   ========================================================= */
export const completeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const progress = await Progress.findOne({ student: userId, course: courseId });
    if (!progress)
      return res.status(404).json({ message: "Progress not found for this course" });

    // Mark all modules completed
    progress.moduleProgress.forEach((m) => (m.isCompleted = true));
    progress.completedLessons = progress.moduleProgress.length;
    progress.percentage = 100;
    progress.courseCompleted = true;

    await progress.save();

    res.status(200).json({
      message: "🎉 Course marked as fully completed",
      progress,
    });
  } catch (error) {
    console.error("❌ Error completing course:", error);
    res.status(500).json({ message: "Error completing course", error: error.message });
  }
};
