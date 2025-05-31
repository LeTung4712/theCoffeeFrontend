import httpClient from './index';

const PREFIX = '/map';

export const mapAPI = {
  //gợi ý địa chỉ 
  getAutoCompleteAddress(query) {
    return httpClient.get(`${PREFIX}/autocomplete`, { params: { query } });
  },

};
