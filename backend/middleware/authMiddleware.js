// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware to verify JWT token and attach full user info
 */
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the full user object including role for consistent access
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // ✅ Contains _id, name, email, and role
    next();
  } catch (error) {
    console.error("❌ JWT verification failed:", error.message);
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

/**
 * Alias: `protect`
 */
export const protect = verifyToken;

/**
 * Role-based access control
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: insufficient permissions" });
    }
    next();
  };
};

/**
 * Instructor-only route protection
 */
export const instructorOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "instructor") {
    return res.status(403).json({ message: "Access restricted to instructors only" });
  }
  next();
};

/**
 * Student-only route protection
 */
export const studentOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "student") {
    return res.status(403).json({ message: "Access restricted to students only" });
  }
  next();
};
