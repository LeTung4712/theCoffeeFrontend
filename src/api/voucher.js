import httpClient from './index';

const PREFIX = '/voucher';

export const voucherAPI = {
  getAllVouchers() {
    return httpClient.get(`${PREFIX}/index`);
  },

  createVoucher(data) {
    return httpClient.post(`${PREFIX}/create`, data);
  },

  updateVoucher(data) {
    return httpClient.put(`${PREFIX}/update`, data);
  },

  deleteVoucher(data) {
    return httpClient.delete(`${PREFIX}/delete`, { params: data });
  }
};

