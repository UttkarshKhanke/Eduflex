// routes/courseRoutes.js
import express from "express";
import multer from "multer";
import Course from "../models/Course.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getUserProgress,
  toggleModuleCompletion,
  completeCourse,
} from "../controllers/progressController.js";

const router = express.Router();

// 🔹 Store uploads in memory (MongoDB stores binary data)
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* =========================================================
   ✅ GET: Fetch all courses
   ========================================================= */
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("createdBy", "name email");

    const safeCourses = courses.map((course) => ({
      ...course._doc,
      modules: course.modules.map((mod) => ({
        ...mod,
        image: mod.image?.data ? { hasData: true } : mod.image,
        video: mod.video?.data ? { hasData: true } : mod.video,
      })),
    }));

    res.status(200).json({ courses: safeCourses });
  } catch (error) {
    console.error("❌ Error fetching courses:", error);
    res.status(500).json({ message: "Error fetching courses", error: error.message });
  }
});

/* =========================================================
   ✅ GET: Fetch single course by ID
   ========================================================= */
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("createdBy", "name email");
    if (!course) return res.status(404).json({ message: "Course not found" });

    const safeCourse = {
      ...course._doc,
      modules: course.modules.map((mod) => ({
        ...mod,
        image: mod.image?.data ? { hasData: true } : mod.image,
        video: mod.video?.data ? { hasData: true } : mod.video,
      })),
    };

    res.status(200).json(safeCourse);
  } catch (error) {
    console.error("❌ Error fetching course:", error);
    res.status(500).json({ message: "Error fetching course", error: error.message });
  }
});

/* =========================================================
   ✅ GET: Serve course image/video binary
   ========================================================= */
router.get("/:id/media/:type/:index", async (req, res) => {
  try {
    const { id, type, index } = req.params;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const module = course.modules[index];
    if (!module) return res.status(404).json({ message: "Module not found" });

    const file = type === "image" ? module.image : module.video;
    if (!file?.data) return res.status(404).json({ message: `${type} not found` });

    res.set("Content-Type", file.contentType);
    res.send(file.data);
  } catch (error) {
    console.error("❌ Error serving media:", error);
    res.status(500).json({ message: "Error serving media", error: error.message });
  }
});

/* =========================================================
   ✅ POST: Create a new Course
   ========================================================= */
router.post(
  "/create",
  verifyToken,
  upload.fields([{ name: "image" }, { name: "video" }]),
  async (req, res) => {
    try {
      const { title, description, modules } = req.body;
      if (!title) return res.status(400).json({ message: "Title is required" });

      let parsedModules = [];
      try {
        parsedModules = typeof modules === "string" ? JSON.parse(modules) : modules;
      } catch {
        parsedModules = [];
      }

      const formattedModules = parsedModules.map((mod, index) => {
        const uploadedImage = req.files?.image?.[index];
        const uploadedVideo = req.files?.video?.[index];

        return {
          name: mod.name || "Untitled Module",
          content:
            typeof mod.content === "string"
              ? mod.content.trim()
              : mod.content?.text?.trim() || "",
          image: uploadedImage
            ? {
                data: uploadedImage.buffer,
                contentType: uploadedImage.mimetype,
                filename: uploadedImage.originalname,
              }
            : mod.image
            ? { url: mod.image }
            : {},
          video: uploadedVideo
            ? {
                data: uploadedVideo.buffer,
                contentType: uploadedVideo.mimetype,
                filename: uploadedVideo.originalname,
              }
            : mod.video
            ? { url: mod.video }
            : {},
        };
      });

      const newCourse = new Course({
        title,
        description,
        modules: formattedModules,
        createdBy: req.user.id,
      });

      await newCourse.save();

      res.status(201).json({
        message: "✅ Course created successfully and stored in MongoDB",
        course: newCourse,
      });
    } catch (error) {
      console.error("❌ Error creating course:", error);
      res.status(500).json({ message: "Error creating course", error: error.message });
    }
  }
);

/* =========================================================
   ✏️ PUT: Edit/Update an existing Course
   ========================================================= */
router.put(
  "/:id",
  verifyToken,
  upload.fields([{ name: "image" }, { name: "video" }]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, modules } = req.body;

      const course = await Course.findById(id);
      if (!course) return res.status(404).json({ message: "Course not found" });
      if (course.createdBy.toString() !== req.user.id)
        return res.status(403).json({ message: "Unauthorized to edit this course" });

      let parsedModules = [];
      try {
        parsedModules = typeof modules === "string" ? JSON.parse(modules) : modules;
      } catch {
        parsedModules = [];
      }

      const updatedModules = parsedModules.map((mod, index) => {
        const uploadedImage = req.files?.image?.[index];
        const uploadedVideo = req.files?.video?.[index];

        return {
          name: mod.name || "Untitled Module",
          content:
            typeof mod.content === "string"
              ? mod.content.trim()
              : mod.content?.text?.trim() || "",
          image: uploadedImage
            ? {
                data: uploadedImage.buffer,
                contentType: uploadedImage.mimetype,
                filename: uploadedImage.originalname,
              }
            : mod.image
            ? { url: mod.image }
            : course.modules[index]?.image || {},
          video: uploadedVideo
            ? {
                data: uploadedVideo.buffer,
                contentType: uploadedVideo.mimetype,
                filename: uploadedVideo.originalname,
              }
            : mod.video
            ? { url: mod.video }
            : course.modules[index]?.video || {},
        };
      });

      course.title = title || course.title;
      course.description = description || course.description;
      course.modules = updatedModules;

      await course.save();
      res.status(200).json({ message: "✅ Course updated successfully", course });
    } catch (error) {
      console.error("❌ Error updating course:", error);
      res.status(500).json({ message: "Error updating course", error: error.message });
    }
  }
);

/* =========================================================
   ❌ DELETE: Remove a Course
   ========================================================= */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized to delete this course" });

    await Course.findByIdAndDelete(id);
    res.status(200).json({ message: "✅ Course deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting course:", error);
    res.status(500).json({ message: "Error deleting course", error: error.message });
  }
});

/* =========================================================
   🧩 PROGRESS ROUTES
   ========================================================= */

// ✅ Get progress of the current user for this course
router.get("/:courseId/progress", verifyToken, getUserProgress);

// ✅ Toggle module completion status
router.put("/:courseId/module/:moduleIndex", verifyToken, toggleModuleCompletion);

// ✅ Mark entire course as completed
router.put("/:courseId/complete", verifyToken, completeCourse);

export default router;
