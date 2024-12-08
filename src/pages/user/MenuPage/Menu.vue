<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="4" lg="3" class="mt-8">
                <!-- <div v-if="loadingCategories" class="d-flex justify-center">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </div> -->

                <v-treeview
                    :items="menuItems"
                    item-props
                    selectable
                >
                    <template v-slot:prepend="{ item }">
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
                    <v-col v-for="product in products" :key="product.id" cols="12" sm="6" md="4" lg="3">
                        <ProductCard :product="product" :current-id="currentProductId" :dialog="dialog"
                            :image-size="155" class="product-card-responsive" />
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
            activeCategory: null,
            openCategories: [],
            currentProductId: null,
            dialog: false,
            products: [],
            menuItems: [
                {
                    title: "Tất cả",
                    id: 0
                },
                {
                    title: "Cà Phê",
                    id: 1,
                    children: [
                        {
                            title: "Cà Phê Việt Nam",
                            id: 9,
                            file: "dots"
                        },
                        {
                            title: "Cà Phê Máy",
                            id: 10,
                            file: "dots"
                        },
                        {
                            title: "Cold Brew",
                            id: 15,
                            file: "dots"
                        }
                    ]
                },
                {
                    title: "Trà",
                    id: 4,
                    children: [
                        {
                            title: "Trà trái cây",
                            id: 11,
                            file: "dots"
                        },
                        {
                            title: "Trà sữa Macchiato",
                            id: 12,
                            file: "dots"
                        }
                    ]
                },
                {
                    title: "Hi-Tea Heathy",
                    id: 5,
                    children: [
                        {
                            title: "Hi-Tea Trà",
                            id: 20,
                            file: "dots"
                        },
                        {
                            title: "Hi-Tea Đá Tuyết",
                            id: 21,
                            file: "dots"
                        }
                    ]
                },
                {
                    title: "Bánh & Snack",
                    id: 6,
                    children: [
                        {
                            title: "Bánh mặn",
                            id: 13,
                            file: "dots"
                        },
                        {
                            title: "Snack",
                            id: 14,
                            file: "dots"
                        },
                        {
                            title: "Bánh ngọt",
                            id: 16,
                            file: "dots"
                        }
                    ]
                },
                {
                    title: "Tại Nhà",
                    id: 7,
                    children: [
                        {
                            title: "Cà phê tại nhà",
                            id: 17,
                            file: "dots"
                        },
                        {
                            title: "Trà tại nhà",
                            id: 18,
                            file: "dots"
                        }
                    ]
                },
                {
                    title: "Thức uống khác",
                    id: 8,
                    children: [
                        {
                            title: "Chocolate",
                            id: 19,
                            file: "dots"
                        }
                    ]
                }
            ],
            loadingProducts: false,
        }
    },

    setup() {
        const categoryStore = useCategoryStore()
        const { categories, loading: loadingCategories } = storeToRefs(categoryStore)
        return { categoryStore, categories, loadingCategories }
    },

    created() {
        this.initializeMenu()
    },

    methods: {
        async initializeMenu() {
            try {
                await this.categoryStore.fetchCategories()
                //this.buildMenuItems()
                await this.fetchProducts()
                this.handleInitialRoute()
                console.log('Menu Items after build:', this.menuItems)
            } catch (error) {
                console.error('Error initializing menu:', error)
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

        // buildMenuItems() {
        //     if (!this.categories) return

        //     const allProducts = {
        //         name: "Tất cả",
        //         id: 0,
        //     }

        //     const parentCategories = this.categories
        //         .filter(cat => cat.parent_id === 0 || cat.parent_id === null)
        //         .map(parent => ({
        //             name: parent.name,
        //             id: parent.id,
        //             children: this.getChildCategories(parent.id)
        //         }))
        //         .filter(category => category.children.length > 0)

        //     this.menuItems = [allProducts, ...parentCategories]
        //     console.log('Menu Items after build:', this.menuItems)
        // },

        getChildCategories(parentId) {
            const children = this.categories
                .filter(cat => cat.parent_id === parentId)
                .map(child => ({
                    name: child.name,
                    id: child.id,
                    file: 'dots'
                }))

            return children
        },

        handleCategorySelect(items) {
            if (!items.length) return
            const selectedCategory = items[0]
            this.fetchProducts(selectedCategory.id)
            this.updateRoute(selectedCategory)
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
                    this.activeCategory = [category]
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
        }
    },

    watch: {
        '$route.params': {
            handler(newParams) {
                if (newParams.category_name) {
                    this.handleInitialRoute()
                }
            }
        },
        categories: {
            handler(newCategories) {
                if (newCategories && newCategories.length > 0) {
                    this.buildMenuItems()
                }
            },
            immediate: true
        }
    }
}
</script>

<style scoped>
.v-treeview {
    background: white;
    border-radius: 4px;
    padding: 16px;
}

.v-treeview-node__root {
    min-height: 40px;
}

.v-treeview-node__label {
    font-size: 14px;
}
</style>