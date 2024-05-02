// apiService.js
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const baseURL = 'http://localhost:8000/api/v1/'
const apiService = axios.create({
  baseURL: baseURL, // Adjust the base URL as per your backend API
});

const setupInterceptors = () => {
  // Request interceptor to attach the access token to outgoing requests
  apiService.interceptors.request.use(
    config => {
      const accessToken = useAuthStore().accessToken?.value; // Check if accessToken exists
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle access token expiration and refresh token
  apiService.interceptors.response.use(
    response => {
      return response;
    },
    async error => {
      const originalRequest = error.config;
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          // Attempt to refresh the access token using the refresh token
          const refreshToken = useAuthStore().refreshToken?.value; // Check if refreshToken exists
          console.log('Refresh token:', refreshToken); // Log refresh token
          if (!refreshToken) {
            throw new Error('Refresh token is missing');
          }
          const response = await axios.post(`${baseURL}auth/token/refresh/`, {
            refresh: refreshToken,
          });
          const newAccessToken = response.data.accessToken;
          useAuthStore().setAccessToken(newAccessToken, false); // assuming rememberMe is false
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // If refresh fails, logout the user
          useAuthStore().clearTokens();
          // Redirect to login or handle as needed
          console.error('Error refreshing access token:', refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};

setupInterceptors();

export default apiService;
