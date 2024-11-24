import httpClient from './index';

const PREFIX = '/admin/auth';

export const adminAPI = {
  login(data) {
    return httpClient.post(`${PREFIX}/login`, data);
  },
  
  logout() {
    return httpClient.post(`${PREFIX}/logout`);
  }
};
