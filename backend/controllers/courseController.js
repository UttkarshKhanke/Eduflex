// backend/controllers/courseController.js
import Course from "../models/Course.js";

/**
 * Create a new course
 */
export const createCourse = async (req, res) => {
  try {
    const { title, description, modules } = req.body;

    if (!title || !modules || modules.length === 0) {
      return res.status(400).json({ message: "Title and at least one module are required" });
    }

    const instructorId = req.user?.id;
    if (!instructorId) {
      return res.status(401).json({ message: "Unauthorized: Missing instructor ID" });
    }

    // ✅ Sanitize module data to ensure proper structure
    const formattedModules = modules.map((m) => ({
      name: m.name || "Untitled Module",
      content: m.content || "",
      image: m.image || "",
      video: m.video || "",
    }));

    const newCourse = new Course({
      title,
      description,
      modules: formattedModules,
      createdBy: instructorId,
      createdAt: new Date(),
    });

    await newCourse.save();

    res.status(201).json({
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error("❌ Error creating course:", error);
    res.status(500).json({ message: "Error creating course", error: error.message });
  }
};

/**
 * Get all courses
 */
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error: error.message });
  }
};

import Course from "../models/Course.js";

// ✅ Update course
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, modules } = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { title, description, modules },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course updated successfully", course: updatedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update course" });
  }
};

// ✅ Delete course
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCourse = await Course.findByIdAndDelete(id);
    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete course" });
  }
};


/**
 * Get course by ID
 */
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("createdBy", "name email");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course details:", error);
    res.status(500).json({ message: "Error fetching course details", error: error.message });
  }
};
