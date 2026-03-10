import axios from "axios";
import { getToken, clearAuth } from "../../utils/storage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const isAuthEndpoint = url.includes("/auth/");
    if (error.response?.status === 401 && !isAuthEndpoint) {
      clearAuth();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
