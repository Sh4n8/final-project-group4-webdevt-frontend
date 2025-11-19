import axios from "axios";

const isDev = import.meta.env.DEV;
const apiUrl = isDev
  ? "/api" // Vite dev server proxy
  : import.meta.env.VITE_API_URL ||
    "https://final-project-group4-webdev-backend-production.up.railway.app";

const api = axios.create({
  baseURL: apiUrl,
  timeout: 12000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Log requests in dev
if (isDev) {
  api.interceptors.request.use((cfg) => {
    console.log(`[API] ${cfg.method?.toUpperCase()} ${cfg.url}`);
    return cfg;
  });
}

// Response interceptor for errors
api.interceptors.response.use(
  (r) => r,
  (e) => {
    console.error("[API Error]", e.response?.data || e.message);
    return Promise.reject(e);
  }
);

// Auth helpers
export const setAuthToken = (token) => {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
};

export const removeAuthToken = () =>
  delete api.defaults.headers.common["Authorization"];

// ====================
// UPDATED USER ROUTES
// ====================
export const registerUser = (data) => api.post("/api/users/register", data);
export const loginUser = (data) => api.post("/api/users/login", data);
export const getProfile = () => api.get("/api/users/profile");
export const checkCredential = (c) =>
  api.get("/api/users/check-credential", { params: { credential: c } });

// ====================
// UPDATED BOOK ROUTES
// ====================
export const searchBooks = (query, maxResults = 20) =>
  api.get("/api/books/search", { params: { query, maxResults } });

export const getBooksByCategory = (category, maxResults = 20) =>
  api.get(`/api/books/category/${category}`, { params: { maxResults } });

export const getBookById = (id) => api.get(`/api/books/${id}`);

export const getFeaturedBooks = () => api.get("/api/books/featured");

export const saveBook = (bookData) => api.post("/api/books/save", bookData);

export default api;
