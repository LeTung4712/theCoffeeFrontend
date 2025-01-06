import httpClient from './index';

const PREFIX = '/recommenderSystem';

export const recommendAPI = {
  getRecommendation(data) {
    return httpClient.get(`${PREFIX}/recommendation`, { params: data });
  },

  getAssociationRules(data) {
    return httpClient.get(`${PREFIX}/associationRules`, { params: data });
  },

  analyzeShoppingBehavior(data) {
    return httpClient.post(`${PREFIX}/analyzeShoppingBehavior`, data);
  },
};
