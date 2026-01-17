// src/api/axios.js
import axios from "axios";

let aToken = null;

export const setAccessToken = (token) => {
  aToken = token;
  console.log(aToken);
};

const api = axios.create({
  baseURL: `http://localhost:5000/api`,
  withCredentials: true
});

// Request interceptor (attach token)
api.interceptors.request.use(
  (config) => {
    const token = aToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (refresh on 401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const response=await api.put("/auth/refresh", null);
        const { accessToken } = response.data;
        setAccessToken(accessToken);
        return api(originalRequest);
      } catch (err) {
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
