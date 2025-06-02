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

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Thêm interceptor cho request
httpClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor cho response
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore();
    const notificationStore = useNotificationStore();

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh token, thêm request vào queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return httpClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi API refresh token bằng httpClient
        const response = await httpClient.post("/user/auth/refreshToken", {
          refresh_token: authStore.refreshToken,
        });

        const { access_token } = response.data;
        authStore.updateAccessToken(access_token);

        // Xử lý các request trong queue
        processQueue(null, access_token);

        // Retry request ban đầu
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return httpClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Nếu refresh thất bại, logout user
        authStore.logout();
        notificationStore.error(
          "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
        );
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;
