import { defineStore } from 'pinia'

export const useAddressStore = defineStore('address', {
  state: () => ({
    address: localStorage.getItem('oldAddress') 
      ? JSON.parse(localStorage.getItem('oldAddress'))
      : 'Chưa có địa chỉ giao hàng'
  }),

  actions: {
    updateAddress(newAddress) {
      this.address = newAddress
      localStorage.setItem('oldAddress', JSON.stringify(newAddress))
    }
  }
}) 