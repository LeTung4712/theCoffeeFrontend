import httpClient from './index';

const PREFIX = '/order';

export const orderAPI = {
  // Lấy thông tin đơn hàng
  getOrders(params) {
    return httpClient.get(`${PREFIX}/getOrders`, { params });
  },

  getOrderInfo(params) {
    return httpClient.get(`${PREFIX}/getOrderInfo`, { params });
  },

  getSuccessOrders(params) {
    return httpClient.get(`${PREFIX}/getSuccessOrders`, { params });
  },

  getUnsuccessOrders(params) {
    return httpClient.get(`${PREFIX}/getUnsuccessOrders`, { params });
  },

  // Thao tác với đơn hàng
  create(data) {
    return httpClient.post(`${PREFIX}/addOrder`, data);
  },

  accept(data) {
    return httpClient.put(`${PREFIX}/acceptOrder`, data);
  },

  markAsPaid(data) {
    return httpClient.put(`${PREFIX}/paidOrder`, data);
  },

  cancel(data) {
    return httpClient.put(`${PREFIX}/cancelOrder`, data);
  }
};
