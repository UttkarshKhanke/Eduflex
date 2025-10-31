import { TrendingUp, BookOpen, ClipboardCheck } from "lucide-react";

function Dashboard() {
  const stats = [
    {
      title: "Courses Enrolled",
      value: "5",
      colorFrom: "from-indigo-600",
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

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-800">Welcome Back 👋</h2>
        <p className="text-gray-500 mt-2">
          Here’s a quick snapshot of your learning progress and achievements.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`bg-gradient-to-r ${stat.colorFrom} ${stat.colorTo} text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden`}
          >
            {/* Soft Glow Effect */}
            <div className="absolute inset-0 bg-white opacity-10 blur-2xl"></div>

            {/* Content */}
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium opacity-90">{stat.title}</h3>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Divider Line */}
      <div className="border-t border-gray-200 my-12"></div>

      {/* Suggestion / Next Steps */}
      <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 hover:shadow-lg transition-all duration-300">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">
          Continue Your Learning Journey 🚀
        </h3>
        <p className="text-gray-600 mb-6">
          Dive back into your enrolled courses, take fresh quizzes, and explore
          analytics to track your performance in real-time.
        </p>

        <div className="flex flex-wrap gap-4">
          <button className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 hover:scale-[1.02] transition-all duration-300">
            Go to Courses
          </button>
          <button className="bg-gradient-to-r from-green-500 to-emerald-400 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 hover:scale-[1.02] transition-all duration-300">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
