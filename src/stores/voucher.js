import { defineStore } from 'pinia'
import { voucherAPI } from '@/api/voucher'

export const useVoucherStore = defineStore('voucher', {
  state: () => ({
    selectedVoucher: null,
    voucherList: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchVouchers() {
      this.loading = true
      try {
        const response = await voucherAPI.getAll()
        this.voucherList = response.data.vouchers
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    setSelectedVoucher(voucher) {
      this.selectedVoucher = voucher
      if (voucher) {
        localStorage.setItem('voucher', JSON.stringify(voucher))
      } else {
        localStorage.removeItem('voucher')
      }
    },

    loadVoucherFromStorage() {
      try {
        const stored = localStorage.getItem('voucher')
        if (stored) {
          this.selectedVoucher = JSON.parse(stored)
        }
      } catch (error) {
        console.error('Lỗi khi load voucher từ storage:', error)
      }
    },

    clearVoucher() {
      this.selectedVoucher = null
      localStorage.removeItem('voucher')
    }
  },

  getters: {
    availableVouchers: (state) => {
      return state.voucherList.filter(
        voucher => new Date(voucher.expire_at) > new Date()
      )
    }
  }
}) 