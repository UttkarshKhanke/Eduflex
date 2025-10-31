import { TrendingUp, BookOpen, ClipboardCheck, Layers, FileQuestion } from "lucide-react";

function Dashboard() {
  const role = localStorage.getItem("role");

  const studentStats = [
    {
      title: "Courses Enrolled",
      value: "5",
      colorFrom: "from-indigo-500",
      colorTo: "to-blue-500",
      icon: <BookOpen size={28} />,
    },
    {
      title: "Quizzes Completed",
      value: "12",
      colorFrom: "from-cyan-500",
      colorTo: "to-sky-400",
      icon: <ClipboardCheck size={28} />,
    },
    {
      title: "Overall Progress",
      value: "78%",
      colorFrom: "from-green-500",
      colorTo: "to-emerald-400",
      icon: <TrendingUp size={28} />,
    },
  ];

  const instructorStats = [
    {
      title: "Courses Created",
      value: "8",
      colorFrom: "from-purple-500",
      colorTo: "to-pink-500",
      icon: <Layers size={28} />,
    },
    {
      title: "Quizzes Created",
      value: "15",
      colorFrom: "from-amber-500",
      colorTo: "to-orange-400",
      icon: <FileQuestion size={28} />,
    },
  ];

  const stats = role === "instructor" ? instructorStats : studentStats;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-800">
          Welcome Back 👋 {role === "instructor" ? "Instructor" : "Learner"}
        </h2>
        <p className="text-gray-500 mt-2">
          {role === "instructor"
            ? "Manage your created courses and quizzes here."
            : "Here’s a quick overview of your learning progress today."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`bg-gradient-to-r ${stat.colorFrom} ${stat.colorTo} text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden`}
          >
            <div className="absolute inset-0 opacity-20 bg-white rounded-2xl blur-xl"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">{stat.title}</h3>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-12 bg-white rounded-2xl shadow-md p-8 border border-gray-100 hover:shadow-lg transition-all">
        {role === "instructor" ? (
          <>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              Manage Your Teaching Portal 🎓
            </h3>
            <p className="text-gray-600 mb-6">
              Create new courses and quizzes, and monitor your teaching performance.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition">
                Go to Courses
              </button>
              <button className="bg-gradient-to-r from-amber-500 to-orange-400 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition">
                Manage Quizzes
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              Continue Your Learning Journey 🚀
            </h3>
            <p className="text-gray-600 mb-6">
              Jump back into your enrolled courses, take new quizzes, and track your performance in real-time.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition">
                Go to Courses
              </button>
              <button className="bg-gradient-to-r from-green-500 to-emerald-400 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition">
                View Analytics
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
