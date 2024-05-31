import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import apiService from '@/services/apiService'; 

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken') || '',
    refreshToken: localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken') || '',
    rememberMe: localStorage.getItem('rememberMe') === 'true' || false,
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null,
  }),

  getters: {
    isAuthenticated() {
      return !!this.accessToken;
    },
    getAccessToken() {
      return this.accessToken;
    },
    getRefreshToken() {
      return this.refreshToken;
    },
    getUser() {
      return this.user;
    }
  },

  actions: {
    async login(email, password, rememberMe) {
      try {
        const response = await apiService.post('auth/token/', {
          email,
          password,
        });
        this.setTokens(response.data.access, response.data.refresh, rememberMe);
        apiService.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;

        // Assuming you might get user information during login
        const userResponse = await apiService.get('auth/users/me/');
        this.setUser(userResponse.data);
      } catch (error) {
        console.error('Login error:', error);
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
      this.user = null;
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
