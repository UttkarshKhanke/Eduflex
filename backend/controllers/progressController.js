import Progress from "../models/Progress.js";

// Get progress for a student
export const getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ student: req.user.id })
      .populate("course", "title")
      .populate("quiz", "title");
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get progress for a course (Instructor view)
export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const progress = await Progress.find({ course: courseId }).populate("student", "name email");
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
