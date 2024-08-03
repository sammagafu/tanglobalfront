import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'vue-router';

const baseURL = 'http://localhost:8000/api/v1/';

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
          const response = await axios.post(`${baseURL}auth/token/refresh/`, {
            refresh: authStore.refreshToken,
          });
          const newToken = response.data.access;
          authStore.setTokens(newToken, authStore.refreshToken, authStore.rememberMe);
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } catch (e) {
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