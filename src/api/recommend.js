import httpClient from './index';

const PREFIX = '/recommenderSystem';

export const recommendAPI = {
  createRecommendation(data) {
    return httpClient.post(`${PREFIX}/recommendation`, data);
  },

  getAssociationRules() {
    return httpClient.get(`${PREFIX}/getAssociationRules`);
  },

  analyzeApriori(data) {
    return httpClient.post(`${PREFIX}/analyzeApriori`, data);
  },

  analyzeFpGrowth(data) {
    return httpClient.post(`${PREFIX}/analyzeFpGrowth`, data);
  }
};