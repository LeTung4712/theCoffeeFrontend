<template>
  <v-container fluid class="px-md-15">
    <v-row>
      <v-col>
        <!-- Header -->
        <v-row align="center" justify="center" class="mb-8">
          <v-icon class="mr-3" color="primary">mdi-beer-outline</v-icon>
          <span class="text-h4 font-weight-bold">Sản phẩm từ Nhà</span>

          <!-- Search Dialog -->
          <v-dialog v-model="dialogSearch" max-width="700" class="mt-16">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon variant="text" class="ml-4" color="primary">
                <v-icon size="32">mdi-magnify</v-icon>
              </v-btn>
            </template>

            <v-card>
              <v-card-title class="d-flex align-center">
                <v-btn icon @click="dialogSearch = false">
                  <v-icon size="32" color="text-secondary">mdi-close</v-icon>
                </v-btn>
                <span class="mx-auto">Tìm kiếm</span>
              </v-card-title>

              <v-divider></v-divider>

              <v-card-text class="search-dialog-content">
                <v-text-field v-model="searchProduct" prepend-icon="mdi-magnify" placeholder="Nhập tên sản phẩm"
                  variant="outlined" density="comfortable" @keydown.delete="updateSearch" hide-details
                  class="sticky-search">
                </v-text-field>

                <v-row class="mt-4">
                  <v-col v-for="product in filteredList" :key="product.id" cols="12" sm="6" md="3">
                    <ProductCard :currentID="product.id" :dialog="dialog" :product="product" :isInProductListing="1"
                      class="product-card-responsive" />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-dialog>
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
                    <v-img :src="category.image_url" class="category-image" width="60" height="60" cover />
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
              <ProductCard :product="product" :currentID="currentID" :dialog="dialog" :imageSize="imageSize"
                class="product-card-responsive" />
            </v-col>
          </template>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { removeVietnameseTones } from "@/utils/format";
import { productAPI } from "@/api/product";
import ProductCard from "@/components/Products/ProductCard.vue";
import { useCategoryStore } from '@/stores/category'
import { storeToRefs } from 'pinia'
// /* global axios */
export default {
  name: "ProductList",
  components: {
    ProductCard
  },
  props: {
    currentID: Number,
    dialog: Boolean,
  },
  setup() {
    const categoryStore = useCategoryStore()
    const { categories, loading: loadingCategories } = storeToRefs(categoryStore)
    
    return {
      categories,
      loadingCategories
    }
  },
  data() {
    return {
      dialogSearch: false,
      category_type: 1,
      products: [
        {
          "id": 1,
          "name": "The Coffee House Sữa Nóng",
          "category_id": 1,
          "description": "Thức uống giúp tỉnh táo tức thì để bắt đầu ngày mới thật hứng khởi. Không đắng khét như cà phê truyền thống, The Coffee House Sữa Đá mang hương vị hài hoà đầy lôi cuốn. Là sự đậm đà của 100% cà phê Arabica Cầu Đất rang vừa tới, biến tấu tinh tế với sữa đặc và kem sữa ngọt ngào cực quyến rũ. Càng hấp dẫn hơn với topping thạch 100% cà phê nguyên chất giúp giữ trọn vị ngon đến ngụm cuối cùng.",
          "price": 39000,
          "price_sale": 0,
          "active": 1,
          "image_url": "https://product.hstatic.net/1000075078/product/1696220170_phin-sua-tuoi-banh-flan_0172beb85d08408b8912bf5f1dae7fd9_large.jpg",
        }

      ],
      searchProduct: null,
      product_searchs: [
        {
          id: 5,
          name: "Hi-Tea Thơm",
          description: "Sự kết hợp ăn ý giữa Trà xanh Nhật Bản và những miếng thơm thật mọng nước.",
          price: 49000,
          image_url: "https://minio.thecoffeehouse.com/image/admin/1732197236_caphe_400x400.jpg",
          category_id: 4
        }
      ],
      imageSize: 155,
      loadingProducts: false,
    }
  },

  async created() {
    try {
      await Promise.all([
        this.useCategoryStore().fetchCategories(),
        this.getAllProducts()
      ])
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error)
    }
  },

  methods: {
    async getProductsByCategoryId() {
      this.loadingProducts = true
      try {
        const response = await productAPI.getByCategory({ category_id: this.category_type })

        if (response?.data?.products?.length) {
          this.products = response.data.products
          //console.log('hello this products', this.products);
        }
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error)
      } finally {
        this.loadingProducts = false
      }
    },

    async getAllProducts() {
      try {
        // Thêm delay 1s để test loading
        await new Promise(resolve => setTimeout(resolve, 1000))

        const response = await productAPI.getAll()
        if (response?.data?.products?.length) {
          this.product_searchs = response.data.products
        }
      } catch (error) {
        console.error('Lỗi khi lấy tất cả sản phẩm:', error)
      }
    },

    updateSearch() {
      if (this.searchProduct?.length === 1) {
        this.searchProduct = null
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
    category_type: {
      handler: 'getProductsByCategoryId',
      immediate: true
    }
  },

  computed: {
    filteredProducts() {
      return this.products;
    },

    filteredList() {
      if (!this.searchProduct) return this.product_searchs
      const searchTerm = this.searchProduct.toLowerCase()
      return this.product_searchs.filter(product =>
        product.name.toLowerCase().includes(searchTerm)
      )
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
