// axiosClient.js
// single axios instance + auto-refresh logic for access token

import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE || "/api/";

// create the axios instance used for normal API calls
const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// helper to read tokens from localStorage (single source)
const getTokens = () => ({
  access: localStorage.getItem("accessToken"),
  refresh: localStorage.getItem("refreshToken"),
});

// helper to save tokens
const setTokens = ({ access, refresh }) => {
  if (access) localStorage.setItem("accessToken", access);
  if (refresh) localStorage.setItem("refreshToken", refresh);
};

// attach access token to every request when present
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Refresh logic variables ---
let isRefreshing = false;
let failedQueue = [];

// helper to process queued requests once refresh completes
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// response interceptor: if 401 — try refresh and retry original request
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // if no response or not 401, just reject
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // avoid infinite loop: if originalRequest._retry then logout redirect
    if (originalRequest._retry) {
      // second 401 -> force logout
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // mark request to avoid loops
    originalRequest._retry = true;

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      // no refresh token -> go to login
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // queue requests while a refresh is happening
    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = "Bearer " + token;
          return axiosClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    // start refresh flow
    isRefreshing = true;

    try {
      // direct call using axios to avoid interceptor recursion
      const response = await axios.post(`${BASE_URL}token/refresh/`, {
        refresh: refreshToken,
      });

      const newAccess = response.data.access;
      const newRefresh = response.data.refresh || refreshToken; // some backends only return access

      // save new tokens
      setTokens({ access: newAccess, refresh: newRefresh });

      // update queued requests
      processQueue(null, newAccess);

      // retry original request with new token
      originalRequest.headers.Authorization = "Bearer " + newAccess;
      return axiosClient(originalRequest);
    } catch (err) {
      processQueue(err, null);
      // refresh failed -> force logout
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosClient;
