// src/lib/api.js
import axios from "axios";

const isDev = import.meta.env.DEV;

// Use Railway URL by default, localhost only in development
const baseURL = isDev
  ? "http://localhost:5000"
  : import.meta.env.VITE_API_URL || "https://final-project-group4-webdevt-backend-production-48cb.up.railway.app";

const api = axios.create({
  baseURL,
  timeout: 30000, // Increased timeout to 30 seconds
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Development logging
if (isDev) {
  api.interceptors.request.use((cfg) => {
    console.log(`[API] ${cfg.method?.toUpperCase()} ${cfg.url}`);
    console.log(`[API] Full URL: ${cfg.baseURL}${cfg.url}`);
    return cfg;
  });
}

// Enhanced error logging
api.interceptors.response.use(
  (r) => r,
  (e) => {
    console.error("[API Error]", e.response?.data || e.message);
    console.error("[API Error] Status:", e.response?.status);
    console.error("[API Error] URL:", e.config?.url);
    console.error("[API Error] Base URL:", e.config?.baseURL);
    
    // Log CORS errors specifically
    if (!e.response) {
      console.error("[API Error] This might be a CORS or network error");
    }
    
    return Promise.reject(e);
  }
);

// Auth token management
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log("[API] Auth token set");
  } else {
    delete api.defaults.headers.common["Authorization"];
    console.log("[API] Auth token removed");
  }
};

export const removeAuthToken = () => {
  delete api.defaults.headers.common["Authorization"];
  console.log("[API] Auth token cleared");
};

// User endpoints
export const registerUser = (data) => api.post("/api/users/register", data);
export const loginUser = (data) => api.post("/api/users/login", data);
export const getProfile = () => api.get("/api/users/profile");
export const checkCredential = (c) =>
  api.get("/api/users/check-credential", { params: { credential: c } });

// Book endpoints
export const searchBooks = (query, maxResults = 20) =>
  api.get("/api/books/search", { params: { query, maxResults } });

export const getBooksByCategory = (category, maxResults = 20) =>
  api.get(`/api/books/category/${category}`, { params: { maxResults } });

export const getBookById = (id) => api.get(`/api/books/${id}`);

export const getFeaturedBooks = () => api.get("/api/books/featured");

export const saveBook = (bookData) => api.post("/api/books/save", bookData);

export default api;