import httpClient from './index';

const PREFIX = '/user';

export const userAPI = {
  // Xác thực
  login(data) {
    return httpClient.post(`${PREFIX}/auth/login`, data);
  },

  verifyOtp(data) {
    return httpClient.post(`${PREFIX}/auth/checkOtp`, data);
  },

  // Thông tin người dùng
  updateInfo(data) {
    return httpClient.put(`${PREFIX}/info/updateInfo`, data);
  },

  getAddressNote(data) {
    return httpClient.post(`${PREFIX}/info/getAddressNote`, data);
  },

  createAddressNote(data) {
    return httpClient.post(`${PREFIX}/info/createAddressNote`, data);
  },

  updateAddressNote(data) {
    return httpClient.put(`${PREFIX}/info/updateAddressNote`, data);
  },

  deleteAddressNote(data) {
    return httpClient.delete(`${PREFIX}/info/deleteAddressNote`, data);
  },

  getOrdersUser(data) {
    return httpClient.post(`${PREFIX}/info/getOrderHistory`, data);
  },
};
