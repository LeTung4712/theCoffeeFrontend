import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('order') || '[]')
  }),

  getters: {
    itemCount: (state) => state.items.length, // Số lượng sản phẩm trong giỏ hàng
    cartItemIds: (state) => state.items.map(item => item.product_item.id) // Lấy danh sách id các sản phẩm trong giỏ hàng
  },

  actions: {
    addItem(item) {
      item.id = this.items.length > 0 
        ? Math.max(...this.items.map(i => i.id)) + 1 
        : 1
      this.items.push(item)
      this.saveToStorage()
    },

    updateItem(updatedItem) {
      const index = this.items.findIndex(item => item.id === updatedItem.id)
      if (index !== -1) {
        this.items[index] = updatedItem
        this.saveToStorage()
      }
    },

    removeItem(id) {
      this.items = this.items.filter(item => item.id !== id)
      this.saveToStorage()
    },
     
    clearCart() {
      this.items = []
      this.saveToStorage()
    },
    
    saveToStorage() {
      localStorage.setItem('order', JSON.stringify(this.items))
      window.dispatchEvent(
        new CustomEvent('order-localstorage-changed', {
          detail: { storage: JSON.stringify(this.items) }
        })
      )
    },
  }
}) 