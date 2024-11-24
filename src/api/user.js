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

  // Danh mục và sản phẩm
  getCategory(params) {
    return httpClient.get(`${PREFIX}/category/indexByParentId`, { params });
  },

  getAllProducts() {
    return httpClient.get(`${PREFIX}/product/index`);
  },

  getProductInfo(params) {
    return httpClient.get(`${PREFIX}/product/getProductInfo`, { params });
  },

  getProductByCategory(params) {
    return httpClient.get(`${PREFIX}/product/indexByCategoryId`, { params });
  }
};
