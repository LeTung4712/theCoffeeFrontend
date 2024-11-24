import httpClient from './index';

const PREFIX = '/product';

export const productAPI = {
  // Lấy danh sách
  getAll() {
    return httpClient.get(`${PREFIX}/index`);
  },
  
  getByCategory(categoryId) {
    return httpClient.get(`${PREFIX}/indexByCategoryId`, { params: { category_id: categoryId } });
  },
  
  getInfo(productId) {
    return httpClient.get(`${PREFIX}/getProductInfo`, { params: { product_id: productId } });
  },

  // Thao tác CRUD
  create(data) {
    return httpClient.post(`${PREFIX}/create`, data);
  },
  
  update(data) {
    return httpClient.put(`${PREFIX}/update`, data);
  },
  
  delete(id) {
    return httpClient.delete(`${PREFIX}/delete`, { params: { id } });
  }
};
