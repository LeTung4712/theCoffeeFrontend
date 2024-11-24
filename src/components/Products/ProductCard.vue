<template>
    <v-card elevation="2" class="product-card" @click="navigateToProduct" :ripple="true" style="cursor: pointer">
        <!-- Desktop Layout -->
        <div class="d-none d-sm-flex flex-column h-100">
            <div class="image-container">
                <v-img :src="product.image_url" :width="imageSize" :height="imageSize" cover class="rounded-lg bg-grey-lighten-3" />
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
                        <ProductCardDialog :currentID="currentID" :dialog="dialog" v-bind="product" :isInProductListing="1" />
                    </div>
                </div>
            </v-card-text>
        </div>

        <!-- Mobile Layout -->
        <div class="d-flex d-sm-none">
            <div class="mobile-image-container">
                <v-img :src="product.image_url" cover class="rounded-lg bg-grey-lighten-3" height="100%" />
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
                        <ProductCardDialog :currentID="currentID" :dialog="dialog" v-bind="product" :isInProductListing="1" />
                    </div>
                </div>
            </v-card-text>
        </div>
    </v-card>
</template>

<script>
import { removeVietnameseTones } from "@/utils/format";
import ProductCardDialog from "./ProductCardDialog.vue";

export default {
    name: "ProductCard",
    components: {
        ProductCardDialog
    },
    props: {
        product: {
            type: Object,
            required: true
        },
        currentID: String,
        dialog: Boolean,
        imageSize: {
            type: Number,
            default: 155
        }
    },
    computed: {
        formattedPrice() {
            return this.product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
    },
    methods: {
        navigateToProduct() {
            const productNameInUrl = removeVietnameseTones(this.product.name)
                .replaceAll(' ', '-')
                .toLowerCase();

            this.$router.push({
                path: `/products/${productNameInUrl}`
            });
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
}
</style>