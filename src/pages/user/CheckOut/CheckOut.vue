<template>
  <v-container class="fill-height pa-0">
    <v-row justify="center" align="center">
      <v-col cols="12" md="10">
        <!-- Header -->
        <v-card flat class="text-center mb-4 mb-sm-8">
          <v-card-title :class="{
            'text-h4 font-weight-bold': $vuetify.display.smAndUp,
            'text-h5 font-weight-bold': $vuetify.display.xs
          }">
            <v-icon color="primary" :size="$vuetify.display.smAndUp ? 'x-large' : 'large'" class="mr-2">
              mdi-file
            </v-icon>
            Xác nhận đơn hàng
          </v-card-title>
        </v-card>

        <!-- Main Content -->
        <div class="checkout-content">
          <v-row>
            <!-- Left Column -->
            <v-col cols="12" md="6" :order="$vuetify.display.mdAndUp ? 1 : 2">
              <DeliverySection @delivery-info-loaded="handleDeliveryInfoLoaded" />
              <PaymentMethods @payment-method-changed="handlePaymentMethodChanged" />

              <!-- Thêm checkbox điều khoản -->
              <v-card flat class="pa-4 bg-grey-lighten-4">
                <v-checkbox v-model="agreedToTerms" color="primary">
                  <template #label>
                    <span>
                      Đồng ý với các
                      <a href="#" class="text-primary text-decoration-underline">điều khoản và điều kiện</a>
                      mua hàng của The Coffee House
                    </span>
                  </template>
                </v-checkbox>
              </v-card>

              <!-- Nút xóa đơn hàng -->
              <v-card-actions class="pa-4 bg-grey-lighten-4">
                <v-btn 
                  color="error" 
                  variant="outlined" 
                  prepend-icon="mdi-delete" 
                  @click="handleDeleteOrder"
                  class="delete-order-btn"
                >
                  Xóa toàn bộ đơn hàng
                </v-btn>
              </v-card-actions>
            </v-col>

            <!-- Right Column -->
            <v-col cols="12" md="6" :order="$vuetify.display.mdAndUp ? 2 : 1">
              <v-card elevation="4" rounded="lg" class="pa-0">
                <OrderSummary ref="orderSummary" @order-loaded="handleOrderLoaded"
                  @add-more="$router.push('/mainpage')" />

                <!-- Desktop footer giữ nguyên -->
                <v-card-actions class="bg-primary pa-4 desktop-footer">
                  <v-row no-gutters align="center">
                    <v-col>
                      <div class="text-white">
                        <div class="text-body-2">Thành tiền</div>
                        <div class="text-h6 font-weight-bold">
                          {{ formatPrice(totalAmount) }}đ
                        </div>
                      </div>
                    </v-col>

                    <v-col class="text-right">
                      <v-btn color="white" size="x-large" rounded variant="elevated" :loading="isLoading" :elevation="3"
                        prepend-icon="mdi-cart-check" class="order-button" @click="validateAndCheckout">
                        Đặt hàng
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Footer cho mobile -->
        <div class="mobile-footer">
          <v-row no-gutters align="center">
            <v-col>
              <div class="text-white">
                <div class="text-body-2">Thành tiền</div>
                <div class="text-h6 font-weight-bold">
                  {{ formatPrice(totalAmount) }}đ
                </div>
              </div>
            </v-col>

            <v-col class="text-right">
              <v-btn color="white" size="x-large" rounded variant="elevated" :loading="isLoading" :elevation="3"
                prepend-icon="mdi-cart-check" class="order-button" @click="validateAndCheckout">
                Đặt hàng
              </v-btn>
            </v-col>
          </v-row>
        </div>

        <!-- Thêm confirm dialog -->
        <v-dialog v-model="showConfirmDialog" max-width="400">
          <v-card>
            <v-card-title class="text-h6 pa-4">
              Xác nhận xóa
            </v-card-title>

            <v-card-text class="pa-4">
              Bạn có chắc muốn xóa toàn bộ đơn hàng?
            </v-card-text>

            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn color="grey-darken-1" variant="text" @click="showConfirmDialog = false">
                Hủy
              </v-btn>
              <v-btn color="error" variant="elevated" @click="confirmDeleteOrder" :loading="isDeleting">
                Xóa đơn hàng
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { orderAPI } from '@/api/order'
import { paymentAPI } from '@/api/payment'
import DeliverySection from './components/DeliverySection.vue'
import PaymentMethods from './components/PaymentMethods.vue'
import OrderSummary from './components/OrderSummary.vue'
import { useNotificationStore } from '@/stores/notification'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useVoucherStore } from '@/stores/voucher'

