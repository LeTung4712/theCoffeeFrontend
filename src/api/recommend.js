import httpClient from './index';

const PREFIX = '/recommenderSystem';
//lay san pham goi y
export function createRecommend(data) {
    return httpClient.post(`${PREFIX}/recommendation`, data);
}
//lấy tập quy tắc kết hợp
export function getAssociationRules() {
    return httpClient.get(`${PREFIX}/getAssociationRules`);
}
//chạy thuật toán Apriori
export function analyzeApriori(data) {
    return httpClient.post(`${PREFIX}/analyzeApriori`, data);
}
//chạy thuật toán FpGrowth
export function analyzeFpGrowth(data) {
    return httpClient.post(`${PREFIX}/analyzeFpGrowth`, data);
}