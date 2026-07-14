import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://fake-checkai-8.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR
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

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    api.interceptors.response.use(
      (response) => response,
      (error) => {
        const isGuest = localStorage.getItem("guest") === "true";

        if (error.response?.status === 401 && !isGuest) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          window.location.href = "/login";
        }

        return Promise.reject(error);
      }
    );

    return Promise.reject(error);
  }
);

export default api;