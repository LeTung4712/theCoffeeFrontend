import { defineStore } from "pinia";
import { userAuth, adminAuth } from "@/api/auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    // State cho admin
    admin: {
      accessToken: localStorage.getItem("admin_access_token") || null,
      isAuthenticated: !!localStorage.getItem("admin_access_token"),
    },
    // State cho user
    user: {
      user: JSON.parse(localStorage.getItem("user")) || null,
      accessToken: localStorage.getItem("user_access_token") || null,
      isAuthenticated: !!localStorage.getItem("user_access_token"),
    },
  }),

  actions: {
    // Login cho admin
    async loginAdmin(credentials) {
      try {
        const response = await adminAuth.login(credentials);
        const { access_token } = response.data;

        this.admin = {
          accessToken: access_token,
          isAuthenticated: true,
        };

        // Lưu vào localStorage
        localStorage.setItem("admin_access_token", access_token);
      } catch (error) {
        throw error;
      }
    },

    // Login cho user
    async loginUser(userData, token) {
      this.user = {
        user: userData,
        accessToken: token,
        isAuthenticated: true,
      };

      // Lưu vào localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("user_access_token", token);
    },

    // Logout cho admin
    async logoutAdmin() {
      try {
        // Xóa khỏi localStorage
        localStorage.removeItem("admin_access_token");

        // Reset state
        this.admin = {
          accessToken: null,
          isAuthenticated: false,
        };
        await adminAuth.logout();
      } catch (error) {
        console.error("Admin logout error:", error);
      }
    },

    // Logout cho user
    async logoutUser() {
      try {
        // Xóa khỏi localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("user_access_token");
        localStorage.removeItem("addressNote");
        localStorage.removeItem("oldAddress");
        localStorage.removeItem("voucher");
        // Reset state
        this.user = {
          user: null,
          accessToken: null,
          isAuthenticated: false,
        };
        await userAuth.logout();
      } catch (error) {
        console.error("User logout error:", error);
      }
    },

    // Cập nhật thông tin user
    updateUser(userData) {
      this.user.user = { ...this.user.user, ...userData };
      localStorage.setItem("user", JSON.stringify(this.user.user));
    },

    // Cập nhật access token mới cho admin
    updateAdminToken(newToken) {
      this.admin.accessToken = newToken;
      this.admin.isAuthenticated = true;
      localStorage.setItem("admin_access_token", newToken);
    },

    // Cập nhật access token mới cho user
    updateUserToken(newToken) {
      this.user.accessToken = newToken;
      this.user.isAuthenticated = true;
      localStorage.setItem("user_access_token", newToken);
    },
  },

  getters: {
    // Getters cho admin
    isAdminLoggedIn: (state) =>
      state.admin.isAuthenticated && state.admin.accessToken,

    // Getters cho user
    userInfo: (state) => state.user.user,
    isUserLoggedIn: (state) =>
      state.user.isAuthenticated && state.user.accessToken,

    // Getter để lấy access token hiện tại (dựa vào route)
    currentAccessToken: (state) => {
      return state.admin.accessToken || state.user.accessToken;
    },
  },
});
