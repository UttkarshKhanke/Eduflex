import { useState } from "react";
import { motion } from "framer-motion";
import api from "../api/apiClient";
import { useNavigate } from "react-router-dom";
import { UserPlus2 } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });
      const token = res.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 overflow-hidden">
    {/* Decorative blurred circles for depth */}
    <div className="absolute top-20 left-10 w-64 h-64 bg-white opacity-20 rounded-full blur-3xl"></div>
    <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-300 opacity-25 rounded-full blur-3xl"></div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white/25 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-96 border border-white/40"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-white/30 p-3 rounded-full mb-3">
            <UserPlus2 className="text-white" size={36} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Create Your Account 🚀
          </h2>
          <p className="text-white/80 text-sm mt-1">
            Join EduFlex and start your learning journey today.
          </p>
        </div>

        {/* Form Inputs */}
        <motion.input
          whileFocus={{ scale: 1.03 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          className="w-full mb-4 px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
          required
        />

        <motion.input
          whileFocus={{ scale: 1.03 }}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="w-full mb-4 px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
          required
        />

        <motion.input
          whileFocus={{ scale: 1.03 }}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full mb-6 px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
          required
        />

        {/* Role Selection */}
        <div className="mb-6 text-center">
          <span className="text-white/90 font-medium text-sm mr-3">
            Select Role:
          </span>
          <label className="mr-4 text-white/80">
            <input
              type="radio"
              name="role"
              value="student"
              checked={role === "student"}
              onChange={() => setRole("student")}
              className="mr-1 accent-indigo-600"
            />
            Student
          </label>
          <label className="text-white/80">
            <input
              type="radio"
              name="role"
              value="instructor"
              checked={role === "instructor"}
              onChange={() => setRole("instructor")}
              className="mr-1 accent-indigo-600"
            />
            Instructor
          </label>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 hover:opacity-90 transition ${
            loading && "opacity-70 cursor-not-allowed"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </motion.button>

        {/* Footer */}
        <p className="text-white/70 text-center text-sm mt-6">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-white font-medium hover:underline"
          >
            Login here
          </button>
        </p>
      </motion.form>
    </div>
  );
}
