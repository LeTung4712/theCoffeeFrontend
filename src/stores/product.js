import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    productId: null
  }),
  actions: {
    setProductId(id) {
      this.productId = id
    }
  },
  getters: {
    getCurrentProductId: (state) => state.productId
  }
})