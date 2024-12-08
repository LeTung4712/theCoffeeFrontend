<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="4" lg="3" class="mt-8">
                <v-treeview
                    v-model:active="activeCategory"
                    :open="openCategories"
                    :items="menuItems"
                    item-children="children"
                    item-title="name"
                    return-object
                    activatable
                    open-on-click
                    transition
                    @update:active="handleCategorySelect"
                    @update:open="handleCategoryOpen"
                >
                    <template #prepend="{ item }">
                        <v-icon>
                            {{ item.file ? 'mdi-circle-small' : (item.children ? 'mdi-coffee-to-go-outline' : '') }}
                        </v-icon>
                    </template>
                </v-treeview>
            </v-col>

            <v-col cols="12" md="8" lg="9" class="mt-8">
                <v-row>
                    <v-col
                        v-for="product in products"
                        :key="product.id"
                        cols="12"
                        sm="6"
                        md="4"
                        lg="3"
                    >
                        <ProductCard
                            :product="product"
                            :current-id="currentProductId"
                            :dialog="dialog"
                            :image-size="155"
                            class="product-card-responsive"
                        />
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { removeVietnameseTones } from "@/utils/format";
import { categoryAPI } from "@/api/category";
import { productAPI } from "@/api/product";
import ProductCard from "@/components/Products/ProductCard.vue";

export default {
    name: "MenuCategory",
    components: {
        ProductCard,
    },

    data() {
        return {
            activeCategory: [],
            openCategories: ['public'],
            currentProductId: null,
            dialog: false,
            categories: [],
            products: [],
            menuItems: [],
        }
    },

    created() {
        this.initializeMenu()
    },

    methods: {
        async initializeMenu() {
            await this.fetchCategories()
            await this.fetchProducts()
            this.handleInitialRoute()
        },

        async fetchCategories() {
            try {
                const { data } = await categoryAPI.getAll()
                console.log(data)
                this.categories = data.categories
                this.buildMenuItems()
            } catch (error) {
                console.error('Error fetching categories:', error)
            }
        },

        async fetchProducts(categoryId = null) {
            try {
                const { data } = categoryId 
                    ? await productAPI.getByCategory({category_id: categoryId})
                    : await productAPI.getAll()
                this.products = data.products
            } catch (error) {
                console.error('Error fetching products:', error)
            }
        },

        buildMenuItems() {
            const allProducts = {
                name: "Tất cả",
                id: '0',
            }

            const parentCategories = this.categories
                .filter(cat => cat.parent_id === 0)
                .map(parent => ({
                    name: parent.name,
                    id: parent.id,
                    children: this.getChildCategories(parent.id)
                }))

            this.menuItems = [allProducts, ...parentCategories]
        },

        getChildCategories(parentId) {
            const children = this.categories
                .filter(cat => cat.parent_id === parentId)
                .map(child => ({
                    name: child.name,
                    id: child.id,
                    file: 'dots'
                }))

            return children.length ? children : [{
                name: this.categories.find(c => c.id === parentId)?.name,
                id: parentId,
                file: 'dots'
            }]
        },

        handleCategorySelect(items) {
            if (!items.length) return
            const selectedCategory = items[0]
            this.fetchProducts(selectedCategory.id)
            this.updateRoute(selectedCategory)
        },

        handleCategoryOpen(openItems) {
            // Xử lý khi mở/đóng category
            console.log('Open categories:', openItems)
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
        }
    }
}
</script>

<style scoped>
.menu_bar::after {
    content: "";
    position: absolute;
    width: 2px;
    top: 12px;
    background: rgba(0, 0, 0, 0.15);
}

.product-card-responsive {
    height: 100%;
}
</style>