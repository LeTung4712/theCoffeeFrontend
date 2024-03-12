import httpClient from './index';

const PREFIX = '/user';

export function loginByMobileNo(data) {
    return httpClient.post(`${PREFIX}/auth/login`, data);
}
export function verifyOtp(data) {
    return httpClient.post(`${PREFIX}/auth/checkOtp`, data);
}
export function updateInfo(data) {
    return httpClient.put(`${PREFIX}/info/updateInfo`, data);
}
export function getAddressNote(data) {
    return httpClient.post(`${PREFIX}/info/getAddressNote`, data);
}

export function getCategory(parent_id) {
    return httpClient.get(`${PREFIX}/category/indexByParentId`, parent_id);
}
export function getAllProduct() {
    return httpClient.get(`${PREFIX}/product/index`);
}
export function getProductInfo(data) {
    return httpClient.get(`${PREFIX}/product/getProductInfo`, data);
}
export function getProductByCategory(data) {
    return httpClient.get(`${PREFIX}/product/indexByCategoryId`, data);
}
