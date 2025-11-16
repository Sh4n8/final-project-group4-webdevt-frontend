// src/lib/api.js
import axios from "axios";

const isDev = import.meta.env.DEV;
const baseURL = isDev
  ? "/api" 
  : import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  timeout: 12_000,
  headers: { "Content-Type": "application/json" },
});


if (isDev) {
  api.interceptors.request.use((cfg) => {
    console.log(`[API] ${cfg.method?.toUpperCase()} ${cfg.url}`);
    return cfg;
  });
}


api.interceptors.response.use(
  (r) => r,
  (e) => {
    console.error("[API Error]", e.response?.data || e.message);
    return Promise.reject(e);
  }
);


export const setAuthToken = (token) => {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
};
export const removeAuthToken = () =>
  delete api.defaults.headers.common["Authorization"];


export const registerUser = (data) => api.post("/users/register", data);
export const loginUser = (data) => api.post("/users/login", data);
export const getProfile = () => api.get("/users/profile");
export const checkCredential = (c) =>
  api.get("/users/check-credential", { params: { credential: c } });


export const searchBooks = (query, maxResults = 20) =>
  api.get("/books/search", { params: { query, maxResults } });

export const getBooksByCategory = (category, maxResults = 20) =>
  api.get(`/books/category/${category}`, { params: { maxResults } });

export const getBookById = (id) => api.get(`/books/${id}`);

export const getFeaturedBooks = () => api.get("/books/featured");

export const saveBook = (bookData) => api.post("/books/save", bookData);

export default api;
