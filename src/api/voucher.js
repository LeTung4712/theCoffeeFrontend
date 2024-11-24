import httpClient from './index';

const PREFIX = '/voucher';

export const voucherAPI = {
  getAll() {
    return httpClient.get(`${PREFIX}/index`);
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

