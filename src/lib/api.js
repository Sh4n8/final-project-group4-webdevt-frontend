// src/lib/api.js
import axios from "axios";

/* --------------------------------------------------------------
   1. BASE URL
   dev  → /api  → Vite proxy → http://localhost:5000
   prod → full URL from .env
   -------------------------------------------------------------- */
const isDev = import.meta.env.DEV;
const baseURL = isDev
  ? "/api" // <-- Vite proxy
  : import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  timeout: 12_000,
  headers: { "Content-Type": "application/json" },
});

/* --------------------------------------------------------------
   2. DEV LOGGING
   -------------------------------------------------------------- */
if (isDev) {
  api.interceptors.request.use((cfg) => {
    console.log(`[API] ${cfg.method?.toUpperCase()} ${cfg.url}`);
    return cfg;
  });
}

/* --------------------------------------------------------------
   3. GLOBAL ERROR HANDLER
   -------------------------------------------------------------- */
api.interceptors.response.use(
  (r) => r,
  (e) => {
    console.error("[API Error]", e.response?.data || e.message);
    return Promise.reject(e);
  }
);

/* --------------------------------------------------------------
   4. AUTH TOKEN HELPERS
   -------------------------------------------------------------- */
export const setAuthToken = (token) => {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
};
export const removeAuthToken = () =>
  delete api.defaults.headers.common["Authorization"];

/* --------------------------------------------------------------
   5. USER ENDPOINTS (used by AuthContext)
   -------------------------------------------------------------- */
export const registerUser = (data) => api.post("/users/register", data);
export const loginUser = (data) => api.post("/users/login", data);
export const getProfile = () => api.get("/users/profile");
export const checkCredential = (c) =>
  api.get("/users/check-credential", { params: { credential: c } });

/* --------------------------------------------------------------
   6. BOOK ENDPOINTS (your library UI)
   -------------------------------------------------------------- */
export const searchBooks = (category) =>
  api.get("/books/search", { params: { category } });
export const getBookById = (id) => api.get(`/books/${id}`);

export default api;
