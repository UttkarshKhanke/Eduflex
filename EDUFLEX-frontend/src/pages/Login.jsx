import { useState } from "react";
import api from "../api/apiClient";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      // ✅ Store user details in localStorage properly
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user?.role?.toLowerCase()); // <-- fixed line
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // alert(`Welcome back, ${res.data.user.name || "User"}!`);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 animate-gradient-move">
      {/* Background Accent Lights */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-white opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-300 opacity-25 rounded-full blur-3xl animate-pulse"></div>

      {/* Login Card */}
      <form
        onSubmit={handleSubmit}
        className="relative bg-white/15 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl p-8 w-[22rem] sm:w-96 transition-all hover:shadow-indigo-200/40"
      >
        {/* Logo + Heading */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gradient-to-r from-indigo-400 to-blue-500 p-3 rounded-full mb-3 shadow-md shadow-indigo-400/40">
            <GraduationCap className="text-white" size={34} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Welcome to EduFlex
          </h2>
          <p className="text-white/80 text-sm mt-1">
            Please log in to continue your journey.
          </p>
        </div>

        {/* Input Fields */}
        <div className="space-y-4 mt-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 mt-2 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-500 shadow-md shadow-indigo-400/30 hover:opacity-90 hover:scale-[1.02] transition-all duration-300 ${
              loading && "opacity-70 cursor-not-allowed"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        {/* Register Link */}
        <p className="text-white/80 text-center text-sm mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-white font-semibold hover:underline hover:text-blue-200 transition"
          >
            Register
          </Link>
        </p>
      </form>

      {/* Gradient Animation */}
      <style>{`
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradient-move 8s ease infinite;
        }
      `}</style>
    </div>
  );
}
