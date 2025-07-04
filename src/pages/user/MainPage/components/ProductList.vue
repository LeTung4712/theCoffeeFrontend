<template>
  <v-container fluid class="px-md-15">
    <v-row>
      <v-col>
        <!-- Header -->
        <v-row align="center" justify="center" class="mb-8">
          <v-icon class="mr-3" color="primary" size="35">mdi-beer-outline</v-icon>
          <span ref="shopProductTitle" class="text-h4 font-weight-bold">Sản phẩm của Shop</span>

          <!-- Search Dialog mới -->
          <ProductSearchDialog v-model="dialogSearch" @select="navigateToProduct" />
          <v-btn icon variant="text" class="ml-4" color="primary" @click="dialogSearch = true"
            aria-label="Mở hộp thoại tìm kiếm sản phẩm">
            <v-icon size="40">mdi-magnify</v-icon>
          </v-btn>
        </v-row>

        <!-- Categories -->
        <v-row justify="center" class="mb-6">
          <v-col cols="12" md="10" lg="8">
            <div v-if="loadingCategories" class="d-flex justify-center my-4">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
            <div v-else class="category-group">
              <div v-for="category in categories" :key="category.id" class="category-item"
                :class="{ 'selected': category_type === category.id }" @click="category_type = category.id">
                <div class="category-image-wrapper">
                  <div class="category-image">
                    <v-img :src="category.image_url" class="category-image" width="60" height="60" cover
                      alt="Category Image" />
                  </div>
                </div>
                <span class="category-name">{{ category.name }}</span>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Products Grid -->
        <v-row class="mt-6">
          <template v-if="loadingProducts">
            <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="4" lg="2">
              <v-skeleton-loader class="product-card-responsive" type="card" height="300"></v-skeleton-loader>
            </v-col>
          </template>
          <template v-else>
            <v-col v-for="product in filteredProducts" :key="product.id" cols="12" sm="6" md="4" lg="2">
              <ProductCard :product="product" :currentID="product.id" :dialog="dialog"
                class="product-card-responsive" />
            </v-col>
          </template>
        </v-row>
        <!-- Pagination UI -->
        <v-row justify="center" v-if="lastPage > 1">
          <v-pagination v-model="currentPage" :length="lastPage" color="primary" class="my-4" />
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { removeVietnameseTones } from "@/utils/format";
import { userAPI } from "@/api/user";
import ProductCard from "@/components/Products/ProductCard.vue";
import { useCategoryStore } from '@/stores/category'
import { storeToRefs } from 'pinia'
import ProductSearchDialog from "@/components/Products/ProductSearchDialog.vue";

