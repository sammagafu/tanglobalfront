import { defineStore } from 'pinia';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    rememberMe: localStorage.getItem('rememberMe') === 'true',
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    isAuthenticated: localStorage.getItem('accessToken') !== null,
  }),

  getters: {
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
    setTokens(accessToken, refreshToken, rememberMe) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      this.isAuthenticated = true;
    },

    clearTokens() {
      this.accessToken = null;
      this.refreshToken = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('rememberMe');
      this.isAuthenticated = false;
    },

    setUser(userData) {
      this.user = userData;
      localStorage.setItem('user', JSON.stringify(userData));
    },

    clearUser() {
      this.user = null;
      localStorage.removeItem('user');
    },
  },
});
