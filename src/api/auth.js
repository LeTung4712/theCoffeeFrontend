import api from "./index";

// Admin Auth APIs
export const adminAuth = {
  login: (credentials) => api.post("/admin/auth/login", credentials),
  refreshToken: (refreshToken) =>
    api.post("/admin/auth/refresh-token", { refresh_token: refreshToken }),
  logout: () => api.post("/admin/auth/logout"),
};

// User Auth APIs
export const userAuth = {
  login: (mobile_no) => api.post("/users/auth/login", { mobile_no: mobile_no }),
  verifyOtp: (data) => api.post("/users/auth/verify-otp", data),
  refreshToken: (refreshToken) =>
    api.post("/users/auth/refresh-token", { refresh_token: refreshToken }),
  logout: () => api.post("/users/auth/logout"),
};