export default {
  name: "ProductList",
  components: {
    ProductCard,
    ProductSearchDialog
  },

  props: {
    currentID: Number,
    dialog: Boolean,
  },

  setup() {
    const categoryStore = useCategoryStore()
    const { rootCategories, loading: loadingCategories } = storeToRefs(categoryStore)

    return {
      categories: rootCategories,
      loadingCategories,
      categoryStore
    }
  },

  data() {
    return {
      dialogSearch: false,
      category_type: 1,
      products: [],
      loadingProducts: false,
      error: null,
      currentPage: 1,
      lastPage: 1,
      perPage: 12,
      total: 0
    }
  },

  async created() {
    try {
      // Tải categories và products song song
      await Promise.all([
        this.initializeCategories()
      ])
    } catch (error) {
      this.error = 'Có lỗi xảy ra khi tải dữ liệu'
      console.error('Lỗi khởi tạo:', error)
    }
  },

  methods: {
    async initializeCategories() {
      try {
        await this.categoryStore.fetchCategories()
        // Nếu không có category được chọn, chọn category đầu tiên
        if (!this.category_type && this.categories.length) {
          this.category_type = this.categories[0].id
        }
      } catch (error) {
        console.error('Lỗi khi tải categories:', error)
        throw error
      }
    },

    async getProductsByCategoryId(page) {
      this.loadingProducts = true
      this.error = null
      try {
        const response = await userAPI.product.getByCategory(this.category_type, page, this.perPage)
        if (response?.data?.products) {
          this.products = response.data.products
          if (response.data.pagination) {
            this.currentPage = response.data.pagination.current_page
            this.lastPage = response.data.pagination.last_page
            this.perPage = response.data.pagination.per_page
            this.total = response.data.pagination.total
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error)
        this.error = 'Không thể tải sản phẩm'
      } finally {
        this.loadingProducts = false
        // Scroll lên tiêu đề
        this.$nextTick(() => {
          const el = this.$refs.shopProductTitle;
          if (el && el.scrollIntoView) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }
    },

    handleProduct(product_id, product_name) {
      this.$router.push({
        path: `/${product_id}`,
        name: "productInfo",
        params: {
          product_id: product_id.toString(),
          product_name_convert: removeVietnameseTones(product_name)
            .replaceAll(' ', '-')
            .toLowerCase()
        },
      })
    },

    separator(numb) {
      return numb.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    navigateToProduct(product) {
      const productNameInUrl = removeVietnameseTones(product.name)
        .replaceAll(' ', '-')
        .toLowerCase();

      this.$router.push({
        path: `/products/${productNameInUrl}`
      });
    }
  },

  watch: {
    currentPage(newPage) {
      this.getProductsByCategoryId(newPage);
    },
    category_type: {
      handler(val) {
        this.currentPage = 1;
        this.getProductsByCategoryId(1);
      },
      immediate: true
    }
  },

  computed: {
    filteredProducts() {
      return this.products;
    },
  },
}
</script>

<style scoped>
/* Chỉ giữ lại các style custom cần thiết */
.text {
  font-size: 1.75rem;
  line-height: 2.25rem;
  font-weight: 600;
}

.category-group {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 0;
  width: 100%;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: calc((100% - (16px * 8)) / 9);
  min-width: 90px;
  gap: 12px;
}

.category-image-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  padding: 6px;
  background: rgb(var(--v-theme-background));
  border: 2px solid rgba(0, 0, 0, 0.12);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

.category-image {
  width: 100% !important;
  height: 100% !important;
  border-radius: 50%;
  background-color: rgb(var(--v-theme-secondary));
}

.category-name {
  font-size: 14px;
  color: rgb(var(--v-theme-text-secondary));
  text-align: center;
  font-weight: 400;
  white-space: normal;
  line-height: 1.3;
  max-width: 100px;
}

.selected .category-image-wrapper {
  border-color: rgb(var(--v-theme-primary));
  transform: scale(1.05);
}

.selected .category-name {
  color: rgb(var(--v-theme-text-primary));
  font-weight: 500;
}

/* Animation khi hover */
.category-item:hover .category-image-wrapper {
  border-color: rgb(var(--v-theme-primary));
  transform: scale(1.05);
}

.category-item:hover .category-name {
  color: rgb(var(--v-theme-text-primary));
}

/* Mobile styles */
@media (max-width: 959px) {
  .category-group {
    flex-wrap: nowrap;
    justify-content: flex-start;
    overflow-x: auto;
    gap: 24px;
    padding: 16px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .category-group::-webkit-scrollbar {
    display: none;
  }

  .category-item {
    flex: 0 0 auto;
    width: 90px;
    min-width: 90px;
  }

  .category-image-wrapper {
    width: 85px;
    height: 85px;
  }
}

.product-card {
  height: 300px;
  display: flex;
  flex-direction: column;
  background: rgb(var(--v-theme-background));
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}

.product-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgb(var(--v-theme-text-secondary));
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.product-card:hover::after {
  opacity: 0.05;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.mobile-product-card {
  background: white;
  margin-bottom: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}

.mobile-product-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.05);
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.mobile-product-card:hover::after {
  opacity: 1;
}

.mobile-product-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.product-name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  line-clamp: 2;
  line-clamp: 2;
  line-clamp: 2;
  line-clamp: 2;
  line-clamp: 2;
  line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 40px;
  color: rgb(var(--v-theme-text-primary)) !important;
  font-size: 1rem;
  margin-bottom: 4px;
  line-height: 1.4;
}

.mobile-product-name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.v-card-text {
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.add-button-wrapper {
  transform: scale(1.2);
}

.add-button-wrapper :deep(.v-btn--icon) {
  width: 36px;
  height: 36px;
}

.add-button-wrapper :deep(.v-btn__content) {
  font-size: 24px;
}

/* Mobile Styles */
@media (max-width: 600px) {
  .mobile-product-card {
    width: 100%;
    height: 120px;
    /* Fix chiều cao thẻ */
    display: flex;
    align-items: stretch;
  }

  .mobile-image-container {
    width: 33.333%;
    /* Chiếm 1/3 thẻ */
    padding: 8px;
  }

  .mobile-content {
    width: 66.666%;
    /* Chiếm 2/3 thẻ */
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .mobile-product-name {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: 1rem;
    line-height: 1.4;
    margin-bottom: 4px;
  }

  /* Đảm bảo giá và nút + thẳng hàng */
  .mobile-content>div:last-child {
    margin-top: auto;
  }

  /* Điều chỉnh kích thước nút + trên mobile */
  .add-button-wrapper {
    transform: scale(1.1);
    /* Giảm kích thước nút một chút trên mobile */
  }

  .add-button-wrapper :deep(.v-btn--icon) {
    width: 32px;
    height: 32px;
  }

  .add-button-wrapper :deep(.v-btn__content) {
    font-size: 20px;
  }
}

/* Responsive breakpoints */
@media (min-width: 1264px) {

  /* Large desktop */
  .v-col-lg-2 {
    flex: 0 0 16.666667%;
    max-width: 16.666667%;
    padding: 8px;
  }
}

@media (min-width: 960px) and (max-width: 1263px) {

  /* Medium desktop */
  .v-col-md-4 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
    padding: 8px;
  }
}

@media (min-width: 600px) and (max-width: 959px) {

  /* Tablet */
  .v-col-sm-6 {
    flex: 0 0 50%;
    max-width: 50%;
    padding: 8px;
  }
}

.image-container {
  padding: 16px 16px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Container padding responsive */
@media (min-width: 1904px) {
  .v-container {
    max-width: 1785px !important;
    padding-left: 80px !important;
    padding-right: 80px !important;
  }
}

@media (min-width: 1264px) and (max-width: 1903px) {
  .v-container {
    padding-left: 60px !important;
    padding-right: 60px !important;
  }
}

@media (min-width: 960px) and (max-width: 1263px) {
  .v-container {
    padding-left: 40px !important;
    padding-right: 40px !important;
  }
}

/* Grid system */
@media (min-width: 1264px) {
  .v-col-lg-2 {
    flex: 0 0 16.666667%;
    max-width: 16.666667%;
    padding: 12px;
    /* Thêm padding giữa các cards */
  }
}

@media (min-width: 960px) and (max-width: 1263px) {
  .v-col-md-4 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
    padding: 12px;
  }
}

@media (min-width: 600px) and (max-width: 959px) {
  .v-col-sm-6 {
    flex: 0 0 50%;
    max-width: 50%;
    padding: 12px;
  }

}

/* Thêm styles mới cho responsive */
.product-card-responsive {
  height: auto !important;
}

/* Mobile styles */
@media (max-width: 600px) {
  .product-card-responsive {
    margin-bottom: 12px;
  }

  .v-col {
    padding: 6px 12px !important;
  }
}

.search-dialog-content {
  max-height: 70vh;
  /* Chiều cao tối đa là 70% viewport height */
  overflow-y: auto;
  /* Cho phép cuộn dọc */
  padding: 16px;
  position: relative;
}

.sticky-search {
  position: sticky;
  top: 0;
  background: rgb(var(--v-theme-background));
  z-index: 1;
  padding: 8px 0;
}

/* Tùy chỉnh thanh cuộn */
.search-dialog-content::-webkit-scrollbar {
  width: 8px;
}

.search-dialog-content::-webkit-scrollbar-track {
  background: rgb(var(--v-theme-secondary));
  border-radius: 4px;
}

.search-dialog-content::-webkit-scrollbar-thumb {
  background: rgb(var(--v-theme-text-secondary));
  border-radius: 4px;
}

.search-dialog-content::-webkit-scrollbar-thumb:hover {
  background: rgb(var(--v-theme-text-primary));
}
</style>
