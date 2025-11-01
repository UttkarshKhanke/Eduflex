import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CreateCourse from "./pages/CreateCourse";
import EditCourse from "./pages/EditCourse";
import CourseDetail from "./pages/CourseDetail";
import Unauthorized from "./pages/Unauthorized";
import QuizAttempt from "./pages/QuizAttempt";

// 🧩 Quiz Pages
import QuizList from "./pages/QuizList.jsx";
import QuizCreate from "./pages/QuizCreate.jsx";
import QuizDetail from "./pages/Quiz.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/quiz/:id" element={<QuizAttempt />} />

        {/* 🧩 Quiz Routes */}
        <Route
          path="/quiz"
          element={
            <ProtectedRoute allowedRoles={["student", "instructor"]}>
              <>
                <Navbar />
                <QuizList />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/create"
          element={
            <ProtectedRoute allowedRoles={["instructor"]}>
              <>
                <Navbar />
                <QuizCreate />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:id"
          element={
            <ProtectedRoute allowedRoles={["student", "instructor"]}>
              <>
                <Navbar />
                <QuizDetail />
              </>
            </ProtectedRoute>
          }
        />

        {/* 🔐 Protected Routes (Student + Instructor) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student", "instructor"]}>
              <>
                <Navbar />
                <Dashboard />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses"
          element={
            <ProtectedRoute allowedRoles={["student", "instructor"]}>
              <>
                <Navbar />
                <Courses />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute allowedRoles={["student", "instructor"]}>
              <>
                <Navbar />
                <CourseDetail />
              </>
            </ProtectedRoute>
          }
        />

        {/* 🧑‍🏫 Instructor Only */}
        <Route
          path="/create-course"
          element={
            <ProtectedRoute allowedRoles={["instructor"]}>
              <>
                <Navbar />
                <CreateCourse />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["instructor"]}>
              <>
                <Navbar />
                <EditCourse />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
