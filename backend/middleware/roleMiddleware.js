// backend/middleware/roleMiddleware.js

/**
 * Middleware to allow only instructors
 */
export const instructorOnly = (req, res, next) => {
  if (req.user && req.user.role === "instructor") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied: Instructors only" });
  }
};

/**
 * Middleware to allow only students
 */
export const studentOnly = (req, res, next) => {
  if (req.user && req.user.role === "student") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied: Students only" });
  }
};

/**
 * Middleware to allow specific roles (if needed)
 * Example usage: authorizeRoles("admin", "instructor")
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: "Access denied: Unauthorized role" });
    }
    next();
  };
};
