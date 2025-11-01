import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();
const app = express();

// ✅ CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json({ limit: "10mb" })); // handles JSON payloads (including quizzes)
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // handles form data
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/quiz", quizRoutes); // Quiz routes

// ✅ Root route
app.get("/", (req, res) => {
  res.send("EDUFLEX backend running 🚀");
});

// ✅ Error handling middleware (for better debug)
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
