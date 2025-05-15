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
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <!-- Menu Tree Column - Chỉ hiển thị trên desktop -->
            <v-col cols="12" md="3" class="d-none d-md-block">
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

                        <!-- Menu danh mục -->
                        <v-list v-else density="compact" nav>
                            <!-- Tất cả sản phẩm -->
                            <v-list-item :active="!currentCategory" @click="selectCategory(null)"
                                prepend-icon="mdi-view-grid">
                                <v-list-item-title>Tất cả sản phẩm</v-list-item-title>
                            </v-list-item>

                            <!-- Danh mục cha -->
                            <v-list-group v-for="category in rootCategories" :key="category.id"
                                :opened="category.isOpen" :open-on-click="false">
                                <template v-slot:activator="{ props }">
                                    <v-list-item v-bind="props"
                                        :active="currentCategory && currentCategory.id === category.id"
                                        @click="selectCategory(category)">
                                        <template v-slot:prepend>
                                            <v-icon>mdi-folder-outline</v-icon>
                                        </template>
                                        <v-list-item-title>{{ category.name }}</v-list-item-title>
                                    </v-list-item>
                                </template>

                                <!-- Danh mục con -->
                                <v-list-item v-for="child in getChildCategories(category.id)" :key="child.id"
                                    :active="currentCategory && currentCategory.id === child.id"
                                    @click="selectCategory(child)" class="pl-4">
                                    <template v-slot:prepend>
                                        <v-icon>mdi-coffee-to-go-outline</v-icon>
                                    </template>
                                    <v-list-item-title>{{ child.name }}</v-list-item-title>
                                </v-list-item>
                            </v-list-group>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Mobile menu toggle button -->
            <v-col cols="12" class="d-md-none mb-4">
                <v-btn block prepend-icon="mdi-menu" @click="mobileMenuOpen = true" variant="outlined">
                    Danh mục
                </v-btn>
            </v-col>

            <!-- Products Column -->
            <v-col cols="12" md="9">
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

                <!-- Empty state -->
                <v-card v-else-if="products.length === 0" class="pa-4 text-center">
                    <v-icon size="64" color="grey">mdi-package-variant</v-icon>
                    <h3 class="text-h6 mt-4">Không có sản phẩm</h3>
                    <p class="text-body-2 text-grey">Không tìm thấy sản phẩm nào trong danh mục này</p>
                </v-card>

                <!-- Products grid -->
                <v-row v-else>
                    <v-col v-for="product in displayedProducts" :key="product.id" cols="12" sm="6" md="4" lg="3">
                        <v-card class="product-card" elevation="2">
                            <div class="product-container">
                                <div class="image-container">
                                    <v-img :src="product.image_url" :width="155" :height="155" cover
                                        class="rounded-lg bg-grey-lighten-3" />
                                </div>

                                <v-card-text class="d-flex flex-column h-100">
                                    <div class="text-subtitle-1 font-weight-bold product-name text-black">
                                        {{ product.name }}
                                    </div>

                                    <div class="mt-auto d-flex justify-space-between align-center">
                                        <span class="text-body-1 text-black price-text">
                                            {{ formatPrice(product.price) }}đ
                                        </span>
                                        <div class="action-wrapper d-flex">
                                            <v-btn icon="mdi-pencil" color="primary" variant="text" size="small"
                                                @click="editProduct(product)" title="Chỉnh sửa sản phẩm"
                                                class="scale-button" density="compact" />
                                            <v-btn icon="mdi-delete" color="error" variant="text" size="small"
                                                @click="confirmDelete(product)" title="Xóa sản phẩm"
                                                class="scale-button ml-1" density="compact" />
                                        </div>
                                    </div>
                                </v-card-text>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="d-flex justify-center mt-6">
                    <v-pagination v-model="currentPage" :length="totalPages" :total-visible="5"></v-pagination>
                </div>
            </v-col>
        </v-row>

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
                        <v-list-item :active="!currentCategory" @click="selectCategory(null)"
                            prepend-icon="mdi-view-grid">
                            <v-list-item-title>Tất cả sản phẩm</v-list-item-title>
                        </v-list-item>

                        <!-- Danh mục cha -->
                        <v-list-group v-for="category in rootCategories" :key="category.id" :opened="category.isOpen"
                            open-on-click>
                            <template v-slot:activator="{ props }">
                                <v-list-item v-bind="props"
                                    :active="currentCategory && currentCategory.id === category.id"
                                    @click.stop="handleMobileParentClick(category, $event)">
                                    <template v-slot:prepend>
                                        <v-icon>mdi-folder-outline</v-icon>
                                    </template>
                                    <v-list-item-title>{{ category.name }}</v-list-item-title>
                                </v-list-item>
                            </template>

                            <!-- Danh mục con -->
                            <v-list-item v-for="child in getChildCategories(category.id)" :key="child.id"
                                :active="currentCategory && currentCategory.id === child.id"
                                @click="selectCategory(child)" class="pl-4">
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

        <!-- Add dialogs -->
        <ProductDialog v-model="dialogs.product" @refresh="fetchProducts" :edit-product="selectedProduct" />
        <CategoryDialog v-model="dialogs.category" @refresh="initializeMenu" />

        <!-- Xác nhận xóa -->
        <v-dialog v-model="confirmDeleteDialog" max-width="400px">
            <v-card>
                <v-card-title class="text-h5">Xác nhận xóa</v-card-title>
                <v-card-text>
                    Bạn có chắc chắn muốn xóa sản phẩm "{{ selectedProduct ? selectedProduct.name : '' }}" không?
                    <div class="text-subtitle-2 mt-2 text-red">Hành động này không thể hoàn tác.</div>

                    <v-text-field v-model="deleteConfirmation" label="Nhập DELETE để xác nhận" variant="outlined"
                        class="mt-4" density="comfortable"
                        :rules="[v => v === 'DELETE' || 'Vui lòng nhập DELETE để xác nhận']"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="text" @click="cancelDelete">Hủy</v-btn>
                    <v-btn color="error" @click="deleteProduct" :loading="deletingProduct"
                        :disabled="deleteConfirmation !== 'DELETE'">
                        Xóa
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

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
import { productAPI } from "@/api/product";
import ProductCard from "@/components/Products/ProductCard.vue";
import { useCategoryStore } from '@/stores/category'
import { storeToRefs } from 'pinia'
import ProductDialog from './components/ProductDialog.vue'
import CategoryDialog from './components/CategoryDialog.vue'
import { removeVietnameseTones, formatPrice } from "@/utils/format";
import { useNotificationStore } from '@/stores/notification'

