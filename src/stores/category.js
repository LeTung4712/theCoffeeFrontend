import { defineStore } from "pinia";
import { categoryAPI } from "@/api/category";

export const useCategoryStore = defineStore("category", {
  state: () => ({
    categories: [],
    menuItems: [],
    loading: false,
    lastFetchTime: null,
    error: null,
  }),

  getters: {
    rootCategories: (state) => {
      return state.categories.filter((category) => category.parent_id === null);
    },

    getCategoryById: (state) => (id) => {
      return state.categories.find((category) => category.id === id);
    },

    getChildCategories: (state) => (parentId) => {
      return state.categories.filter(
        (category) => category.parent_id === parentId
      );
    },
  },

  actions: {
    async fetchCategories(forceRefresh = false) {
      // // Kiểm tra cache
      // if (!forceRefresh && this.categories.length && !this.shouldRefreshData()) {
      //   return;
      // }

      this.loading = true;
      this.error = null;

      try {
        const response = await categoryAPI.getAll();
        if (response?.data?.categories) {
          this.categories = response.data.categories;
          this.lastFetchTime = Date.now();
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        this.error = error.message || "Có lỗi xảy ra khi tải danh mục";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    shouldRefreshData() {
      const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 phút
      return (
        !this.lastFetchTime ||
        Date.now() - this.lastFetchTime > REFRESH_INTERVAL
      );
    },

    buildMenuItems() {
      if (!this.categories.length) return;

      console.log("Building menu items from categories:", this.categories);

      // Item "Tất cả sản phẩm"
      const allProducts = {
        name: "Tất cả",
        title: "Tất cả", // Giữ lại title để tương thích
        id: 0,
      };

      // Lọc và xây dựng danh mục cha
      const parentCategories = this.categories
        .filter((cat) => cat.parent_id === 0 || cat.parent_id === null)
        .map((parent) => {
          const children = this.getMenuChildCategories(parent.id);

          return {
            name: parent.name,
            title: parent.name, // Giữ lại title để tương thích
            id: parent.id,
            children: children,
          };
        })
        .filter((category) => category.children.length > 0);

      this.menuItems = [allProducts, ...parentCategories];
      console.log("Menu items built:", JSON.stringify(this.menuItems, null, 2));
    },

    getMenuChildCategories(parentId) {
      const childCategories = this.categories
        .filter((cat) => cat.parent_id === parentId)
        .map((child) => ({
          name: child.name,
          title: child.name,
          id: child.id,
          file: "dots",
          selectable: true,
        }));

      console.log(`Child categories for parent ${parentId}:`, childCategories);
      return childCategories;
    },
  },
});
