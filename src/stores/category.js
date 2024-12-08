import { defineStore } from 'pinia'
import { categoryAPI } from '@/api/category'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    loading: false,
    lastFetchTime: null,
    error: null
  }),

  getters: {
    rootCategories: (state) => {
      return state.categories.filter(category => category.parent_id === null)
    },

    getCategoryById: (state) => (id) => {
      return state.categories.find(category => category.id === id)
    },

    getChildCategories: (state) => (parentId) => {
      return state.categories.filter(category => category.parent_id === parentId)
    }
  },

  actions: {
    async fetchCategories(forceRefresh = false) {
      // Kiểm tra cache
      if (!forceRefresh && this.categories.length && !this.shouldRefreshData()) {
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await categoryAPI.getAll();
        if (response?.data?.categories) {
          this.categories = response.data.categories;
          this.lastFetchTime = Date.now();
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
        this.error = error.message || 'Có lỗi xảy ra khi tải danh mục';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    shouldRefreshData() {
      const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 phút
      return !this.lastFetchTime || 
        (Date.now() - this.lastFetchTime) > REFRESH_INTERVAL;
    }
  }
}) 