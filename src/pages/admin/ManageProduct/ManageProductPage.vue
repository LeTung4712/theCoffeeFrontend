<template>
    <v-container>
        <!-- Header Section -->
        <v-col cols="12">
            <v-row justify="center" class="pa-4">
                <h2>QUẢN LÝ SẢN PHẨM</h2>
            </v-row>
        </v-col>
        
        <!-- Thêm toolbar buttons -->
        <v-row>
            <v-col cols="12">
                <v-card flat>
                    <v-card-text class="d-flex flex-wrap gap-2">
                        <v-btn color="primary" prepend-icon="mdi-plus" @click="dialogs.product = true">
                            Thêm sản phẩm
                        </v-btn>
                        <v-btn color="success" prepend-icon="mdi-folder-plus" @click="dialogs.category = true">
                            Thêm danh mục
                        </v-btn>
                        <v-btn color="info" prepend-icon="mdi-plus-circle" @click="dialogs.topping = true">
                            Thêm topping
                        </v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="4" lg="3">
                <div class="sticky-treeview">
                    <div v-if="loadingCategories" class="d-flex justify-center">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </div>
                    <v-treeview :items="menuItems" activatable item-key="id" open-on-click v-model="activeItems"
                        @update:active="handleActiveChange">
                        <template #prepend="{ item }">
                            <v-icon>{{ getItemIcon(item) }}</v-icon>
                        </template>
                    </v-treeview>
                </div>
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

        <!-- Add dialogs -->
        <ProductDialog v-model="dialogs.product" @refresh="fetchProducts" />
        <CategoryDialog v-model="dialogs.category" @refresh="initializeMenu" />
        <ToppingDialog v-model="dialogs.topping" />
    </v-container>
</template>

<script>
import { productAPI } from "@/api/product";
import ProductCard from "@/components/Products/ProductCard.vue";
import { useCategoryStore } from '@/stores/category'
import { storeToRefs } from 'pinia'
import ProductDialog from './components/ProductDialog.vue'
import CategoryDialog from './components/CategoryDialog.vue'
import ToppingDialog from './components/ToppingDialog.vue'

export default {
    name: "ManageProductPage",
    components: {
        ProductCard,
        ProductDialog,
        CategoryDialog,
        ToppingDialog,
    },

    data() {
        return {
            dialog: false,
            categoryType: 0,
            products: [],
            loadingProducts: false,
            activeItems: [],
            dialogs: {
                product: false,
                category: false,
                topping: false,
            },
            newProduct: {
                name: "trà đá",
                category_id: 21,
                description: "Thức uống",
                image_url: "https://",
                price: 39000,
                price_sale: 0,
                active: 1,
                toppings: []
            }
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

.gap-2 {
    gap: 8px;
}

@media (max-width: 600px) {
    .v-card-text {
        padding: 8px;
    }
}

.sticky-treeview {
    position: sticky;
    top: 80px;
    /* Điều chỉnh khoảng cách từ top tùy theo layout header */
    max-height: calc(100vh - 100px);
    /* Đảm bảo treeview không dài quá màn hình */
    overflow-y: auto;
}
</style>