import { useEffect, useState } from "react";
import api from "../api/apiClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .get("/analytics/instructor")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!data)
    return (
      <div className="flex justify-center items-center h-[70vh] bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500"></div>
      </div>
    );

  const chartData = [
    { name: "Courses", value: data.totalCourses },
    { name: "Students", value: data.totalStudents },
    { name: "Quizzes", value: data.totalQuizzes },
  ];

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
          Instructor Analytics
        </h1>
        <p className="text-gray-600 mt-2">
          Visualize your teaching impact and student engagement.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          {
            title: "Total Courses",
            value: data.totalCourses,
            color: "from-blue-500 to-indigo-500",
          },
          {
            title: "Total Students",
            value: data.totalStudents,
            color: "from-green-400 to-emerald-500",
          },
          {
            title: "Total Quizzes",
            value: data.totalQuizzes,
            color: "from-purple-500 to-pink-500",
          },
          {
            title: "Avg. Performance",
            value: `${data.avgPerformance}%`,
            color: "from-yellow-400 to-orange-500",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4 shadow-md`}
            >
              <span className="text-white font-bold text-lg">
                {stat.value.toString().charAt(0)}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wide">
              {stat.title}
            </h3>
            <p
              className={`text-3xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mt-1`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Platform Overview
        </h2>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
            <YAxis tick={{ fill: "#6b7280" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
              }}
            />
            <Legend />
            <Bar
              dataKey="value"
              fill="url(#colorGradient)"
              radius={[8, 8, 0, 0]}
              barSize={50}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity={1} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.8} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
