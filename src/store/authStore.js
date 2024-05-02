import { defineStore } from 'pinia';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    rememberMe: localStorage.getItem('rememberMe') === 'true',
    user: localStorage.getItem('user') || null,
  }),

  getters: {
    isAuthenticated() {
      return this.accessToken !== null;
    },
    getAccessToken() {
      return this.accessToken;
    },
    getRefreshToken() {
      return this.refreshToken;
    },
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
    },

    clearTokens() {
      this.accessToken = null;
      this.refreshToken = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('rememberMe');
    },
    setUser(userData) {
      this.user = userData;
      localStorage.setItem('user',JSON.stringify(userData))
    },
    clearUser() {
      this.user = null;
    },
  },
});
