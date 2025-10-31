import { useEffect, useState } from "react";
import api from "../api/apiClient";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const role = localStorage.getItem("role");

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
    else {
      // try fetch profile
      api.get("/auth/profile")
        .then((res) => {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        })
        .catch(() => {});
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-4">Welcome to EDUFLEX</h1>

        {user && (
          <div className="bg-white p-4 rounded shadow-sm mb-6">
            <p className="font-medium">Hello, {user.name}</p>
            <p className="text-sm text-gray-600">Role: {role}</p>
            <p className="text-sm text-gray-600">Email: {user.email}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Courses</h3>
            <p className="text-sm mt-2">Browse and enroll in available courses.</p>
            <Link to="/courses" className="mt-3 inline-block text-blue-600 underline">
              Go to Courses
            </Link>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Quizzes</h3>
            <p className="text-sm mt-2">Attempt course quizzes and track your score.</p>
            <Link to="/quizzes" className="mt-3 inline-block text-blue-600 underline">
              Go to Quizzes
            </Link>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Analytics</h3>
            <p className="text-sm mt-2">Instructor analytics and insights.</p>
            <Link to="/analytics" className="mt-3 inline-block text-blue-600 underline">
              View Analytics
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
