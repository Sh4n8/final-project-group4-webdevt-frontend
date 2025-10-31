import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

if (import.meta.env.DEV) {
  api.interceptors.request.use((cfg) => {
    return cfg;
  });
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    return Promise.reject(err);
  }
);

export function setAuthToken(token) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

export function removeAuthToken() {
  delete api.defaults.headers.common["Authorization"];
}

export default api;
