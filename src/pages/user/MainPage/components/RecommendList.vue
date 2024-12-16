<template>
    <v-container v-if="recommendProducts.length > 0">
        <v-row>
            <v-col cols="12">
                <h2 class="text-h4 font-weight-bold mb-6">Gợi ý cho bạn</h2>
            </v-col>
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
import { recommendAPI } from '@/api/recommend'
import ProductCard from '@/components/Products/ProductCard.vue'

export default {
    name: 'RecommendList',
    components: {
        ProductCard
    },

    data() {
        return {
            recommendProducts: [
                {
                    id: 1,
                    name: 'Cà phê sữa đá',
                    price: 29000,
                    image_url: 'https://product.hstatic.net/1000075078/product/1696220170_phin-sua-tuoi-banh-flan_0172beb85d08408b8912bf5f1dae7fd9_large.jpg'
                },
                {
                    id: 2,
                    name: 'Trà đào cam sả',
                    price: 45000,
                    image_url: 'https://product.hstatic.net/1000075078/product/1696220170_phin-sua-tuoi-banh-flan_0172beb85d08408b8912bf5f1dae7fd9_large.jpg'
                },
                // Thêm các sản phẩm khác vào đây
            ]
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
            try {
                const response = await recommendAPI.getRecommendation({
                    product_id: this.product_id
                })
                console.log(response)
                this.recommendProducts = response.data
            } catch (error) {
                console.error('Error fetching recommend products:', error)
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
