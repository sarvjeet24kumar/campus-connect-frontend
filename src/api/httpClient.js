import axios from 'axios';

import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from './tokenManager.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createHttpClient = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    config => {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );

  let isRefreshing = false;
  let failedQueue = [];

  const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  instance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return instance(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          clearTokens();
          processQueue(error, null);
          isRefreshing = false;
          return Promise.reject(error);
        }

        try {
          const response = await axios.post('/api/auth/token/refresh/', {
            refresh: refreshToken,
          });
          const { access } = response.data;
          const newRefreshToken = response.data.refresh || refreshToken;
          setTokens(access, newRefreshToken);
          processQueue(null, access);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          isRefreshing = false;
          return instance(originalRequest);
        } catch (refreshError) {
          clearTokens();
          processQueue(refreshError, null);
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};
