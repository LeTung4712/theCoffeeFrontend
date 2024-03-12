import httpClient from './index';

const PREFIX = '/voucher';

export function createVoucher(data) {
    return httpClient.post(`${PREFIX}/create`, data);
}
export function updateVoucher(data) {
    return httpClient.put(`${PREFIX}/update`, data);
}
export function deleteVoucher(data) {
    return httpClient.delete(`${PREFIX}/delete`, data);
}
export function getAllVouchers() {
    return httpClient.get(`${PREFIX}/index`);
}

