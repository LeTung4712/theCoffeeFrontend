import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null,
    accessToken: localStorage.getItem("access_token") || null,
    refreshToken: localStorage.getItem("refresh_token") || null,
    isAuthenticated: !!localStorage.getItem("access_token"),
  }),

  actions: {
    login(userData, tokens) {
      this.user = userData;
      this.accessToken = tokens.access_token;
      this.refreshToken = tokens.refresh_token;
      this.isAuthenticated = true;

      // Lưu vào localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("access_token", tokens.access_token);
      localStorage.setItem("refresh_token", tokens.refresh_token);
    },

    logout() {
      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;
      this.isAuthenticated = false;

      // Xóa khỏi localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },

    updateUser(userData) {
      this.user = { ...this.user, ...userData };
      localStorage.setItem("user", JSON.stringify(this.user));
    },

    // Cập nhật access token mới sau khi refresh
    updateAccessToken(newToken) {
      this.accessToken = newToken;
      localStorage.setItem("access_token", newToken);
    },
  },

  getters: {
    userInfo: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
  },
});
