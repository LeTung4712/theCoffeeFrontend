import httpClient from './index';

const PREFIX = '/category';

export const categoryAPI = {
  getAll() {
    console.log('getcategory')
    return httpClient.get(`${PREFIX}/index`);
  },

  getByParentId(data) {
    console.log('getcategory')
    return httpClient.get(`${PREFIX}/indexByParentId`, { params: data });
  },

  create(data) {
    return httpClient.post(`${PREFIX}/create`, data);
  },

  update(data) {
    return httpClient.put(`${PREFIX}/update`, data);
  },

  delete(params) {
    return httpClient.delete(`${PREFIX}/delete`, { params });
  }
};
