<template>
    <v-dialog :model-value="modelValue" @update:modelValue="onDialogUpdate" max-width="700" class="mt-16">
        <v-card>
            <v-card-title class="d-flex align-center">
                <v-btn icon @click="closeDialog" aria-label="Đóng hộp thoại tìm kiếm">
                    <v-icon size="32" color="text-secondary">mdi-close</v-icon>
                </v-btn>
                <span class="mx-auto">Tìm kiếm sản phẩm</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="search-dialog-content">
                <v-text-field v-model="searchKeyword" prepend-icon="mdi-magnify" placeholder="Nhập tên sản phẩm"
                    variant="outlined" density="comfortable" :loading="loading" hide-details class="sticky-search" />
                <v-row class="mt-4">
                    <v-col v-if="loading" cols="12" class="d-flex justify-center">
                        <v-progress-circular indeterminate color="primary" />
                    </v-col>
                    <v-col v-else-if="!loading && products.length === 0 && searchKeyword" cols="12" class="text-center">
                        <span>Không tìm thấy sản phẩm phù hợp</span>
                    </v-col>
                    <v-col v-for="product in products" :key="product.id" cols="12" sm="6" md="3" lg="3">
                        <ProductCard :product="product" :currentID="product.id" :dialog="false"
                            class="product-card-responsive" @click.native="selectProduct(product)" />
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import ProductCard from './ProductCard.vue';
import { userAPI } from '@/api/user';

export default {
    name: 'ProductSearchDialog',
    components: { ProductCard },
    props: {
        modelValue: {
            type: Boolean,
            required: true
        }
    },
    emits: ['update:modelValue', 'select'],
    data() {
        return {
            searchKeyword: '',
            products: [],
            loading: false,
            debounceTimeout: null
        };
    },
    watch: {
        searchKeyword(newVal) {
            if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
                this.searchProducts(newVal);
            }, 400);
        },
        modelValue(val) {
            if (!val) {
                this.searchKeyword = '';
                this.products = [];
            }
        }
    },
    methods: {
        onDialogUpdate(val) {
            this.$emit('update:modelValue', val);
        },
        closeDialog() {
            this.$emit('update:modelValue', false);
            this.searchKeyword = '';
            this.products = [];
        },
        async searchProducts(keyword) {
            if (!keyword) {
                this.products = [];
                return;
            }
            this.loading = true;
            try {
                const response = await userAPI.product.search(keyword);
                this.products = response?.data?.products || [];
            } catch (e) {
                this.products = [];
            } finally {
                this.loading = false;
            }
        },
        selectProduct(product) {
            this.$emit('select', product);
            this.closeDialog();
        }
    }
};
</script>

<style scoped>
.search-dialog-content {
    min-height: 200px;
}

.product-card-responsive {
    cursor: pointer;
}

/* Mobile styles cho product card trong dialog */
@media (max-width: 600px) {
    .v-col {
        padding: 4px 4px !important;
    }
}
</style>