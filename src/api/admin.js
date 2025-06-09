import api from "./index";

// Admin APIs
export const adminAPI = {
  // Quản lý sản phẩm
  product: {
    getAll: () => api.get("/admin/products"),
    getByCategoryId: (categoryId) =>
      api.get(`/admin/categories/${categoryId}/products`),
    create: (productData) => api.post("/admin/products", productData),
    update: (id, productData) => api.put(`/admin/products/${id}`, productData),
    delete: (id) => api.delete(`/admin/products/${id}`),
  },

  // Quản lý danh mục
  category: {
    getAll: () => api.get("/admin/categories"),
    getById: (id) => api.get(`/admin/categories/${id}`),
    create: (categoryData) => api.post("/admin/categories", categoryData),
    update: (id, categoryData) =>
      api.put(`/admin/categories/${id}`, categoryData),
    delete: (id) => api.delete(`/admin/categories/${id}`),
    getChildren: (id) => api.get(`/admin/categories/${id}/children`),
  },

  // Quản lý topping
  topping: {
    getAll: () => api.get("/admin/toppings"),
    create: (toppingData) => api.post("/admin/toppings", toppingData),
    update: (id, toppingData) => api.put(`/admin/toppings/${id}`, toppingData),
    delete: (id) => api.delete(`/admin/toppings/${id}`),
  },

  // Quản lý voucher
  voucher: {
    getAll: () => api.get("/admin/vouchers"),
    create: (voucherData) => api.post("/admin/vouchers", voucherData),
    update: (id, voucherData) => api.put(`/admin/vouchers/${id}`, voucherData),
    delete: (id) => api.delete(`/admin/vouchers/${id}`),
  },

  // Quản lý đơn hàng
  order: {
    getAll: () => api.get("/admin/orders"),
    getById: (id) => api.get(`/admin/orders/${id}`),
    startDelivery: (id) => api.patch(`/admin/orders/${id}/start-delivery`),
    complete: (id) => api.patch(`/admin/orders/${id}/complete`),
    cancel: (id) => api.patch(`/admin/orders/${id}/cancel`),
    getCompleted: () => api.get("/admin/orders/status/completed"),
    getPendingPayment: () => api.get("/admin/orders/status/pending-payment"),
    getPendingDelivery: () => api.get("/admin/orders/status/pending-delivery"),
    getDelivering: () => api.get("/admin/orders/status/delivering"),
    AnalyzeOrders: (data) => api.post("/admin/analytics", data),
  },

  // Quản lý đề xuất
  recommendation: {
    analyzeShoppingBehavior: (data) =>
      api.post("/admin/recommender/analyze-shopping", data),
    getAssociationRules: (data) =>
      api.get("/admin/recommender/association-rules", data),
  },
};
