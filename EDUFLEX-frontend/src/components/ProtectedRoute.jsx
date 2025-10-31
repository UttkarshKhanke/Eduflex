import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toLowerCase();

  console.log("🔍 ProtectedRoute check =>", { token, role, allowedRoles });

  if (!token) {
    console.warn("🚫 No token found, redirecting to login");
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.map(r => r.toLowerCase()).includes(role)) {
    console.warn("🚫 Role not allowed:", role);
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

export default ProtectedRoute;
