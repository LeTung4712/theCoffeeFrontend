<template>
    <v-card class="mt-6" v-if="recommendProducts.length > 0">
        <v-card-title class="primary--text">
            <v-icon color="primary" class="mr-2">mdi-tag-multiple</v-icon>
            Có thể bạn cũng thích
        </v-card-title>
        <v-card-text>
            <v-row>
                <v-col v-for="product in recommendProducts" :key="product.id" cols="6" sm="4" md="3" lg="2">
                    <v-card class="product-card" elevation="2">
                        <v-img :src="product.image_url" height="120" class="product-img"></v-img>
                        <v-card-title class="text-subtitle-1 text-wrap">{{ product.name }}</v-card-title>
                        <v-card-text class="pt-0">
                            <div class="font-weight-bold primary--text">{{ formattedPrice(product.price) }}đ</div>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="primary" variant="text" block @click="addToCart(product)">
                                <v-icon size="small" start>mdi-cart-plus</v-icon> Thêm nhanh
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import { formatPrice } from '@/utils/format'
import { recommendAPI } from '@/api/recommend'
import { useCartStore } from '@/stores/cart'
import { useNotificationStore } from '@/stores/notification'

export default {
    name: 'RecommendCheckout',

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
        formattedPrice(price) {
            return formatPrice(price)
        },

        async getRecommendProducts() {
            this.loadingProducts = true
            try {
                const response = await recommendAPI.getRecommendation({
                    cartItems: this.cartItems
                })
                this.recommendProducts = response.data.recommend_products.slice(0, 6) // Giới hạn 6 sản phẩm
            } catch (error) {
                console.error('Error fetching recommend products:', error)
            } finally {
                this.loadingProducts = false
            }
        },

        addToCart(product) {
            const entry = {
                product_item: product,
                size: 'S',  // Mặc định
                quantity: 1,
                total_amount: product.price,
                topping_items: [],
                item_note: ''
            }

            this.cartStore.addItem(entry)
            this.notificationStore.success(`Đã thêm "${product.name}" vào giỏ hàng`, 3000)
            this.$emit('product-added', product)
        }
    }
}
</script>

<style scoped>
.product-card {
    transition: transform 0.2s;
    height: 100%;
}

.product-card:hover {
    transform: translateY(-5px);
}

.text-wrap {
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.product-img {
    object-fit: contain;
    background-color: #f5f5f5;
}
</style>