export default function Unauthorized() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied 🚫</h1>
      <p className="text-gray-600 mb-6">You are not authorized to view this page.</p>
      <a href="/dashboard" className="text-indigo-600 hover:underline font-medium">
        Go Back to Dashboard
      </a>
    </div>
  );
}
