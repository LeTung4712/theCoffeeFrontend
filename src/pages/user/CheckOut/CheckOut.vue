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

        <!-- Stepper -->
        <v-stepper v-model="currentStep" class="mb-6">
          <v-stepper-header>
            <v-stepper-item value="1" :complete="currentStep > 1">
              <template #icon>
                <v-icon :color="currentStep > 1 ? 'success' : (currentStep >= 1 ? 'primary' : 'grey')"
                  :icon="currentStep > 1 ? 'mdi-check' : 'mdi-cart'"></v-icon>
              </template>
              <span :class="{ 'd-none d-sm-flex': true, 'text-primary': currentStep >= 1 }">Giỏ hàng</span>
              <span class="d-flex d-sm-none">1</span>
            </v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item value="2" :complete="currentStep > 2">
              <template #icon>
                <v-icon :color="currentStep > 2 ? 'success' : (currentStep >= 2 ? 'primary' : 'grey')"
                  :icon="currentStep > 2 ? 'mdi-check' : 'mdi-truck-delivery'"></v-icon>
              </template>
              <span :class="{ 'd-none d-sm-flex': true, 'text-primary': currentStep >= 2 }">Giao hàng</span>
              <span class="d-flex d-sm-none">2</span>
            </v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item value="3">
              <template #icon>
                <v-icon :color="currentStep >= 3 ? 'primary' : 'grey'" icon="mdi-credit-card-check"></v-icon>
              </template>
              <span :class="{ 'd-none d-sm-flex': true, 'text-primary': currentStep >= 3 }">Thanh toán</span>
              <span class="d-flex d-sm-none">3</span>
            </v-stepper-item>
          </v-stepper-header>

          <v-stepper-window>
            <!-- Bước 1: Giỏ hàng & Gợi ý -->
            <v-stepper-window-item value="1">
              <v-card elevation="4" rounded="lg" class="pa-0 mb-2">
                <OrderSummary ref="orderSummary" @order-loaded="handleOrderLoaded"
                  @add-more="$router.push('/collections/menu/0')" />
              </v-card>

              <!-- Component Gợi ý -->
              <RecommendCheckout @product-added="handleProductAdded" />

              <div class="d-flex justify-end mt-6">
                <v-btn color="primary" prepend-icon="mdi-arrow-right" @click="goToStep(2)" :disabled="!hasItems">
                  Tiếp tục
                </v-btn>
              </div>
            </v-stepper-window-item>

            <!-- Bước 2: Thông tin giao hàng -->
            <v-stepper-window-item value="2">
              <v-row>
                <v-col cols="12">
                  <DeliverySection @delivery-info-loaded="handleDeliveryInfoLoaded" />

                  <div class="d-flex justify-space-between mt-6">
                    <v-btn color="grey" variant="outlined" prepend-icon="mdi-arrow-left" @click="goToStep(1)">
                      Quay lại
                    </v-btn>
                    <v-btn color="primary" prepend-icon="mdi-arrow-right" @click="goToStep(3)"
                      :disabled="!deliveryInfo || !deliveryInfo.address || deliveryInfo.user_name === '' || !deliveryInfo.isPhoneValid">
                      Tiếp tục
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-stepper-window-item>

            <!-- Bước 3: Phương thức thanh toán và Xác nhận -->
            <v-stepper-window-item value="3">
              <v-row>
                <v-col cols="12" md="6">
                  <PaymentMethods @payment-method-changed="handlePaymentMethodChanged" />

                  <!-- Thêm checkbox điều khoản -->
                  <v-card flat class="pa-4 bg-grey-lighten-4 mt-4">
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
                    <v-btn color="error" variant="outlined" prepend-icon="mdi-delete" @click="handleDeleteOrder"
                      class="delete-order-btn">
                      Xóa toàn bộ đơn hàng
                    </v-btn>
                  </v-card-actions>
                </v-col>

                <v-col cols="12" md="6">
                  <v-card elevation="4" rounded="lg" class="pa-4">
                    <v-card-title>Tóm tắt đơn hàng</v-card-title>
                    <v-list>
                      <v-list-item>
                        <div class="d-flex justify-space-between w-100">
                          <span>Tổng tiền hàng:</span>
                          <span>{{ formattedPrice((orderData && orderData.totalPrice) || 0) }}đ</span>
                        </div>
                      </v-list-item>

                      <v-list-item>
                        <div class="d-flex justify-space-between w-100">
                          <span>Giảm giá:</span>
                          <span>{{ formattedPrice((orderData && orderData.voucherDiscount) || 0) }}đ</span>
                        </div>
                      </v-list-item>

                      <v-list-item>
                        <div class="d-flex justify-space-between w-100">
                          <span>Phí giao hàng:</span>
                          <span>15,000đ</span>
                        </div>
                      </v-list-item>

                      <v-divider class="my-2"></v-divider>

                      <v-list-item>
                        <div class="d-flex justify-space-between w-100">
                          <span class="text-subtitle-1 font-weight-bold">Tổng thanh toán:</span>
                          <span class="text-subtitle-1 font-weight-bold">{{ formattedPrice(finalPrice) }}đ</span>
                        </div>
                      </v-list-item>
                    </v-list>

                    <v-card-actions class="pt-4">
                      <v-row>
                        <v-col cols="6">
                          <v-btn color="grey" variant="outlined" prepend-icon="mdi-arrow-left" block
                            @click="goToStep(2)">
                            Quay lại
                          </v-btn>
                        </v-col>
                        <v-col cols="6">
                          <v-btn color="primary" variant="elevated" prepend-icon="mdi-cart-check" block
                            :loading="isLoading" :disabled="!agreedToTerms" @click="validateAndCheckout">
                            Đặt hàng
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-stepper-window-item>
          </v-stepper-window>
        </v-stepper>

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
import RecommendCheckout from './components/RecommendCheckout.vue'
import { useNotificationStore } from '@/stores/notification'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useAddressStore } from '@/stores/address'
import { useVoucherStore } from '@/stores/voucher'
import { formatPrice } from '@/utils/format'

