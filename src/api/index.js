import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";

// Biến để kiểm tra đang refresh token hay không
let isRefreshing = false;
// Queue các request đang chờ refresh token
let failedQueue = [];

// Hàm xử lý các request trong queue
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Tạo instance axios với base URL và cấu hình credentials
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Quan trọng: cho phép gửi/nhận cookies
});

// Request interceptor – tự gắn access token
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    // Lấy token dựa vào URL của request
    const isAdminRequest = config.url.startsWith("/admin");
    const token = isAdminRequest
      ? authStore.admin.accessToken
      : authStore.user.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor – tự động refresh token khi hết hạn
api.interceptors.response.use(
  (response) => {
    // Transform response data để lấy trực tiếp data từ response
    if (response.data && response.data.data) {
      return {
        ...response,
        data: response.data.data,
      };
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore();
    const notificationStore = useNotificationStore();

    // Nếu lỗi 401 và chưa thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh token, thêm request vào queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Xác định loại request (admin hay user) dựa vào URL
        const isAdminRequest = originalRequest.url.startsWith("/admin");
        const refreshEndpoint = isAdminRequest
          ? "admin/auth/refresh-token"
          : "users/auth/refresh-token";

        const response = await axios.post(
          `${api.defaults.baseURL}${refreshEndpoint}`,
          {}, // Không cần gửi refresh token trong body nữa
          { withCredentials: true } // Đảm bảo gửi cookie
        );

        const { access_token } = response.data.data;

        // Cập nhật token tương ứng với loại request
        if (isAdminRequest) {
          authStore.updateAdminToken(access_token);
        } else {
          authStore.updateUserToken(access_token);
        }

        // Thử lại các request trong queue
        processQueue(null, access_token);

        // Thử lại request ban đầu với token mới
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Xác định loại request để logout đúng
        const isAdminRequest = originalRequest.url.startsWith("/admin");
        // Logout tương ứng với loại request
        if (isAdminRequest) {
          await authStore.logoutAdmin();
          // Chuyển về trang login admin
          window.location.href = "/admin/login";
        } else {
          await authStore.logoutUser();
          // Chuyển về trang chủ vì user login là popup
          window.location.href = "/";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
