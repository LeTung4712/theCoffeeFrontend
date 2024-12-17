import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    productId: null,
    previousProductId: null  // Thêm để theo dõi id trước đó
  }),
  
  actions: {
    setProductId(id) {
      this.previousProductId = this.productId
      this.productId = id
    },
    
    clearProductId() {
      this.previousProductId = null
      this.productId = null
    }
  },
  
  getters: {
    getCurrentProductId: (state) => state.productId,
    hasProductIdChanged: (state) => state.previousProductId !== state.productId
  }
})