import httpClient from './index';

const PREFIX = '/payment';

//momo payment
export function createPaymentMomo(data) {
    return httpClient.post(`${PREFIX}/momo`, data);
}
