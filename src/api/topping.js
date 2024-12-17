import httpClient from './index';

const PREFIX = '/topping';

export const toppingAPI = {
  getAllToppings() {
    return httpClient.get(`${PREFIX}/index`);
  },

  getActiveToppings() {
    return httpClient.get(`${PREFIX}/indexActive`);
  },

  createTopping(data) {
    return httpClient.post(`${PREFIX}/create`, data);
  },

  updateTopping(data) {
    return httpClient.put(`${PREFIX}/update`, data);
  },

  deleteTopping(data) {
    return httpClient.delete(`${PREFIX}/delete`, { params: data });
  }
};
