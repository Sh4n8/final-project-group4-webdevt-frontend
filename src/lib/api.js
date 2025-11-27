// src/lib/api.js
import axios from "axios";

const isDev = import.meta.env.DEV;


const baseURL = isDev
  ? "http://localhost:5000" // Use full URL in dev for proper CORS
  : import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL,
  timeout: 12_000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Added for credentials support
});

if (isDev) {
  api.interceptors.request.use((cfg) => {
    console.log(`[API] ${cfg.method?.toUpperCase()} ${cfg.url}`);
    console.log(`[API] Full URL: ${cfg.baseURL}${cfg.url}`);
    return cfg;
  });
}

api.interceptors.response.use(
  (r) => r,
  (e) => {
    console.error("[API Error]", e.response?.data || e.message);
    console.error("[API Error] Status:", e.response?.status);
    console.error("[API Error] URL:", e.config?.url);
    return Promise.reject(e);
  }
);

// Auth token management
export const setAuthToken = (token) => {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
};

export const removeAuthToken = () =>
  delete api.defaults.headers.common["Authorization"];

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