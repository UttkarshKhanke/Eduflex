// backend/controllers/authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

/**
 * Utility — Create JWT Token
 */
const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

/**
 * REGISTER USER
 * Route: POST /api/auth/register
 * Body: { name, email, password, role }
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate fields
    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "All fields are required" });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Validate role
    const validRoles = ["student", "instructor"];
    if (!validRoles.includes(role.toLowerCase()))
      return res.status(400).json({ message: "Invalid role. Must be student or instructor" });

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role.toLowerCase(),
    });

    await user.save();

    // Generate JWT
    const token = createToken(user._id, user.role);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

/**
 * LOGIN USER
 * Route: POST /api/auth/login
 * Body: { email, password }
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create token
    const token = createToken(user._id, user.role);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "Error logging in", error: error.message });
  }
};

/**
 * GET PROFILE
 * Route: GET /api/auth/profile
 * Header: Authorization: Bearer <token>
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ message: "Not authenticated" });

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    console.error("GetProfile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
