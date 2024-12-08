import { defineStore } from 'pinia'
import { categoryAPI } from '@/api/category'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    loading: false,
    initialized: false
  }),

  actions: {
    async fetchCategories() {
      // Chỉ fetch nếu chưa được khởi tạo
      if (this.initialized) return

      this.loading = true
      try {
        const response = await categoryAPI.getByParentId({ parent_id: null })
        if (response?.data?.categories?.length) {
          this.categories = response.data.categories
          this.initialized = true
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error)
      } finally {
        this.loading = false
      }
    }
  }
}) 