export default {
    name: "ManageProductPage",
    components: {
        ProductCard,
        ProductDialog,
        CategoryDialog,
    },

    data() {
        return {
            dialog: false,
            categoryType: 0,
            products: [],
            loadingProducts: false,
            currentCategory: null,
            mobileMenuOpen: false,
            dialogs: {
                product: false,
                category: false,
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
            },
            currentPage: 1,
            itemsPerPage: 12,
            sortBy: 'default',
            sortOptions: [
                { text: 'Mặc định', value: 'default' },
                { text: 'Giá: Thấp đến cao', value: 'price_asc' },
                { text: 'Giá: Cao đến thấp', value: 'price_desc' },
                { text: 'Tên: A-Z', value: 'name_asc' },
                { text: 'Tên: Z-A', value: 'name_desc' },
            ],
            snackbar: {
                show: false,
                text: '',
                color: 'success',
                timeout: 3000
            },
            selectedProduct: null,
            confirmDeleteDialog: false,
            deletingProduct: false,
            deleteConfirmation: ''
        }
    },

    setup() {
        const categoryStore = useCategoryStore()
        const notificationStore = useNotificationStore()
        const { categories, loading: loadingCategories, menuItems } = storeToRefs(categoryStore)
        return { categoryStore, categories, loadingCategories, menuItems, notificationStore }
    },

    computed: {
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
        },

        rootCategories() {
            // Thêm thuộc tính isOpen cho mỗi danh mục cha
            return this.categories
                .filter(category => category.parent_id === 0 || category.parent_id === null)
                .map(category => {
                    // Kiểm tra xem danh mục này hoặc con của nó có đang được chọn không
                    const isActive = this.currentCategory && this.currentCategory.id === category.id;
                    const hasActiveChild = this.currentCategory &&
                        this.getChildCategories(category.id).some(child => child.id === this.currentCategory.id);

                    return {
                        ...category,
                        isOpen: isActive || hasActiveChild
                    };
                });
        }
    },

    created() {
        this.initializeMenu();
    },

    mounted() {
        // Thêm sự kiện lắng nghe route change
        this.$watch(
            () => [this.$route.params.category_id, this.$route.params.category_name],
            () => {
                this.handleInitialRoute();
            },
            { immediate: true }
        );
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

        formatPrice(price) {
            return formatPrice(price);
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
                this.products = data.products || [];

                // Cập nhật thông tin category hiện tại
                if (categoryId && categoryId !== '0') {
                    this.currentCategory = this.categories.find(cat => cat.id.toString() === categoryId.toString());
                } else {
                    this.currentCategory = null;
                }

                // Reset trang
                this.currentPage = 1;
            } catch (error) {
                console.error('Error fetching products:', error)
                this.notificationStore.error('Không thể tải danh sách sản phẩm', 3000)
                this.products = [];
            } finally {
                this.loadingProducts = false
            }
        },

        updateRoute(category) {
            if (!category) return;

            const categorySlug = removeVietnameseTones(category.name)
                .replaceAll(' ', '-')
                .toLowerCase();

            this.$router.push({
                name: 'ManageProductsCategory',
                params: {
                    category_name: categorySlug,
                    category_id: category.id
                }
            }).catch(err => {
                if (err.name !== 'NavigationDuplicated') {
                    console.error('Lỗi chuyển trang:', err);
                }
            });
        },

        handleInitialRoute() {
            const categoryId = this.$route.params.category_id;
            const categoryName = this.$route.params.category_name;

            // Nếu có category_id trong URL
            if (categoryId) {
                // Tìm category theo ID trước
                const categoryById = this.categories.find(cat => cat.id.toString() === categoryId.toString());

                if (categoryById) {
                    this.currentCategory = categoryById;
                    this.fetchProducts(categoryById.id);
                    return;
                }
            }

            // Nếu có category_name trong URL
            if (categoryName && categoryName !== 'menu') {
                const categoryBySlug = this.findCategoryBySlug(categoryName);

                if (categoryBySlug) {
                    this.currentCategory = categoryBySlug;
                    this.fetchProducts(categoryBySlug.id);
                    return;
                }
            }

            // Mặc định: Hiển thị tất cả sản phẩm
            this.currentCategory = null;
            this.fetchProducts();
        },

        findCategoryBySlug(slug) {
            return this.categories.find(category =>
                removeVietnameseTones(category.name)
                    .replaceAll(' ', '-')
                    .toLowerCase() === slug
            )
        },

        selectCategory(category) {
            // Cập nhật category hiện tại
            this.currentCategory = category;
            this.currentPage = 1;

            // Tải sản phẩm tương ứng
            this.fetchProducts(category ? category.id : null);

            // Cập nhật URL nếu có danh mục
            if (category) {
                this.updateRoute(category);
            } else {
                // Nếu chọn "Tất cả sản phẩm"
                this.$router.push({
                    name: 'ManageProducts'
                }).catch(err => {
                    if (err.name !== 'NavigationDuplicated') {
                        console.error('Lỗi chuyển trang:', err);
                    }
                });
            }

            // Đóng menu mobile nếu đang mở
            this.mobileMenuOpen = false;
        },

        getChildCategories(parentId) {
            return this.categories.filter(category => category.parent_id === parentId);
        },

        handleMobileParentClick(category, event) {
            event.stopPropagation();
            this.selectCategory(category);
        },

        // Chức năng chỉnh sửa sản phẩm
        editProduct(product) {
            this.selectedProduct = { ...product };
            this.dialogs.product = true;
        },

        // Hiển thị dialog xác nhận xóa
        confirmDelete(product) {
            this.selectedProduct = product;
            this.confirmDeleteDialog = true;
            this.deleteConfirmation = '';
        },

        // Thực hiện xóa sản phẩm
        async deleteProduct() {
            if (!this.selectedProduct) return;

            if (this.deleteConfirmation !== 'DELETE') {
                return;
            }

            this.deletingProduct = true;
            try {
                await productAPI.delete({ id: this.selectedProduct.id });

                // Cập nhật danh sách sản phẩm sau khi xóa
                const currentCategoryId = this.currentCategory ? this.currentCategory.id : null;
                await this.fetchProducts(currentCategoryId);

                this.confirmDeleteDialog = false;
                this.deleteConfirmation = '';
                this.notificationStore.success(`Đã xóa sản phẩm ${this.selectedProduct.name}`, 3000);
                this.selectedProduct = null;
            } catch (error) {
                console.error('Lỗi khi xóa sản phẩm:', error);
                this.notificationStore.error('Không thể xóa sản phẩm', 3000);
            } finally {
                this.deletingProduct = false;
            }
        },

        // Đóng dialog xác nhận xóa
        cancelDelete() {
            this.confirmDeleteDialog = false;
            this.deleteConfirmation = '';
        },
    },

    watch: {
        '$route.params': {
            handler(newParams) {
                if (newParams.category_id || newParams.category_name) {
                    this.handleInitialRoute();
                }
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
    position: relative;
    cursor: default;
}

.product-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    width: 100%;
}

.product-name {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 48px;
}

.price-text {
    font-weight: 500;
    max-width: 60%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.action-wrapper {
    display: flex;
    align-items: center;
}

.ml-1 {
    margin-left: 2px;
}

.scale-button {
    transition: transform 0.2s ease;
}

.scale-button:hover {
    transform: scale(1.15);
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

.gap-2 {
    gap: 8px;
}

@media (max-width: 600px) {
    .v-card-text {
        padding: 8px;
    }
}
</style>