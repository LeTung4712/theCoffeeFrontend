import httpClient from './index';

const PREFIX = '/payment';

export const paymentAPI = {
  createMomoPayment(data) {
    return httpClient.post(`${PREFIX}/momo`, data);
  }
};
