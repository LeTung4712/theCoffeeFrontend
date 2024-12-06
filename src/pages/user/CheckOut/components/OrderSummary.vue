<template>
  <v-card-text class="px-5">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-4">
      <v-card-title class="px-0">Các món đã chọn</v-card-title>
      <v-btn
        variant="text"
        color="black"
        @click="$emit('add-more')"
      >
        Thêm món
      </v-btn>
    </div>

    <!-- Order List -->
    <v-list>
      <v-list-item
        v-for="(order, index) in safeOrders"
        :key="index"
        class="px-0"
      >
        <div class="d-flex justify-space-between align-center w-100">
          <div class="d-flex align-start">
            <!-- Thêm nút edit -->
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              density="compact"
              class="me-2 mt-1"
              @click="openEditDialog(order)"
            ></v-btn>
            
            <div>
              <!-- Tên sản phẩm -->
              <div class="text-body-1 font-weight-medium" v-if="getProductName(order)">
                {{ order.quantity || 1 }} x {{ getProductName(order) }}
              </div>
              
              <!-- Size -->
              <div class="text-subtitle-2" v-if="order.size">
                Size: {{ order.size }}
              </div>
              
              <!-- Toppings -->
              <div 
                v-for="(topping, tIndex) in order.topping_items"
                :key="`${order.id}-${tIndex}`"
                class="text-subtitle-2"
              >
                + {{ topping.name }} x 1
              </div>

              <v-btn
                size="small"
                color="error"
                variant="text"
                density="compact"
                class="mt-1"
                @click="handleDeleteItem(order)"
              >
                Xóa
              </v-btn>
            </div>
          </div>

          <div class="text-right">
            <span class="text-body-1">{{ formattedPrice(order.total_amount) }}đ</span>
          </div>
        </div>
        <v-divider class="my-2" ></v-divider>
      </v-list-item>
    </v-list>

    <!-- Summary -->
    <v-card-title class="px-0 pt-6">Tổng cộng</v-card-title>
    
    <v-list class="pa-0">
      <v-list-item class="px-0">
        <template v-slot:default>
          <div class="d-flex justify-space-between w-100">
            <span>Thành tiền</span>
            <span>{{ formattedPrice(totalPrice) }}đ</span>
          </div>
        </template>
      </v-list-item>

      <v-list-item class="px-0">
        <template v-slot:default>
          <div class="d-flex justify-space-between w-100">
            <span>Phí giao hàng</span>
            <span>{{ formattedPrice(shippingFee) }}đ</span>
          </div>
        </template>
      </v-list-item>

      <v-divider class="my-2"></v-divider>

      <v-list-item class="px-0">
        <template v-slot:default>
          <div class="d-flex justify-space-between w-100">
            <EditVoucherDialog
              v-model="selectedVoucher"
              :total-price="totalPrice"
              @voucher-selected="handleVoucherSelected"
            />
            <span v-if="selectedVoucher" class="text-orange">
              -{{ formattedPrice(voucherDiscount) }}đ
            </span>
            <span v-else>0đ</span>
          </div>
        </template>
      </v-list-item>
    </v-list>
    <!-- Thêm EditOrderDialog -->
  <EditOrderDialog
    v-model="showEditDialog"
    :order="selectedOrder"
    @save="handleEditComplete"
  />
  </v-card-text>
</template>

<script>
import { formatPrice } from '@/utils/format'
import { useNotificationStore } from '@/stores/notification'
import { useCartStore } from '@/stores/cart'
import { useVoucherStore } from '@/stores/voucher'
import EditOrderDialog from './EditOrderDialog.vue'
import EditVoucherDialog from './EditVoucherDialog.vue'