export default {
  name: 'CheckOut',

  components: {
    DeliverySection,
    PaymentMethods,
    OrderSummary
  },

  setup() {
    const cartStore = useCartStore()
    const authStore = useAuthStore()
    const notificationStore = useNotificationStore()
    const voucherStore = useVoucherStore()
    return { cartStore, authStore, notificationStore, voucherStore }
  },

  data() {
    return {
      isLoading: false,
      orderData: null,
      deliveryInfo: null,
      paymentMethod: 'cod',
      totalAmount: 0,
      agreedToTerms: false,
      showConfirmDialog: false,
      isDeleting: false,
      redirectTimeout: null
    }
  },

  mounted() {
    window.scrollTo(0, 0)
    const currentOrders = JSON.parse(localStorage.getItem('order') || '[]')
    if (!currentOrders.length) {
      this.notificationStore.warning('Giỏ hàng của bạn hiện đang trống. Vui lòng thêm sản phẩm trước khi đặt hàng.', 5000)
      this.redirectTimeout = setTimeout(() => {
        this.$router.push('/mainpage')
      }, 3000)
    }
  },

  computed: {
    isValidCheckout() {
      return (
        this.orderData?.items?.length > 0 &&
        this.authStore.isLoggedIn &&
        this.deliveryInfo?.address &&
        this.deliveryInfo.address !== "Chưa có địa chỉ giao hàng"
      )
    }
  },

  methods: {
    handleOrderLoaded(data) {
      this.orderData = {
        items: data.items,
        totalPrice: data.totalPrice,
        voucher: data.voucher
      }
      this.totalAmount = data.totalPrice
    },

    handleDeliveryInfoLoaded(data) {
      this.deliveryInfo = data
    },

    handlePaymentMethodChanged(method) {
      this.paymentMethod = method
    },

    async handleCheckout() {
      if (!this.orderData?.items?.length) {
        this.notificationStore.error('Không có sản phẩm trong đơn hàng')
        return
      }

      this.isLoading = true
      try {
        const orderData = {
          user_id: this.authStore.userInfo.id,
          user_name: this.authStore.userInfo.first_name,
          mobile_no: this.deliveryInfo.phone,
          order_date: new Date().toISOString().split('T')[0],
          address: this.deliveryInfo.address,
          note: this.deliveryInfo.note || '',
          shipcost: 15000, // Có thể cần điều chỉnh theo logic của bạn
          total_price: this.totalAmount,
          discount_money: this.orderData.voucher?.discount || 0,
          payment_method: this.paymentMethod,
          products: this.orderData.items.map(item => ({
            product_id: item.id,
            product_count: item.count,
            size: item.size,
            price: item.product_item.price,
            topping_id: item.topping_items?.map(t => t.id) || [],
            topping_count: item.topping_items?.map(t => t.count) || []
          }))
        }
        console.log('voucher', this.orderData)
        console.log('orderData', orderData)
        const { data: { order_id } } = await orderAPI.create(orderData)

        if (this.paymentMethod === 'cod') {
          await this.handleCodPayment()
        } else {
          await this.handleOnlinePayment(order_id)
        }
      } catch (error) {
        this.notificationStore.error('Có lỗi xảy ra khi thanh toán: ' + error.message, 3000)
      } finally {
        this.isLoading = false
      }
    },

    async handleCodPayment() {
      try {
        // Xóa giỏ hàng và voucher
        this.cartStore.clearCart()
        this.voucherStore.clearVoucher()

        this.notificationStore.success('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.', 3000)
        this.$router.push('/mainpage')
      } catch (error) {
        this.notificationStore.error('Lỗi khi xử lý thanh toán COD: ' + error.message)
      }
    },

    async handleOnlinePayment(orderId) {
      try {
        const paymentData = {
          order_id: orderId,
          total_price: this.totalAmount,
          return_url: `${window.location.origin}/payment/callback`
        }
        const { data: paymentUrl } = await paymentAPI.createMomoPayment(paymentData)

        if (!paymentUrl) {
          throw new Error('Không nhận được URL thanh toán')
        }
        // Xóa giỏ hàng và voucher
        this.cartStore.clearCart()
        this.voucherStore.clearVoucher()
        window.location.href = paymentUrl
      } catch (error) {
        this.notificationStore.error('Lỗi khi tạo thanh toán online: ' + error.message)
      }
    },

    handleDeleteOrder() {
      this.showConfirmDialog = true
    },

    async confirmDeleteOrder() {
      this.isDeleting = true
      try {
        await this.cartStore.clearCart()
        localStorage.removeItem('order')
        this.showConfirmDialog = false
        this.notificationStore.success('Đã xóa toàn bộ đơn hàng', 3000)
        this.redirectTimeout = setTimeout(() => {
          this.$router.push('/mainpage')
        }, 2000)
      } catch (error) {
        this.notificationStore.error('Lỗi khi xóa đơn hàng: ' + error.message)
      } finally {
        this.isDeleting = false
      }
    },

    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN').format(price)
    },

    validateAndCheckout() {
      if (!this.agreedToTerms) {
        this.notificationStore.warning('Vui lòng đồng ý với điều khoản và điều kiện để tiếp tục đặt hàng', 3000)
        return
      }

      if (!this.authStore.isLoggedIn) {
        this.notificationStore.warning('Vui lòng đăng nhập để đặt hàng', 3000)
        return
      }

      if (!this.deliveryInfo?.address ||
        this.deliveryInfo.address === "Chưa có địa chỉ giao hàng") {
        this.notificationStore.warning('Vui lòng nhập địa chỉ giao hàng', 3000)
        return
      }

      if (!this.isValidCheckout) {
        this.notificationStore.warning('Vui lòng kiểm tra lại thông tin đặt hàng', 3000)
        return
      }

      this.handleCheckout()
    }
  },

  beforeUnmount() {
    // Cleanup timeout để tránh memory leak
    if (this.redirectTimeout) {
      clearTimeout(this.redirectTimeout)
    }
  }
}
</script>

