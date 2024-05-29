// src/apiService.js
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
const baseURL = 'http://localhost:8000/api/v1/'

const axiosInstance = axios.create({
  baseURL: baseURL
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore();
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(`${baseURL}auth/token/refresh/`, {
          refresh: authStore.refreshToken,
        });
        const newToken = response.data.access;
        authStore.setTokens(newToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (e) {
        authStore.logout();
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
