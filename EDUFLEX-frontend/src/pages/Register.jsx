import { useState } from "react";
import api from "../api/apiClient";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", { name, email, password, role });
      const token = res.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4 text-center">Create an account</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="border p-2 w-full mb-3 rounded"
          required
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          required
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3 rounded"
          required
        />

        <div className="mb-4">
          <label className="mr-3 text-sm">Role:</label>
          <label className="mr-3">
            <input
              type="radio"
              name="role"
              value="student"
              checked={role === "student"}
              onChange={() => setRole("student")}
              className="mr-1"
            />
            Student
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="instructor"
              checked={role === "instructor"}
              onChange={() => setRole("instructor")}
              className="mr-1"
            />
            Instructor
          </label>
        </div>

        <button className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
          Register
        </button>

        <p className="text-sm mt-3 text-center">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 underline"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}
