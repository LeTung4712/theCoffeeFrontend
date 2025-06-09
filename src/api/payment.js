import api from "./index";

// Payment APIs
export const paymentAPI = {
  // Thanh toán VNPay
  createVNPayPayment: (orderData) =>
    api.post("/payments/vnpay", orderData),
  handleVNPayCallback: (queryParams) =>
    api.get("/payments/vnpay/callback", { params: queryParams }),

  // Thanh toán Momo
  createMomoPayment: (orderData) =>
    api.post("/payments/momo", orderData),
  handleMomoCallback: (queryParams) =>
    api.get("/payments/momo/callback", { params: queryParams }),

  // Thanh toán ZaloPay
  createZaloPayPayment: (orderData) =>
    api.post("/payments/zalopay", orderData),
  handleZaloPayCallback: (queryParams) =>
    api.get("/payments/zalopay/callback", { params: queryParams }),

  // Thanh toán COD
  createCODPayment: (orderData) => api.post("/payments/cod", orderData),

  // Lịch sử thanh toán
  getPaymentHistory: (orderId) => api.get(`/payments/history/${orderId}`),

  // Kiểm tra trạng thái thanh toán
  checkPaymentStatus: (orderId) => api.get(`/payments/status/${orderId}`),
};
