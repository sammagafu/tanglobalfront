import { defineStore } from 'pinia';
import apiService from '@/services/apiService';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken') || '',
    refreshToken: localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken') || '',
    rememberMe: localStorage.getItem('rememberMe') === 'true' || false,
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null,
    authError: null,  // Add state to store authentication errors
  }),

  getters: {
    isAuthenticated(state) {
      return !!state.accessToken;
    },
    getAccessToken(state) {
      return state.accessToken;
    },
    getRefreshToken(state) {
      return state.refreshToken;
    },
    getUser(state) {
      return state.user;
    },
    getAuthError(state) {
      return state.authError;  // Getter for authentication errors
    }
  },

  actions: {
    async login(email, password, rememberMe) {
      const router = useRouter();
      this.authError = null;  // Clear previous errors
      try {
        const response = await apiService.post('auth/token/', { email, password });
        this.setTokens(response.data.access, response.data.refresh, rememberMe);
        apiService.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;

        const userResponse = await apiService.get('auth/users/me/');
        this.setUser(userResponse.data);

        router.push({ name: 'dashboard' });
      } catch (error) {
        console.error('Login error:', error);
        if (error.response && error.response.status === 400) {
          this.authError = 'Invalid email or password.';
        } else if (error.response && error.response.status === 404) {
          this.authError = 'User not found.';
        } else {
          this.authError = 'An unexpected error occurred. Please try again.';
        }
        throw error;
      }
    },

    logout() {
      this.accessToken = '';
      this.refreshToken = '';
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('user');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('user');
      delete apiService.defaults.headers.common['Authorization'];
      this.clearUser();
    },

    setTokens(accessToken, refreshToken, rememberMe) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.rememberMe = rememberMe;

      if (rememberMe) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('rememberMe', 'true');
      } else {
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('refreshToken', refreshToken);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('rememberMe');
      }
    },

    setUser(userData) {
      this.user = userData;
      if (this.rememberMe) {
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        sessionStorage.setItem('user', JSON.stringify(userData));
      }
    },

    clearUser() {
      this.user = null;
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
    },
  },
});