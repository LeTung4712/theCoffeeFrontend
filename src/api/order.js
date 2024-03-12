import httpClient from './index';

const PREFIX = '/order';

export function addOrder(data) {
    return httpClient.post(`${PREFIX}/addOrder`, data);
}
export function getOrdersUser(data) {
    return httpClient.get(`${PREFIX}/getOrders`, data);
}
//accept order
export function acceptOrder(data) {
    return httpClient.put(`${PREFIX}/acceptOrder`, data);
}
//paid order là
export function paidOrder(data) {
    return httpClient.put(`${PREFIX}/paidOrder`, data);
}
//cancel order
export function cancelOrder(data) {
    return httpClient.put(`${PREFIX}/cancelOrder`, data);
}
//get order info
export function getOrderInfo(data) {
    return httpClient.get(`${PREFIX}/getOrderInfo`, data);
}
// get success order
export function getSuccessOrders(data) {
    return httpClient.get(`${PREFIX}/getSuccessOrders`, data);
}
//get unsuccess order
export function getUnsuccessOrders(data) {
    return httpClient.get(`${PREFIX}/getUnsuccessOrders`, data);
}
