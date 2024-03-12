import httpClient from './index';

const PREFIX = '/product';
export function createProduct(data) {
    return httpClient.post(`${PREFIX}/create`, data);
}
export function updateProduct(data) {
    return httpClient.put(`${PREFIX}/update`, data);
}
export function deleteProduct(data) {
    return httpClient.delete(`${PREFIX}/delete`, data);
}
export function getAllProducts() {
    return httpClient.get(`${PREFIX}/index`);
}
export function getProductInfo(data) {
    return httpClient.get(`${PREFIX}/getProductInfo`, data);
}
export function getProductsByCategoryId(data) {
    return httpClient.get(`${PREFIX}/indexByCategoryId`, data);
}
