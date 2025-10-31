import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
          EDUFLEX
        </Link>

        <div className="flex items-center space-x-4">
          <Link className="text-sm hover:text-blue-600" to="/courses">
            Courses
          </Link>

          {role === "instructor" && (
            <Link className="text-sm hover:text-blue-600" to="/create-course">
              Create Course
            </Link>
          )}

          <Link className="text-sm hover:text-blue-600" to="/analytics">
            Analytics
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
