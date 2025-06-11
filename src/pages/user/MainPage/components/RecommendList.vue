<template>
    <v-container v-if="recommendProducts.length > 0">
        <v-row align="center" justify="center">
            <v-icon class="mr-3" color="primary" size="40">mdi-star</v-icon>
            <span class="text-h4 font-weight-bold">Gợi ý cho bạn</span>
        </v-row>
        <!-- Products Grid -->
        <v-row class="mt-1">
            <template v-if="loadingProducts">
                <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="4" lg="2">
                    <v-skeleton-loader class="product-card-responsive" type="card" height="300"></v-skeleton-loader>
                </v-col>
            </template>
            <template v-else>
                <v-col v-for="product in recommendProducts" :key="product.id" cols="12" sm="6" md="4" lg="2">
                    <ProductCard :product="product" :currentID="product.id" :dialog="dialog"
                        class="product-card-responsive" />
                </v-col>
            </template>
        </v-row>
    </v-container>
</template>

<script>
import { formatPrice } from '@/utils/format'
import { userAPI } from '@/api/user'
import { useCartStore } from '@/stores/cart'
import ProductCard from '@/components/Products/ProductCard.vue'

export default {
    name: 'RecommendList',
    components: {
        ProductCard
    },

    setup() {
        const cartStore = useCartStore()
        return {
            cartStore
        }
    },

    data() {
        return {
            recommendProducts: [],
            loadingProducts: false,
            dialog: false
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
        formattedPrice(price) {
            return formatPrice(price)
        },

        async getRecommendProducts() {
            this.loadingProducts = true
            try {
                //console.log(this.cartItems)
                const response = await userAPI.product.getRecommendations(this.cartItems)
                //console.log(response)
                this.recommendProducts = response.data.recommend_products
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
.v-card {
    transition: transform 0.2s;
}

.v-card:hover {
    transform: translateY(-5px);
}

/* Thêm styles mới cho responsive */
.product-card-responsive {
    height: auto !important;
}

/* Mobile styles */
@media (max-width: 600px) {
    .product-card-responsive {
        margin-bottom: 12px;
    }

    .v-col {
        padding: 6px 12px !important;
    }
}
</style>
