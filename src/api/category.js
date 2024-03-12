import httpClient from './index';

const PREFIX = '/category';

export function getCategoriesByParentId(data) {
    return httpClient.get(`${PREFIX}/indexByParentId`, data);
}
export function getAllCategories() {
    return httpClient.get(`${PREFIX}/index`);
}
export function createCategory(data) {
    return httpClient.post(`${PREFIX}/create`, data);
}
export function updateCategory(data) {
    return httpClient.put(`${PREFIX}/update`, data);
}
export function deleteCategory(data) {
    return httpClient.delete(`${PREFIX}/delete`, data);
}
