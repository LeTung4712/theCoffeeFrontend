<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="4" lg="3">
                <div v-if="loadingCategories" class="d-flex justify-center">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </div>
                <v-treeview :items="menuItems" activatable item-key="id" open-on-click v-model="activeItems"
                    @update:active="handleActiveChange">
                    <template #prepend="{ item }">
                        <v-icon>{{ getItemIcon(item) }}</v-icon>
                    </template>
                </v-treeview>
            </v-col>

            <!-- Products column -->
            <v-col cols="12" md="8" lg="9" class="mt-8">
                <div v-if="loadingProducts" class="d-flex justify-center">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </div>

                <v-row v-else>
                    <v-col v-for="product in products" :key="product.id" cols="12" sm="6" md="3">
                        <ProductCard :currentID="product.id" :dialog="dialog" :product="product" :isInProductListing="1"
                      class="product-card-responsive" />
                    </v-col>
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

export default {
    name: "MenuCategory",
    components: {
        ProductCard,
    },

    data() {
        return {
            dialog: false,
            categoryType: 0,
            products: [],
            loadingProducts: false,
            activeItems: [],
        }
    },

    setup() {
        const categoryStore = useCategoryStore()
        const { categories, loading: loadingCategories, menuItems } = storeToRefs(categoryStore)
        return { categoryStore, categories, loadingCategories, menuItems }
    },

    created() {
        this.initializeMenu();
    },

    methods: {

        async initializeMenu() {
            try {
                await this.categoryStore.fetchCategories();
                this.categoryStore.buildMenuItems();
                await this.fetchProducts();
                this.handleInitialRoute();
            } catch (error) {
                console.error('Error initializing menu:', error);
            }
        },

        getItemIcon(item) {
            if (item.id === 0) return 'mdi-view-grid'
            if (item.file === 'dots') return 'mdi-circle-small'
            return 'mdi-coffee-to-go-outline'
        },

        async fetchProducts(categoryId = null) {
            this.loadingProducts = true
            try {
                const { data } = categoryId && categoryId !== '0'
                    ? await productAPI.getByCategory({ category_id: categoryId })
                    : await productAPI.getAll()
                this.products = data.products
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                this.loadingProducts = false
            }
        },


        updateRoute(category) {
            const categorySlug = removeVietnameseTones(category.name)
                .replaceAll(' ', '-')
                .toLowerCase()

            this.$router.push({
                name: 'menuMenu',
                params: {
                    category_name: categorySlug,
                    category_id: category.id
                }
            })
        },

        handleInitialRoute() {
            const categoryName = this.$route.params.category_name
            if (categoryName) {
                const category = this.findCategoryBySlug(categoryName)
                if (category) {
                    this.activeItems = [category.id]
                    this.fetchProducts(category.id)
                }
            }
        },

        findCategoryBySlug(slug) {
            return this.categories.find(category =>
                removeVietnameseTones(category.name)
                    .replaceAll(' ', '-')
                    .toLowerCase() === slug
            )
        },

        handleActiveChange(items) {
            console.log('handleActiveChange được gọi');
            console.log('items là:', items);
            console.log('kiểu dữ liệu của items:', typeof items, Array.isArray(items));
            
            if (items.length > 0) {
                const selectedId = items[items.length - 1];
                this.fetchProducts(selectedId.toString());
                
                // Tìm category tương ứng để cập nhật URL
                const selectedCategory = this.categories.find(cat => cat.id === selectedId);
                if (selectedCategory) {
                    this.updateRoute(selectedCategory);
                }
            } else {
                console.log('items đang rỗng');
            }
        },

    },

    watch: {
        '$route.params': {
            handler(newParams) {
                if (newParams.category_name) {
                    this.handleInitialRoute()
                }
            }
        },
    }
}
</script>

<style scoped>
/* Thêm styles mới cho responsive */
.product-card-responsive {
  height: auto !important;
}
@media (max-width: 600px) {
  .product-card-responsive {
    margin-bottom: 12px;
  }

  .v-col {
    padding: 6px 12px !important;
  }
}
</style>