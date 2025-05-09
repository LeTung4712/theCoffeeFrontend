<template>
    <v-container>
        <v-row>
            <!-- Breadcrumbs -->
            <v-col cols="12">
                <v-breadcrumbs :items="breadcrumbs" divider="/">
                    <template v-slot:title="{ item }">
                        <v-breadcrumbs-item :title="item.title" :disabled="item.disabled"
                            @click="navigateToBreadcrumb(item)"></v-breadcrumbs-item>
                    </template>
                </v-breadcrumbs>
            </v-col>
        </v-row>

        <v-row>
            <!-- Menu Tree Column -->
            <v-col cols="12" md="3">
                <v-card flat>
                    <v-card-title class="d-flex align-center">
                        <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
                        Danh mục
                    </v-card-title>

                    <v-card-text>
                        <!-- Loading state -->
                        <div v-if="loadingCategories" class="d-flex justify-center py-4">
                            <v-progress-circular indeterminate color="primary"></v-progress-circular>
                        </div>

                        <!-- Error state -->
                        <v-alert v-else-if="categoryError" type="error" class="mb-4">
                            {{ categoryError }}
                            <v-btn variant="text" color="error" class="mt-2" @click="retryFetchCategories">
                                Thử lại
                            </v-btn>
                        </v-alert>

                        <!-- Menu danh mục -->
                        <v-list v-else density="compact" nav>
                            <!-- Tất cả sản phẩm -->
                            <v-list-item :active="!currentCategoryId" @click="selectCategory(null)"
                                prepend-icon="mdi-view-grid">
                                <v-list-item-title>Tất cả sản phẩm</v-list-item-title>
                            </v-list-item>

                            <!-- Danh mục cha -->
                            <v-list-group v-for="category in rootCategories" :key="category.id"
                                :opened="category.isOpen" :open-on-click="false">
                                <template v-slot:activator="{ props }">
                                    <v-list-item v-bind="props" :active="currentCategoryId === category.id"
                                        @click="selectCategory(category)">
                                        <template v-slot:prepend>
                                            <v-icon>mdi-folder-outline</v-icon>
                                        </template>
                                        <v-list-item-title>{{ category.name }}</v-list-item-title>
                                    </v-list-item>
                                </template>

                                <!-- Danh mục con -->
                                <v-list-item v-for="child in getChildCategories(category.id)" :key="child.id"
                                    :active="currentCategoryId === child.id" @click="selectCategory(child)"
                                    class="pl-4">
                                    <template v-slot:prepend>
                                        <v-icon>mdi-coffee-to-go-outline</v-icon>
                                    </template>
                                    <v-list-item-title>{{ child.name }}</v-list-item-title>
                                </v-list-item>
                            </v-list-group>
                        </v-list>
                    </v-card-text>
                </v-card>

                <!-- Mobile menu -->
                <v-bottom-sheet v-model="mobileMenuOpen" class="d-md-none">
                    <v-card>
                        <v-card-title class="d-flex justify-space-between">
                            <span>Danh mục</span>
                            <v-btn icon @click="mobileMenuOpen = false">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-card-title>

                        <v-card-text>
                            <v-list density="compact" nav>
                                <!-- Tất cả sản phẩm -->
                                <v-list-item :active="!currentCategoryId"
                                    @click="selectCategory(null); mobileMenuOpen = false" prepend-icon="mdi-view-grid">
                                    <v-list-item-title>Tất cả sản phẩm</v-list-item-title>
                                </v-list-item>

                                <!-- Danh mục cha -->
                                <v-list-group v-for="category in rootCategories" :key="category.id"
                                    :opened="category.isOpen" :open-on-click="false">
                                    <template v-slot:activator="{ props }">
                                        <v-list-item v-bind="props" :active="currentCategoryId === category.id"
                                            @click="selectCategory(category); mobileMenuOpen = false">
                                            <template v-slot:prepend>
                                                <v-icon>mdi-folder-outline</v-icon>
                                            </template>
                                            <v-list-item-title>{{ category.name }}</v-list-item-title>
                                        </v-list-item>
                                    </template>

                                    <!-- Danh mục con -->
                                    <v-list-item v-for="child in getChildCategories(category.id)" :key="child.id"
                                        :active="currentCategoryId === child.id"
                                        @click="selectCategory(child); mobileMenuOpen = false" class="pl-4">
                                        <template v-slot:prepend>
                                            <v-icon>mdi-coffee-to-go-outline</v-icon>
                                        </template>
                                        <v-list-item-title>{{ child.name }}</v-list-item-title>
                                    </v-list-item>
                                </v-list-group>
                            </v-list>
                        </v-card-text>
                    </v-card>
                </v-bottom-sheet>
            </v-col>

            <!-- Products Column -->
            <v-col cols="12" md="9">
                <!-- Mobile menu toggle button -->
                <div class="d-md-none mb-4">
                    <v-btn block prepend-icon="mdi-menu" @click="mobileMenuOpen = true" variant="outlined">
                        Danh mục
                    </v-btn>
                </div>

                <!-- Category title -->
                <div class="d-flex justify-space-between align-center mb-4">
                    <h2 class="text-h5">
                        {{ currentCategory ? currentCategory.name : 'Tất cả sản phẩm' }}
                    </h2>
                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-btn icon v-bind="props" variant="text">
                                <v-icon>mdi-sort</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item v-for="(option, index) in sortOptions" :key="index" :value="option.value"
                                @click="sortBy = option.value">
                                <v-list-item-title>{{ option.text }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </div>

                <!-- Products loading state -->
                <div v-if="loadingProducts" class="d-flex flex-column align-center py-8">
                    <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
                    <span class="mt-4">Đang tải sản phẩm...</span>
                </div>

                <!-- Products error state -->
                <v-alert v-else-if="productError" type="error" class="mb-4">
                    {{ productError }}
                    <v-btn variant="text" color="error" class="mt-2" @click="loadProducts">
                        Thử lại
                    </v-btn>
                </v-alert>

                <!-- Empty state -->
                <v-card v-else-if="displayedProducts.length === 0" class="pa-4 text-center" flat>
                    <v-icon size="64" color="grey">mdi-package-variant</v-icon>
                    <h3 class="text-h6 mt-4">Không có sản phẩm</h3>
                    <p class="text-body-2 text-grey">Không tìm thấy sản phẩm nào trong danh mục này</p>
                    <v-btn color="primary" class="mt-4" @click="selectCategory(null)">
                        Xem tất cả sản phẩm
                    </v-btn>
                </v-card>

                <!-- Products grid -->
                <v-row v-else>
                    <v-col v-for="product in displayedProducts" :key="product.id" cols="12" sm="6" md="4" lg="3">
                        <ProductCard :currentID="product.id" :dialog="dialog" :product="product" :isInProductListing="1"
                            class="product-card" @add-to-cart="addToCart(product)" />
                    </v-col>
                </v-row>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="d-flex justify-center mt-6">
                    <v-pagination v-model="currentPage" :length="totalPages" :total-visible="5"></v-pagination>
                </div>
            </v-col>
        </v-row>

        <!-- Snackbar for notifications -->
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout">
            {{ snackbar.text }}
            <template v-slot:actions>
                <v-btn variant="text" @click="snackbar.show = false">
                    Đóng
                </v-btn>
            </template>
        </v-snackbar>
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
            products: [],
            currentCategoryId: null,
            currentCategory: null,
            loadingProducts: false,
            productError: null,
            currentPage: 1,
            itemsPerPage: 12,
            sortBy: 'default',
            mobileMenuOpen: false,
            snackbar: {
                show: false,
                text: '',
                color: 'success',
                timeout: 3000
            },
            sortOptions: [
                { text: 'Mặc định', value: 'default' },
                { text: 'Giá: Thấp đến cao', value: 'price_asc' },
                { text: 'Giá: Cao đến thấp', value: 'price_desc' },
                { text: 'Tên: A-Z', value: 'name_asc' },
                { text: 'Tên: Z-A', value: 'name_desc' },
            ],
            breadcrumbs: [
                { title: 'Trang chủ', disabled: false, href: '/' },
                { title: 'Menu', disabled: false, href: '/menu' },
            ],
        }
    },

    setup() {
        const categoryStore = useCategoryStore()
        const { categories, loading: loadingCategories } = storeToRefs(categoryStore)
        return { categoryStore, categories, loadingCategories }
    },

    computed: {
        rootCategories() {
            // Thêm thuộc tính isOpen cho mỗi danh mục cha
            return this.categories
                .filter(category => category.parent_id === 0 || category.parent_id === null)
                .map(category => {
                    // Kiểm tra xem danh mục này hoặc con của nó có đang được chọn không
                    const isActive = this.currentCategoryId === category.id;
                    const hasActiveChild = this.getChildCategories(category.id)
                        .some(child => child.id === this.currentCategoryId);

                    return {
                        ...category,
                        isOpen: isActive || hasActiveChild
                    };
                });
        },

        sortedProducts() {
            const products = [...this.products];

            switch (this.sortBy) {
                case 'price_asc':
                    return products.sort((a, b) => a.price - b.price);
                case 'price_desc':
                    return products.sort((a, b) => b.price - a.price);
                case 'name_asc':
                    return products.sort((a, b) => a.name.localeCompare(b.name));
                case 'name_desc':
                    return products.sort((a, b) => b.name.localeCompare(a.name));
                default:
                    return products;
            }
        },

        displayedProducts() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.sortedProducts.slice(start, end);
        },

        totalPages() {
            return Math.ceil(this.products.length / this.itemsPerPage);
        }
    },

    created() {
        this.initialize();
    },

    methods: {
        async initialize() {
            try {
                if (this.categories.length === 0) {
                    await this.categoryStore.fetchCategories();
                }

                // Kiểm tra URL hiện tại và tải sản phẩm phù hợp
                await this.handleRouteParams();
            } catch (error) {
                console.error('Error initializing menu:', error);
                this.categoryError = 'Không thể tải danh mục. Vui lòng thử lại sau.';
            }
        },

        getChildCategories(parentId) {
            return this.categories.filter(category => category.parent_id === parentId);
        },

        isParentActive(category) {
            // Chỉ mở dropdown cho danh mục đang được chọn hoặc có con đang được chọn

            // Kiểm tra xem danh mục cha có đang được chọn không
            if (this.currentCategoryId === category.id) {
                return true;
            }

            // Kiểm tra xem có danh mục con nào đang được chọn không
            const children = this.getChildCategories(category.id);
            const hasActiveChild = children.some(child => child.id === this.currentCategoryId);

            // Chỉ trả về true nếu danh mục này hoặc con của nó đang được chọn
            return hasActiveChild;
        },

        async selectCategory(category) {
            // Nếu đang chọn cùng một danh mục, không làm gì cả
            if (this.currentCategoryId === (category ? category.id : null)) {
                return;
            }

            // Cập nhật category hiện tại
            this.currentCategory = category;
            this.currentCategoryId = category ? category.id : null;
            this.currentPage = 1;

            // Cập nhật URL
            this.updateRoute();

            // Tải sản phẩm cho tất cả các loại danh mục
            await this.loadProducts();
        },

        async loadProducts() {
            // Nếu đang tải, không gọi lại
            if (this.loadingProducts) {
                return;
            }

            this.loadingProducts = true;
            this.productError = null;

            try {
                let response;
                if (this.currentCategoryId) {
                    response = await productAPI.getByCategory({ category_id: this.currentCategoryId });
                } else {
                    response = await productAPI.getAll();
                }

                this.products = response.data.products || [];
            } catch (error) {
                console.error('Lỗi khi tải sản phẩm:', error);
                this.productError = 'Không thể tải sản phẩm. Vui lòng thử lại sau.';
                this.products = [];
            } finally {
                this.loadingProducts = false;
            }
        },

        updateRoute() {
            if (!this.currentCategory) {
                this.$router.push('/collections/menu/0').catch(() => { });
                return;
            }

            const categorySlug = removeVietnameseTones(this.currentCategory.name)
                .replaceAll(' ', '-')
                .toLowerCase();

            this.$router.push(`/collections/${categorySlug}/${this.currentCategory.id}`).catch(() => { });
        },

        async handleRouteParams() {
            const categoryId = this.$route.params.category_id;

            // Nếu URL không thay đổi và đã có sản phẩm, không cần tải lại
            if (categoryId === this.currentCategoryId && this.products.length > 0) {
                return;
            }

            if (categoryId) {
                // Tìm category từ ID
                const category = this.categories.find(cat => cat.id.toString() === categoryId.toString());

                if (category) {
                    this.currentCategory = category;
                    this.currentCategoryId = category.id;

                    // Tải sản phẩm cho tất cả các loại danh mục
                    await this.loadProducts();
                } else {
                    this.currentCategory = null;
                    this.currentCategoryId = null;
                    await this.loadProducts();
                }
            } else {
                this.currentCategory = null;
                this.currentCategoryId = null;
                await this.loadProducts();
            }
        },

        retryFetchCategories() {
            this.categoryError = null;
            this.categoryStore.fetchCategories()
                .then(() => this.handleRouteParams());
        },

        addToCart(product) {
            this.snackbar = {
                show: true,
                text: `Đã thêm ${product.name} vào giỏ hàng`,
                color: 'success',
                timeout: 3000
            };
        },

        navigateToBreadcrumb(item) {
            if (item.disabled) return;
            if (item.href) {
                this.$router.push(item.href);
            }
        },
    },

    watch: {
        '$route.params': {
            async handler() {
                await this.handleRouteParams();
            },
            deep: true
        },

        sortBy() {
            // Reset trang khi thay đổi sắp xếp
            this.currentPage = 1;
        },

        currentPage() {
            // Cuộn lên đầu trang khi đổi trang
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
}
</script>

<style scoped>
/* Thêm styles mới cho responsive */
.product-card {
    height: 100% !important;
    display: flex;
    flex-direction: column;
}

/* Animations */
.v-enter-active,
.v-leave-active {
    transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

@media (max-width: 600px) {
    .product-card {
        margin-bottom: 12px;
    }

    .v-col {
        padding: 6px 12px !important;
    }
}
</style>