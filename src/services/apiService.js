// apiService.js
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'vue-router';

const baseURL = 'https://tanglobal.co.tz/api/v1/';

const axiosInstance = axios.create({
  baseURL: baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const authStore = useAuthStore();
    const originalRequest = error.config;
    const router = useRouter();

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (authStore.refreshToken) {
        try {
          // Attempt to refresh the access token using the refresh token
          const response = await axios.post(`${baseURL}auth/token/refresh/`, {
            refresh: authStore.refreshToken,
          });
          const newToken = response.data.access;
          // Update tokens in the store and headers
          authStore.setTokens(newToken, authStore.refreshToken, authStore.rememberMe);
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

          // Retry the original request with the new token
          return axiosInstance(originalRequest);
        } catch (e) {
          // If the token refresh fails, logout and redirect to login page
          authStore.logout();
          router.push({ name: 'login' });
          return Promise.reject(e);
        }
      } else {
        authStore.logout();
        router.push({ name: 'login' });
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;