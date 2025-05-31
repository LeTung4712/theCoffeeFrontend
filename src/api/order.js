import httpClient from './index';

const PREFIX = '/order';

export const orderAPI = {
  // Lấy thông tin đơn hàng
  getOrders(data) {
    return httpClient.get(`${PREFIX}/getOrders`, { params: data });
  },

  getOrderInfo(data) {
    return httpClient.get(`${PREFIX}/getOrderInfo`, { params: { order_code: data } });
  },

  getSuccessOrders(data) {
    return httpClient.get(`${PREFIX}/getSuccessOrders`, { params: data });
  },

  // Thông tin đơn hàng chờ thanh toán
  getPendingPaymentOrders(data) {
    return httpClient.get(`${PREFIX}/getPendingPaymentOrders`, { params: data });
  },

  // Thông tin đơn hàng chờ giao
  getPendingDeliveryOrders(data) {
    return httpClient.get(`${PREFIX}/getPendingDeliveryOrders`, { params: data });
  },

  // Thông tin đơn hàng đang giao
  getDeliveringOrders(data) {
    return httpClient.get(`${PREFIX}/getDeliveringOrders`, { params: data });
  },


  // Thao tác với đơn hàng
  createOrder(data) {
    return httpClient.post(`${PREFIX}/addOrder`, data);
  },

  startDelivery(data) {
    return httpClient.put(`${PREFIX}/startDelivery`, data);
  },

  successOrder(data) {
    return httpClient.put(`${PREFIX}/successOrder`, data);
  },

  cancelOrder(data) {
    return httpClient.put(`${PREFIX}/cancelOrder`, data);
  },

  //thao tác thống kê
  getAnalyzeOrders(data) {
    return httpClient.get(`${PREFIX}/analytics`, { params: data });
  }
};
