import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // ✅ ensures cookies or credentials are sent
});

// ✅ Attach JWT token (if available) from localStorage to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Global error interceptor (optional, helps with debugging)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Redirecting to login...");
      // Optionally redirect to login page
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
