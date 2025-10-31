import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Courses", path: "/courses" },
    { name: "Quiz", path: "/quiz" },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand Logo */}
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
          EDUFLEX
        </h1>

        {/* Nav Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`font-medium transition ${
                location.pathname === item.path
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-indigo-500"
              }`}
            >
              {item.name}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="ml-4 bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all hover:scale-[1.03]"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button (Hamburger) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-3 py-1.5 rounded-md text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
