<template>
    <v-container>
        <template v-if="isLoading">
            <v-row>
                <v-col cols="12" md="6" lg="6">
                    <v-skeleton-loader type="image" height="400" />
                </v-col>
                <v-col cols="12" md="6">
                    <v-skeleton-loader type="article" />
                </v-col>
            </v-row>

            <v-row class="mt-8">
                <v-col cols="12">
                    <v-skeleton-loader type="text" class="mb-4" />
                    <v-skeleton-loader type="paragraph" class="mb-4" />
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12">
                    <v-skeleton-loader type="text" class="mb-4" />
                </v-col>
                <v-col v-for="n in 4" :key="n" cols="12" sm="6" md="4" lg="3">
                    <v-skeleton-loader type="card" />
                </v-col>
            </v-row>
        </template>

        <div v-else class="productStore_Infor">
            <div class="prodcutStore_Wrap" style="margin-top: 3rem;">
                <v-row>
                    <v-col cols="12" md="6" lg="6">
                        <div class="product-carousel">
                            <v-img :src="product.image_url" :aspect-ratio="1" cover class="product-image" />
                            <div class="thumb-carousel">
                                <v-img :src="product.image_url" width="75" height="75" class="thumb mt-3" />
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" md="6">
                        <div class="product-info">
                            <h2 class="text-h4 font-weight-medium mb-4">{{ product.name }}</h2>
                            <div class="text-h5 font-weight-bold primary-text mb-6">
                                {{ formattedTotalPrice }} đ
                            </div>

                            <v-row align="center" class="mb-6">
                                <v-col cols="auto">
                                    <v-btn icon="mdi-minus" color="primary" variant="text" @click="decreaseQuantity"
                                        aria-label="Giảm số lượng" />
                                </v-col>
                                <v-col cols="auto">
                                    <span class="text-h6">{{ quantity }}</span>
                                </v-col>
                                <v-col cols="auto">
                                    <v-btn icon="mdi-plus" color="primary" variant="text" @click="increaseQuantity"
                                        aria-label="Tăng số lượng" />
                                </v-col>
                            </v-row>

                            <div v-if="hasToppings" class="mb-6">
                                <div class="text-subtitle-1 mb-3">Chọn size (bắt buộc)</div>
                                <v-row>
                                    <v-col cols="auto">
                                        <v-btn :color="selectedSize === 'S' ? 'primary' : 'grey-darken-1'"
                                            :variant="selectedSize === 'S' ? 'flat' : 'outlined'"
                                            @click="selectedSize = 'S'" class="text-none" height="48">
                                            Nhỏ +0đ
                                        </v-btn>
                                    </v-col>
                                    <v-col cols="auto">
                                        <v-btn :color="selectedSize === 'M' ? 'primary' : 'grey-darken-1'"
                                            :variant="selectedSize === 'M' ? 'flat' : 'outlined'"
                                            @click="selectedSize = 'M'" class="text-none" height="48">
                                            Vừa +6.000đ
                                        </v-btn>
                                    </v-col>
                                    <v-col cols="auto">
                                        <v-btn :color="selectedSize === 'L' ? 'primary' : 'grey-darken-1'"
                                            :variant="selectedSize === 'L' ? 'flat' : 'outlined'"
                                            @click="selectedSize = 'L'" class="text-none" height="48">
                                            Lớn +10.000đ
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </div>

                            <div v-if="hasToppings" class="mb-6">
                                <div class="text-subtitle-1 mb-3">Topping</div>
                                <v-row>
                                    <v-col v-for="topping in topping_items" :key="topping.id" cols="auto">
                                        <v-btn :color="isSelectedTopping(topping) ? 'primary' : 'grey-darken-1'"
                                            :variant="isSelectedTopping(topping) ? 'flat' : 'outlined'"
                                            @click="toggleTopping(topping)" class="text-none" height="48">
                                            {{ topping.name }} +{{ formattedPrice(topping.price) }}đ
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </div>

                            <v-row>
                                <v-col cols="12" sm="6">
                                    <v-btn block color="primary" height="48" @click="handleAddCart">
                                        <v-icon start>mdi-cart</v-icon>
                                        Thêm vào giỏ hàng
                                    </v-btn>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-btn block color="primary" variant="outlined" height="48" @click="handleBuyNow">
                                        <v-icon start>mdi-truck-delivery</v-icon>
                                        Đặt giao tận nơi
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </div>
                    </v-col>
                </v-row>
            </div>
        </div>

        <div v-if="product" class="product_describe">
            <div class="product_des_wrap">
                <v-row>
                    <v-col cols="12" sm="12" lg="12" md="12">
                        <hr>
                        <div>
                            <h4 class="product_des_title">Mô tả sản phẩm</h4>
                            <p class="des_detail"> {{ product.description }}</p>
                        </div>
                        <hr>
                    </v-col>
                </v-row>
                <div id="product_des_title">
                    <h4 class="product_des_title">Sản phẩm liên quan</h4>
                    <v-row>
                        <v-col v-for="product in product_relations" :key="product.id" cols="12" sm="6" md="4" lg="3"
                            class="mobile-card-height">
                            <ProductCard :product="product" :currentID="product.id" :dialog="false" />
                        </v-col>
                    </v-row>
                </div>

            </div>

        </div>
    </v-container>
</template>

<script>
import { formatPrice } from "@/utils/format";
import { userAPI } from "@/api/user";
import ProductCard from '@/components/Products/ProductCard.vue'
import { useNotificationStore } from '@/stores/notification'
import { useCartStore } from '@/stores/cart'
import { useProductStore } from '@/stores/product'

