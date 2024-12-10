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

  getUnsuccessOrders(data) {
    return httpClient.get(`${PREFIX}/getUnsuccessOrders`, { params: data });
  },

  // Thao tác với đơn hàng
  createOrder(data) {
    return httpClient.post(`${PREFIX}/addOrder`, data);
  },

  acceptOrder(data) {
    return httpClient.put(`${PREFIX}/acceptOrder`, data);
  },

  successOrder(data) {
    return httpClient.put(`${PREFIX}/successOrder`, data);
  },

  cancelOrder(data) {
    return httpClient.put(`${PREFIX}/cancelOrder`, data);
  }
};
