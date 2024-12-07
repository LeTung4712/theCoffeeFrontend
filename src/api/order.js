import httpClient from './index';

const PREFIX = '/order';

export const orderAPI = {
  // Lấy thông tin đơn hàng
  getOrders(data) {
    return httpClient.get(`${PREFIX}/getOrders`, { params: data });
  },

  getOrderInfo(data) {
    return httpClient.get(`${PREFIX}/getOrderInfo`, { params: data });
  },

  getSuccessOrders(data) {
    return httpClient.get(`${PREFIX}/getSuccessOrders`, { params: data });
  },

  getUnsuccessOrders(data) {
    return httpClient.get(`${PREFIX}/getUnsuccessOrders`, { params: data });
  },

  // Thao tác với đơn hàng
  create(data) {
    return httpClient.post(`${PREFIX}/addOrder`, data);
  },

  accept(data) {
    return httpClient.put(`${PREFIX}/acceptOrder`, data);
  },

  success(data) {
    return httpClient.put(`${PREFIX}/successOrder`, data);
  },

  cancel(data) {
    return httpClient.put(`${PREFIX}/cancelOrder`, data);
  }
};