export default {
    name: "ProductDetail",

    components: {
        ProductCard
    },

    setup() {
        const CartStore = useCartStore();
        const NotificationStore = useNotificationStore();
        const ProductStore = useProductStore();
        return {
            NotificationStore,
            CartStore,
            ProductStore
        }
    },

    data() {
        return {
            quantity: 1,
            product_id: null,
            checked_topping: [],
            selectedSize: 'S',
            product: null,
            product_relations: [],
            topping_items: [],
            isLoading: false,
        }
    },

    computed: {
        hasToppings() {
            return this.topping_items.length > 0
        },

        formattedTotalPrice() {
            return this.formattedPrice(this.calculateTotalPrice())
        },
    },

    created() {
        if (this.ProductStore.getCurrentProductId) {
            this.product_id = this.ProductStore.getCurrentProductId
            this.loadProductData()
        } else {
            this.$router.push('/mainpage')
        }
    },

    watch: {
        '$route': {
            immediate: true, // Đảm bảo watcher được gọi ngay khi component được tạo
            handler() {
                const productStore = useProductStore()
                if (productStore.getCurrentProductId && productStore.hasProductIdChanged) {
                    this.product_id = productStore.getCurrentProductId
                    this.isLoading = true
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    })
                    this.loadProductData()
                }
            }
        }
    },

    // beforeUnmount() {
    //     // Clear product id khi rời khỏi trang
    //     const productStore = useProductStore()
    //     productStore.clearProductId()
    // },

    methods: {
        formattedPrice(price) {
            return formatPrice(price)
        },

        async loadProductData() {
            try {
                const response = await userAPI.product.getById(this.product_id);
                const data = response.data;
                this.product = {
                    ...data.product,
                };
                this.topping_items = data.product.toppings.map(topping => ({
                    ...topping,
                }));
                this.product_relations = data.same_products.map(product => ({
                    ...product,
                }));
            } catch (error) {
                console.error("Failed to fetch product info:", error);
                this.product = {
                    id: this.id,
                    name: this.name,
                    description: this.description,
                    price: this.price,
                    image_url: this.image_url
                };
            } finally {
                this.isLoading = false;
            }
        },

        calculateTotalPrice() {
            const basePrice = parseInt(this.product.price)
            const toppingPrice = this.checked_topping.reduce((sum, topping) =>
                sum + parseInt(topping.price), 0)

            const sizePrice = this.selectedSize === 'M' ? 6000 :
                this.selectedSize === 'L' ? 10000 : 0

            return (basePrice + toppingPrice + sizePrice) * this.quantity
        },

        increaseQuantity() {
            if (this.quantity < 100) this.quantity++
            else alert("Số lượng sản phẩm tối đa là 100")
        },

        decreaseQuantity() {
            if (this.quantity > 1) this.quantity--
        },

        handleAddCart() {
            try {
                const entry = {
                    product_item: {
                        ...this.product,
                        id: this.product.id
                    },
                    size: this.selectedSize,
                    quantity: this.quantity,
                    total_amount: this.calculateTotalPrice(),
                    topping_items: this.checked_topping,
                    item_note: ''
                }

                this.CartStore.addItem(entry)
                this.NotificationStore.success(`Đã thêm "${this.product.name}" vào giỏ hàng`, 3000)
                this.resetForm()
            } catch (error) {
                this.NotificationStore.error('Không thể thêm vào giỏ hàng: ' + error.message, 1000)
            }
        },

        resetForm() {
            this.quantity = 1
            this.selectedSize = 'S'
            this.checked_topping = []
        },

        handleBuyNow() {
            this.handleAddCart()
            this.$router.push('/thanh-toan')
        },

        isSelectedTopping(topping) {
            return this.checked_topping.some(t => t.id === topping.id)
        },

        toggleTopping(topping) {
            const index = this.checked_topping.findIndex(t => t.id === topping.id)
            if (index === -1) {
                this.checked_topping.push(topping)
            } else {
                this.checked_topping.splice(index, 1)
            }
        }
    }
}
</script>

<style scoped>
.menu__item_related {
    padding: 8px;
    text-align: center;
}

.menu__item_img img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 8px;
}

.product-title {
    font-size: 14px;
    margin: 8px 0;
    line-height: 1.2;
    color: rgb(var(--v-theme-text-primary));
}

.product-title a {
    color: rgb(var(--v-theme-text-primary));
    text-decoration: none;
}

.item__price {
    font-weight: bold;
    color: rgb(var(--v-theme-accent));
    font-size: 14px;
}

.product_des_title {
    color: rgb(var(--v-theme-text-primary));
    margin: 1rem 0;
}

.des_detail {
    color: rgb(var(--v-theme-text-secondary));
    line-height: 1.6;
}

hr {
    border-color: rgb(var(--v-theme-border-color));
    opacity: 0.12;
}


@media (max-width: 600px) {
    .mobile-card-height :deep(.v-card) {
        max-height: 120px;
        display: flex;
    }

    .mobile-card-height :deep(.v-img) {
        max-width: 120px;
        height: 100%;
    }
}

.v-btn.v-btn--variant-flat {
    background-color: rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-background)) !important;
}

:deep(.v-skeleton-loader) {
    background-color: rgb(var(--v-theme-surface-variant));
}

.productStore_Infor {
    background-color: rgb(var(--v-theme-background));
}

.product_describe {
    margin-top: 2rem;
    padding: 1rem 0;
    background-color: rgb(var(--v-theme-surface));
}
</style>
