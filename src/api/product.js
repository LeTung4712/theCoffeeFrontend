import httpClient from './index';

const PREFIX = '/product';

export const productAPI = {
  // Lấy danh sách
  getAll() {
    return httpClient.get(`${PREFIX}/index`);
  },
  
  getByCategory(data) {
    return httpClient.get(`${PREFIX}/indexByCategoryId`, { params: data });
  },
  
  getInfo(data) {
    return httpClient.get(`${PREFIX}/getProductInfo`, { params: data });
  },

  // Thao tác CRUD
  create(data) {
    return httpClient.post(`${PREFIX}/create`, data);
  },
  
  update(data) {
    return httpClient.put(`${PREFIX}/update`, data);
  },
  
  delete(data) {
    return httpClient.delete(`${PREFIX}/delete`, { params: data });
  }
};
