<template>
  <v-container class="fill-height pa-0">
    <v-row justify="center" align="center">
      <v-col cols="12" md="10">
        <!-- Header -->
        <v-card flat class="text-center mb-8">
          <v-card-title class="text-h4 font-weight-bold">
            <v-icon color="amber" size="x-large" class="mr-2">mdi-file</v-icon>
            Xác nhận đơn hàng
          </v-card-title>
        </v-card>

        <!-- Main Content -->
        <div class="checkout-content">
          <v-row>
            <!-- Left Column -->
            <v-col cols="12" md="6" :order="$vuetify.display.mdAndUp ? 1 : 2">
              <delivery-section
                @delivery-info-loaded="handleDeliveryInfoLoaded"
              />
              <payment-methods
                @payment-method-changed="handlePaymentMethodChanged"
              />
              <!-- Thêm nút xóa toàn bộ đơn hàng -->
              <v-card-actions class="pa-4 bg-grey-lighten-4">
                  <v-btn
                    block
                    color="error"
                    variant="outlined"
                    prepend-icon="mdi-delete"
                    @click="handleDeleteOrder"
                  >
                    Xóa toàn bộ đơn hàng
                  </v-btn>
                </v-card-actions>
            </v-col>

            <!-- Right Column -->
            <v-col cols="12" md="6" :order="$vuetify.display.mdAndUp ? 2 : 1">
              <v-card elevation="4" rounded="lg" class="pa-0">
                <order-summary
                  ref="orderSummary"
                  @order-loaded="handleOrderLoaded"
                  @add-more="$router.push('/mainpage')"
                  @delete-item="handleDeleteItem"
                />
                
                <!-- Desktop footer giữ nguyên -->
                <v-card-actions class="bg-orange pa-4 desktop-footer">
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
                      <v-btn
                        color="white"
                        size="x-large"
                        rounded
                        variant="elevated"
                        :loading="isLoading"
                        :elevation="3"
                        prepend-icon="mdi-cart-check"
                        class="order-button"
                        @click="validateAndCheckout"
                      >
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
              <v-btn
                color="white"
                size="x-large"
                rounded
                variant="elevated"
                :loading="isLoading"
                :elevation="3"
                prepend-icon="mdi-cart-check"
                class="order-button"
                @click="validateAndCheckout"
              >
                Đặt hàng
              </v-btn>
            </v-col>
          </v-row>
        </div>
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

export default {
  name: 'CheckOut',
  
  components: {
    DeliverySection,
    PaymentMethods,
    OrderSummary
  },

  data() {
    return {
      orderData: null,
      deliveryInfo: null,
      paymentMethod: 'cod',
      totalAmount: 0
    }
  },

  computed: {
    isValidCheckout() {
      return this.orderData?.items?.length > 0 && 
             this.deliveryInfo?.isLogged &&
             this.deliveryInfo?.address &&
             this.deliveryInfo.address !== "Chưa có địa chỉ giao hàng"
    }
  },

  methods: {
    handleOrderLoaded(data) {
      this.orderData = data
      this.totalAmount = data.totalPrice
    },

    handleDeliveryInfoLoaded(data) {
      this.deliveryInfo = data
    },

    handlePaymentMethodChanged(method) {
      this.paymentMethod = method
    },

    async handleCheckout() {
      try {
        const orderData = this.prepareOrderData()
        const { data: { order_id } } = await orderAPI.create(orderData)

        if (this.paymentMethod === 'cod') {
          await this.handleCodPayment()
        } else {
          await this.handleOnlinePayment(order_id)
        }
      } catch (error) {
        console.error('Lỗi thanh toán:', error)
        alert('Có lỗi xảy ra khi thanh toán')
      }
    },

    prepareOrderData() {
      return {
        items: this.orderData.items,
        delivery: {
          name: this.deliveryInfo.name,
          phone: this.deliveryInfo.phone,
          address: this.deliveryInfo.address,
          note: this.deliveryInfo.note
        },
        payment: {
          method: this.paymentMethod,
          amount: this.totalAmount
        }
      }
    },

    async handleCodPayment() {
      localStorage.removeItem('order') // Xóa giỏ hàng
      alert('Đặt hàng thành công')
      this.$router.push('/mainpage')
    },

    async handleOnlinePayment(orderId) {
      const paymentData = {
        order_id: orderId,
        amount: this.totalAmount
      }
      const { data: paymentUrl } = await paymentAPI.createPayment(paymentData)
      window.location.href = paymentUrl
    },

    handleDeleteOrder() {
      if (confirm('Bạn có chắc muốn xóa toàn bộ đơn hàng?')) {
        localStorage.removeItem('order')
        this.$router.push('/mainpage')
      }
    },

    handleDeleteItem(item) {
      // Lấy orders hiện tại từ localStorage
      const currentOrders = JSON.parse(localStorage.getItem('order') || '[]')
      // Lọc bỏ item cần xóa
      const updatedOrders = currentOrders.filter(order => order.id !== item.id)
      // Cập nhật lại localStorage
      localStorage.setItem('order', JSON.stringify(updatedOrders))
      // Reload lại component OrderSummary
      this.$nextTick(() => {
        const orderSummary = this.$refs.orderSummary
        if (orderSummary) {
          orderSummary.loadOrderData()
        }
      })
    },

    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN').format(price)
    },

    validateAndCheckout() {
      if (!this.deliveryInfo?.isLogged) {
        alert('Vui lòng đăng nhập để đặt hàng')
        return
      }

      if (!this.deliveryInfo?.address || 
          this.deliveryInfo.address === "Chưa có địa chỉ giao hàng") {
        alert('Vui lòng nhập địa chỉ giao hàng')
        return
      }

      this.handleCheckout()
    }
  }
}
</script>

<style scoped>
.desktop-footer {
  background-color: #fa8c16;
}

.mobile-footer {
  display: none;
  background-color: #fa8c16;
  padding: 16px;
}

@media (max-width: 600px) {
  .desktop-footer {
    display: none;
  }

  .mobile-footer {
    display: block;
    position: fixed;
    bottom: 56px;
    left: 0;
    right: 0;
    z-index: 99;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }

  .checkout-content {
    margin-bottom: calc(136px + env(safe-area-inset-bottom));
  }

  .v-container {
    padding-bottom: 0 !important;
    min-height: calc(100vh - 56px - env(safe-area-inset-bottom));
  }
}

.order-button {
  min-width: 160px;
  font-weight: bold;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  color: #fa8c16 !important;
  font-size: 1.1rem;
  cursor: pointer;
}

.order-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(250, 140, 22, 0.3);
  background: linear-gradient(145deg, #ffffff, #fff5e6);
}

.order-button:active {
  transform: translateY(1px);
  background: linear-gradient(145deg, #fff5e6, #ffffff);
}
</style>