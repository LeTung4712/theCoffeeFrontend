import api from "./index";

// User APIs
export const userAPI = {
  // Thông tin cá nhân
  profile: {
    get: () => api.get("/users/me"),
    update: (profileData) => api.put("/users/me", profileData),
  },

  // Quản lý địa chỉ
  address: {
    getAll: () => api.get("/users/addresses"),
    create: (addressData) => api.post("/users/addresses", addressData),
    update: (id, addressData) => api.put(`/users/addresses/${id}`, addressData),
    delete: (id) => api.delete(`/users/addresses/${id}`),
  },

  // Quản lý đơn hàng
  order: {
    create: (orderData) => api.post("/users/orders", orderData),
    getHistory: () => api.get("/users/orders"),
    complete: (id) => api.patch(`/users/orders/${id}/complete`),
    cancel: (id) => api.patch(`/users/orders/${id}/cancel`),
  },

  // Quản lý voucher
  voucher: {
    getAll: () => api.get("/vouchers"),
    getActive: () => api.get("/users/vouchers"),
  },

  // Danh sách sản phẩm
  product: {
    getAll: () => api.get("/products"),
    search: (keyword) => api.get("/products/search", { params: { keyword } }),
    getById: (id) => api.get(`/products/${id}`),
    getByCategory: (categoryId, page = 1, per_page = 12) =>
      api.get(`/categories/${categoryId}/products`, {
        params: { page, per_page },
      }),
    getRecommendations: (cartItems) =>
      api.get("/recommendations", {
        params: { cartItems: cartItems.join(",") },
      }),
  },

  // Danh mục và topping
  category: {
    getAll: () => api.get("/categories"),
  },
  topping: {
    getAll: () => api.get("/toppings"),
  },

  // Dịch vụ bản đồ
  map: {
    searchAddress: (query) => api.get("/map/addresses", { params: { query } }),
  },
};
