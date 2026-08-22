import axios from "axios";

export const API_BASE_URL = "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================
// ADD TOKEN TO REQUESTS
// ==========================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ==========================================
// HANDLE API RESPONSES
// ==========================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");

      // Only redirect if we are NOT already on login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

// ==========================================
// API ENDPOINTS
// ==========================================
export const endpoints = {
  faculty: "/faculty",
  announcements: "/announcements",
  media: "/media",
  departments: "/departments",
  results: "/results",
  principal: "/principal",

  auth: {
    login: "/auth/login",
  },
};