<style scoped>
.desktop-footer {
  background-color: rgb(var(--v-theme-primary)) !important;
}

.mobile-footer {
  display: none;
  background-color: rgb(var(--v-theme-primary)) !important;
  padding: 16px;
  width: 100vw;
  max-width: 100%;
  margin: 0;
  box-sizing: border-box;
  left: 50%;
  transform: translateX(-50%);
}

@media (max-width: 600px) {
  .desktop-footer {
    display: none;
  }

  .mobile-footer {
    display: block;
    position: fixed;
    bottom: 56px;
    z-index: 99;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }

  .v-container {
    padding-bottom: 0 !important;
    min-height: calc(100vh - 56px - env(safe-area-inset-bottom));
    max-width: 100vw;
    overflow-x: hidden;
  }

  .v-row {
    margin: 0;
    width: 100%;
  }

  .v-col {
    padding: 0;
  }
}

.order-button {
  min-width: 160px;
  font-weight: bold;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  color: rgb(var(--v-theme-primary)) !important;
  font-size: 1.1rem;
  cursor: pointer;
}

.order-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(var(--v-theme-primary), 0.3);
  background: linear-gradient(145deg, rgb(var(--v-theme-background)), rgb(var(--v-theme-secondary)));
}

.order-button:active {
  transform: translateY(1px);
  background: linear-gradient(145deg, rgb(var(--v-theme-secondary)), rgb(var(--v-theme-background)));
}

.text-primary {
  color: rgb(var(--v-theme-primary)) !important;
}

.text-decoration-underline {
  text-decoration: underline;
}

.text-decoration-underline:hover {
  opacity: 0.8;
}

/* Thêm animation cho dialog */
.v-dialog-transition-enter-active,
.v-dialog-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}

.v-dialog-transition-enter-from,
.v-dialog-transition-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

/* Style cho buttons */
.v-btn {
  text-transform: none;
  font-weight: 500;
}

.delete-order-btn {
  width: fit-content;
  margin: 0 auto;
  min-width: unset;
  padding: 0 20px;
}

@media (max-width: 600px) {
  .delete-order-btn {
    font-size: 0.875rem;
    padding: 0 16px;
  }
}
</style>