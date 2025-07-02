<template>
    <v-card v-if="product" elevation="2" class="product-card" @click="navigateToProduct" :ripple="true"
        style="cursor: pointer">
        <!-- Desktop Layout -->
        <div class="d-none d-sm-flex flex-column h-100">
            <div class="image-container">
                <v-img :src="product.image_url" :width="155" :height="155" cover class="rounded-lg bg-grey-lighten-3"
                    :lazy-src="product.image_url" alt="Product Image" />
            </div>

            <v-card-text class="d-flex flex-column h-100">
                <div class="text-subtitle-1 font-weight-bold product-name text-black">
                    {{ product.name }}
                </div>

                <div class="mt-auto d-flex justify-space-between align-center">
                    <span class="text-body-1 text-black">
                        {{ formattedPrice }}đ
                    </span>
                    <div class="add-button-wrapper">
                        <ProductCardDialog v-if="currentID" :currentID="currentID" :dialog="dialog" v-bind="product"
                            :isInProductListing="1" />
                    </div>
                </div>
            </v-card-text>
        </div>

        <!-- Mobile Layout -->
        <div class="d-flex d-sm-none">
            <div class="mobile-image-container">
                <v-img :src="product.image_url" cover class="rounded-lg bg-grey-lighten-3" height="100%"
                    :lazy-src="product.image_url" alt="Product Image" />
            </div>

            <v-card-text class="mobile-content">
                <div class="text-subtitle-1 font-weight-bold mb-2 mobile-product-name text-black">
                    {{ product.name }}
                </div>

                <div class="d-flex justify-space-between align-center">
                    <span class="text-body-1 text-black">
                        {{ formattedPrice }}đ
                    </span>
                    <div class="add-button-wrapper">
                        <ProductCardDialog v-if="currentID" :currentID="currentID" :dialog="dialog" v-bind="product"
                            :isInProductListing="1" />
                    </div>
                </div>
            </v-card-text>
        </div>
    </v-card>
</template>

<script>
import { removeVietnameseTones, formatPrice } from "@/utils/format";
import ProductCardDialog from "./ProductCardDialog.vue";
import { useProductStore } from '@/stores/product'

export default {
    name: "ProductCard",
    components: {
        ProductCardDialog
    },

    props: {
        product: {
            type: Object,
            required: true,
            validator(value) {
                return value &&
                    value.name &&
                    (typeof value.price === 'string' || typeof value.price === 'number') &&
                    value.image_url
            }
        },
        currentID: {
            type: Number,
            default: null
        },
        dialog: {
            type: Boolean,
            default: false
        },
    },

    setup() {
        const productStore = useProductStore()
        return { productStore }
    },

    computed: {
        formattedPrice() {
            return this.product?.price ? formatPrice(this.product.price) : 0;
        }
    },

    methods: {
        async navigateToProduct() {
            try {
                if (!this.product?.name) return;

                const productNameInUrl = removeVietnameseTones(this.product.name)
                    .replaceAll(' ', '-')
                    .toLowerCase();

                await this.productStore.setProductId(this.product.id);

                if (this.$route.name === 'ProductDetail') {
                    await this.$router.push({
                        name: "ProductDetail",
                        params: {
                            product_name_convert: productNameInUrl
                        }
                    });
                } else {
                    await this.$router.push({
                        name: "ProductDetail",
                        params: {
                            product_name_convert: productNameInUrl
                        }
                    });
                }
            } catch (error) {
                console.error('Navigation error:', error);
            }
        }
    }
}
</script>

<style scoped>
.product-card {
    height: 300px;
    display: flex;
    flex-direction: column;
    background: white;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    position: relative;
}

.image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    width: 100%;
}

:deep(.v-img) {
    width: 100%;
    height: 100%;
}

.product-name {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 48px;
    height: 50px;
}

.add-button-wrapper {
    margin-left: 8px;
}

:deep(.v-btn.v-btn--icon) {
    width: 42px;
    height: 42px;
}

:deep(.v-btn--icon .v-icon) {
    font-size: 24px;
}

/* Thêm styles mới cho mobile */
@media (max-width: 600px) {
    .mobile-image-container {
        width: 120px;
        padding: 8px;
    }

    .mobile-content {
        flex: 1;
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
        height: 2.8em;
    }

    .add-button-wrapper {
        transform: scale(0.9);
    }

    .product-card {
        height: auto !important;
        min-height: unset !important;
        max-height: unset !important;
        padding: 0;
    }
}
</style>