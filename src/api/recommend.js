import httpClient from './index';

const PREFIX = '/recommenderSystem';

export const recommendAPI = {
  getRecommendation(data) {
    return httpClient.get(`${PREFIX}/recommendation`, { params: data });
  },

  getAssociationRules(data) {
    return httpClient.get(`${PREFIX}/associationRules`, { params: data });
  },

  analyzeApriori(data) {
    return httpClient.post(`${PREFIX}/analyzeApriori`, data);
  },

  analyzeFpGrowth(data) {
    return httpClient.post(`${PREFIX}/analyzeFpGrowth`, data);
  }
};