import httpClient from './index';

const PREFIX = '/topping';

export function createTopping(data) {
    return httpClient.post(`${PREFIX}/create`, data);
}   
export function updateTopping(data) {
    return httpClient.put(`${PREFIX}/update`, data);
}
export function deleteTopping(data) {
    return httpClient.delete(`${PREFIX}/delete`, data);
}
export function getAllToppings() {
    return httpClient.get(`${PREFIX}/index`);
}
