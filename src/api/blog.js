import { API } from "./base";

export const blogAPI = {
  /**
   * Lấy danh sách bài viết blog
   * @param {Object} params - Tham số truy vấn (phân trang, lọc...)
   * @returns {Promise} Promise object với dữ liệu bài viết
   */
  getPosts(params = {}) {
    return API.get("/blogs", { params });
  },

  /**
   * Lấy chi tiết bài viết theo slug
   * @param {String} slug - Slug của bài viết
   * @returns {Promise} Promise object với dữ liệu chi tiết bài viết
   */
  getPostBySlug(slug) {
    return API.get(`/blogs/${slug}`);
  },

  /**
   * Lấy danh sách bài viết liên quan
   * @param {String} category - Danh mục cần lấy bài viết liên quan
   * @param {Number} limit - Số lượng bài viết tối đa
   * @returns {Promise} Promise object với dữ liệu bài viết liên quan
   */
  getRelatedPosts(category, limit = 3) {
    return API.get("/blogs/related", { params: { category, limit } });
  },

  /**
   * Lấy danh sách danh mục blog
   * @returns {Promise} Promise object với dữ liệu danh mục
   */
  getCategories() {
    return API.get("/blog-categories");
  },
};
