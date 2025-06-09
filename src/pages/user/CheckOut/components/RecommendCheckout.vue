<template>
    <v-card class="mt-6" v-if="recommendProducts.length > 0">
        <v-card-title class="primary--text">
            <v-icon color="primary" class="mr-2">mdi-tag-multiple</v-icon>
            Có thể bạn cũng thích
        </v-card-title>
        <v-card-text>
            <v-row>
                <v-col v-for="product in recommendProducts" :key="product.id" cols="12" sm="6" md="4" lg="3" xl="2">
                    <ProductCard :product="product" :currentID="product.id" :dialog="false"
                        class="mobile-product-card" />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import { userAPI } from '@/api/user'
import { useCartStore } from '@/stores/cart'
import { useNotificationStore } from '@/stores/notification'
import ProductCard from '@/components/Products/ProductCard.vue'

export default {
    name: 'RecommendCheckout',

    components: {
        ProductCard
    },

    setup() {
        const cartStore = useCartStore()
        const notificationStore = useNotificationStore()
        return { cartStore, notificationStore }
    },

    data() {
        return {
            recommendProducts: [],
            loadingProducts: false
        }
    },

    computed: {
        cartItems() {
            return this.cartStore.cartItemIds
        }
    },

    created() {
        this.getRecommendProducts()
    },

    methods: {
        async getRecommendProducts() {
            this.loadingProducts = true
            try {
                const response = await userAPI.product.getRecommendations({
                    cartItems: this.cartItems
                })
                this.recommendProducts = response.data.recommend_products.slice(0, 6) // Giới hạn 6 sản phẩm
            } catch (error) {
                console.error('Error fetching recommend products:', error)
            } finally {
                this.loadingProducts = false
            }
        }
    }
}
</script>

<style scoped>
.mobile-product-card {
    height: auto !important;
}

@media (max-width: 600px) {
    .mobile-product-card {
        height: 120px !important;
    }

    .mobile-product-card :deep(.v-card) {
        height: 100% !important;
    }

    .mobile-product-card :deep(.image-container) {
        padding: 4px !important;
    }

    .mobile-product-card :deep(.v-img) {
        height: 100px !important;
    }

    .mobile-product-card :deep(.v-card-text) {
        padding: 8px !important;
    }

    .mobile-product-card :deep(.product-name) {
        font-size: 0.875rem !important;
        min-height: unset !important;
        height: auto !important;
        -webkit-line-clamp: 1 !important;
    }
}
</style>