export default {
  name: 'CheckOut',

  components: {
    DeliverySection,
    PaymentMethods,
    OrderSummary,
    RecommendCheckout
  },

  setup() {
    const cartStore = useCartStore()
    const authStore = useAuthStore()
    const notificationStore = useNotificationStore()
    const voucherStore = useVoucherStore()
    const addressStore = useAddressStore()
    return { cartStore, authStore, notificationStore, voucherStore, addressStore }
  },

  data() {
    return {
      currentStep: '1',
      isLoading: false,
      orderData: null,
      deliveryInfo: null,
      paymentMethod: 'cod',
      finalPrice: 0,
      agreedToTerms: true,
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
    hasItems() {
      return this.orderData?.items?.length > 0
    },

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
    formattedPrice(price) {
      return formatPrice(price)
    },

    goToStep(step) {
      this.currentStep = step.toString()
    },

    handleProductAdded(product) {
      // Cập nhật lại thông tin đơn hàng sau khi thêm sản phẩm
      this.$refs.orderSummary.calculateTotalPrice()
    },

    handleOrderLoaded(data) {
      this.orderData = {
        items: data.items,
        totalPrice: data.totalPrice,
        finalPrice: data.finalPrice,
        voucherDiscount: data.voucherDiscount
      }
      this.finalPrice = data.finalPrice
    },

    handleDeliveryInfoLoaded(data) {
      //console.log('data', data)
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
          user_name: this.deliveryInfo.user_name.trim(),
          mobile_no: this.deliveryInfo.mobile_no.trim(),
          address: this.deliveryInfo.address,
          note: this.deliveryInfo.note?.trim() || '',
          shipping_fee: 15000.00,
          total_price: this.orderData.totalPrice,
          discount_amount: this.orderData.voucherDiscount || 0,
          final_price: this.orderData.finalPrice,
          payment_method: this.paymentMethod,
          products: this.orderData.items.map(item => ({
            product_id: item.id,
            product_name: item.product_item.name,
            product_price: item.product_item.price,
            product_quantity: item.quantity,
            size: item.size,
            item_note: item.item_note,
            topping_items: item.topping_items
          }))
        }
        // console.log(orderData)
        // return
        const { data: { order_code } } = await orderAPI.createOrder(orderData)

        // Map các phương thức thanh toán với hàm xử lý tương ứng
        const paymentHandlers = {
          'cod': this.handleCodPayment,
          'momo': () => this.handleOnlinePayment(order_code, 'momo'),
          'vnpay': () => this.handleOnlinePayment(order_code, 'vnpay'),
          'zalopay': () => this.handleOnlinePayment(order_code, 'zalopay')
        }

        const handler = paymentHandlers[this.paymentMethod]
        if (handler) {
          await handler()
        } else {
          throw new Error('Phương thức thanh toán không hợp lệ')
        }
      } catch (error) {
        this.notificationStore.error('Có lỗi xảy ra khi thanh toán: ' + error.message, 3000)
      } finally {
        this.isLoading = false
      }
    },

    async handleCodPayment() {
      try {
        this.clearCartAndVoucher()
        this.notificationStore.success('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.', 3000)
        this.$router.push('/user/lich-su')
      } catch (error) {
        this.notificationStore.error('Lỗi khi xử lý thanh toán COD: ' + error.message)
      }
    },

    async handleOnlinePayment(order_code, paymentType) {
      try {
        const paymentData = {
          order_code: order_code,
          return_url: `${window.location.origin}/user/lich-su`
        }

        // Map các phương thức thanh toán với API tương ứng
        const paymentAPIs = {
          'momo': paymentAPI.createMomoPayment,
          'vnpay': paymentAPI.createVNPayPayment,
          'zalopay': paymentAPI.createZaloPayPayment
        }

        const createPayment = paymentAPIs[paymentType]
        if (!createPayment) {
          throw new Error('Phương thức thanh toán không được hỗ trợ')
        }

        const response = await createPayment(paymentData)
        const paymentUrl = response.data.payUrl

        if (!paymentUrl) {
          throw new Error('Không nhận được URL thanh toán')
        }

        this.clearCartAndVoucher()
        window.location.href = paymentUrl
      } catch (error) {
        this.notificationStore.error('Lỗi khi tạo thanh toán online', 2000)
      }
    },

    clearCartAndVoucher() {
      this.cartStore.clearCart()
      this.voucherStore.clearVoucher()
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

  .v-stepper-window-item {
    margin-bottom: 100px;
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

/* Thêm style cho stepper */
.v-stepper {
  background: transparent !important;
}

.v-stepper-header {
  box-shadow: none !important;
  border-radius: 8px;
  background: rgba(var(--v-theme-surface), 0.8);
  backdrop-filter: blur(10px);
  margin-bottom: 24px;
}

.v-stepper-item {
  transition: all 0.3s ease;
}

.v-stepper-item:hover {
  transform: translateY(-2px);
}

.v-stepper-item .v-icon {
  transition: all 0.3s ease;
}

.v-stepper-item:hover .v-icon {
  transform: scale(1.1);
}

.v-stepper-item span {
  font-weight: 500;
  transition: all 0.3s ease;
}

.v-stepper-item:hover span {
  color: rgb(var(--v-theme-primary)) !important;
}

.v-divider {
  border-color: rgba(var(--v-theme-primary), 0.2) !important;
}

@media (max-width: 600px) {
  .v-stepper-header {
    margin: 0 16px 16px 16px;
  }

  .v-stepper-item {
    padding: 8px !important;
  }

  .v-stepper-item .v-icon {
    font-size: 20px !important;
  }
}
</style>