export default {
  name: 'OrderSummary',
  
  components: {
    EditOrderDialog,
    EditVoucherDialog
  },

  setup() {
    const cartStore = useCartStore()
    const voucherStore = useVoucherStore()
    return { cartStore, voucherStore }
  },

  data() {
    return {
      totalPrice: 0,
      showEditDialog: false,
      selectedOrder: null,
      isProcessingDelete: false
    }
  },

  created() {
    this.calculateTotalPrice()
    this.voucherStore.loadVoucherFromStorage()
  },

  watch: {
    voucherDiscount: {
      handler( newValue ) {
        this.emitOrderData();
      }
    },
    safeOrders: {
      handler() {
        this.calculateTotalPrice()
      },
      deep: true
    },
    selectedVoucher: {
      handler() {
        this.calculateTotalPrice()
      },
      deep: true
    }
  },

  computed: {
    safeOrders() {
      const cartStore = useCartStore()
      return cartStore.items || []
    },
    selectedVoucher() {
      return this.voucherStore.selectedVoucher
    },
    shippingFee() {
      return 15000
    },
    voucherDiscount() {
      if (!this.selectedVoucher || !this.totalPrice) return 0
      
      if (this.selectedVoucher.discount_type === 'percent') {
        const discountAmount = (this.totalPrice * this.selectedVoucher.discount_percent) / 100
        return Math.min(discountAmount, this.selectedVoucher.max_discount_amount)
      }
      return Math.min(this.totalPrice,this.selectedVoucher.max_discount_amount)
    },
    finalTotal() {
      return Math.max(0, this.totalPrice + this.shippingFee - (this.voucherDiscount || 0))
    }
  },

  methods: {
    formattedPrice(price) {
      return formatPrice(price)
    },
    
    getProductName(order) {
      if (!order?.product_item?.name) {
        console.warn('Không tìm thấy tên sản phẩm:', order)
        return 'Sản phẩm không xác định'
      }
      return order.product_item.name
    },

    calculateTotalPrice() {
      this.totalPrice = this.safeOrders.reduce((sum, order) => sum + order.total_amount, 0)
      this.$nextTick(() => {
        this.emitOrderData()
      })
    },

    openEditDialog(order) {
      this.selectedOrder = { ...order }  // Clone order để tránh thay đổi trực tiếp
      this.showEditDialog = true
    },

    handleEditComplete(updatedOrder) {
      const cartStore = useCartStore()
      const index = cartStore.items.findIndex(o => o.id === updatedOrder.id)
      if (index !== -1) {
        cartStore.updateItem(updatedOrder)
        this.$nextTick(() => {
          this.calculateTotalPrice()
        })
      }
      this.showEditDialog = false
    },

    async handleDeleteItem(item) {
      if (this.isProcessingDelete) return
      
      const notificationStore = useNotificationStore()
      const cartStore = useCartStore()
      this.isProcessingDelete = true
      
      try {
        if (!item?.id) {
          throw new Error('Item không hợp lệ')
        }

        await cartStore.removeItem(item.id)
        this.calculateTotalPrice()

        if (cartStore.itemCount === 0) {
          await notificationStore.warning(
            'Giỏ hàng của bạn hiện đang trống. Vui lòng thêm sản phẩm trước khi đặt hàng.',
            5000
          )
          await this.$router.push('/mainpage')
        } else {
          await notificationStore.success(
            `Đã xóa "${item.product_item.name}" khỏi giỏ hàng`,
            3000
          )
        }
      } catch (error) {
        console.error('Chi tiết lỗi:', error)
        notificationStore.error('Lỗi khi xóa sản phẩm: ' + error.message)
      } finally {
        this.isProcessingDelete = false
      }
    },

    handleVoucherSelected(voucher) {
      this.voucherStore.setSelectedVoucher(voucher)
      this.$nextTick(() => {
        this.calculateTotalPrice()
      })
    },

    emitOrderData() {
      this.$emit('order-loaded', {
        items: this.safeOrders,
        voucherDiscount: this.voucherDiscount,
        totalPrice: this.totalPrice,
        finalPrice: this.finalTotal
      })
    }
  },

  
}
</script> 