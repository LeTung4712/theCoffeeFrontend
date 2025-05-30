import httpClient from './index';

const PREFIX = '/payment';

export const paymentAPI = {
  createMomoPayment(data) {
    return httpClient.post(`${PREFIX}/momo`, data);
  },

  createVNPayPayment(data) {
    return httpClient.post(`${PREFIX}/vnpay`, data);
  },

  createZaloPayPayment(data) {
    return httpClient.post(`${PREFIX}/zalopay`, data);
  },
};
