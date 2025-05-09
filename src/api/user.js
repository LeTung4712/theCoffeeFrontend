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
    return httpClient.get(`${PREFIX}/info/getAddressNote`, { params: data });
  },

  createAddressNote(data) {
    console.log(data)
    return httpClient.post(`${PREFIX}/info/createAddressNote`, data);
  },

  updateAddressNote(data) {
    return httpClient.put(`${PREFIX}/info/updateAddressNote`, data);
  },

  deleteAddressNote(data) {
    return httpClient.delete(`${PREFIX}/info/deleteAddressNote`, { params: data });
  },

  getOrdersUser(data) {
    return httpClient.get(`${PREFIX}/info/getOrderHistory`, { params: data });
  },
};
