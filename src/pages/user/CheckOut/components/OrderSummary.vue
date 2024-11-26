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
                {{ order.count || 1 }} x {{ getProductName(order) }}
              </div>
              
              <!-- Size -->
              <div class="text-subtitle-2" v-if="order.size">
                Size: {{ order.size }}
              </div>
              
              <!-- Toppings -->
              <div 
                v-for="(topping, tIndex) in filterToppings(order)"
                :key="`${order.id}-${tIndex}`"
                class="text-subtitle-2"
              >
                + {{ topping.name }} (x{{ topping.count || 1 }})
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
            <span class="text-body-1">{{ formatPrice(getProductPrice(order)) }}đ</span>
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
            <span>{{ formatPrice(subtotal) }}đ</span>
          </div>
        </template>
      </v-list-item>

      <v-list-item class="px-0">
        <template v-slot:default>
          <div class="d-flex justify-space-between w-100">
            <span>Phí giao hàng</span>
            <span>{{ formatPrice(15000) }}đ</span>
          </div>
        </template>
      </v-list-item>

      <v-divider class="my-2"></v-divider>

      <v-list-item class="px-0">
        <template v-slot:default>
          <div class="d-flex justify-space-between w-100">
            <EditVoucherDialog
              v-model="selectedVoucher"
              :total-price="subtotal"
              @voucher-selected="handleVoucherSelected"
            />
            <span v-if="selectedVoucher" class="text-orange">
              -{{ formatPrice(selectedVoucher.price) }}đ
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
import { useNotificationStore } from '@/stores/notification'
import { useCartStore } from '@/stores/cart'
import EditOrderDialog from './EditOrderDialog.vue'
import EditVoucherDialog from './EditVoucherDialog.vue'
import { useVoucherStore } from '@/stores/voucher'

export default {
  name: 'OrderSummary',
  
  components: {
    EditOrderDialog,
    EditVoucherDialog
  },

  data() {
    return {
      orders: [],
      totalPrice: 0,
      subtotal: 0,
      selectedVoucher: null,
      showEditDialog: false,
      selectedOrder: null,
      isProcessingDelete: false
    }
  },

  created() {
    this.loadOrderData()
    this.voucherStore.loadVoucherFromStorage()
    window.addEventListener('voucher-localstorage-changed', this.handleVoucherChange)
  },

  beforeUnmount() {
    window.removeEventListener('voucher-localstorage-changed', this.handleVoucherChange)
  },

  computed: {
    safeOrders() {
      return this.orders || []
    },
    selectedVoucher() {
      return this.voucherStore.selectedVoucher
    }
  },

  setup() {
    const voucherStore = useVoucherStore()
    return { voucherStore }
  },

  methods: {
    loadOrderData() {
      try {
        const orderData = JSON.parse(localStorage.getItem("order"))
        if (!orderData) return
        
        //console.log('orderData trước khi map:', orderData)
        
        this.orders = orderData.map(order => ({
          ...order,
          count: order.count || 1,
          product_item: order.product_item,
          topping_items: Array.isArray(order.topping_items) ? order.topping_items : []
        }))

        //console.log('orders sau khi map:', this.orders)
        this.calculateTotalPrice()
        this.$emit('order-loaded', {
          orders: this.orders,
          totalPrice: this.totalPrice
        })
      } catch (error) {
        console.error('Lỗi khi load đơn hàng:', error)
        console.error('Chi tiết lỗi:', error.message)
      }
    },

    getProductName(order) {
      if (!order?.product_item?.name) {
        console.warn('Không tìm thấy tên sản phẩm:', order)
        return 'Sản phẩm không xác định'
      }
      return order.product_item.name
    },

    getProductPrice(order) {
      if (!order?.product_item) return 0
      
      const count = order.count || 1
      const basePrice = Number(order.product_item.price) * count
      const toppingPrice = this.calculateToppingPrice(order.topping_items, count)
      const sizePrice = this.calculateSizePrice(order.size, count)
      
      return basePrice + toppingPrice + sizePrice
    },

    filterToppings(order) {
      if (!Array.isArray(order?.topping_items)) return []
      return order.topping_items.filter(topping => 
        topping && 
        typeof topping === 'object' && 
        topping.name &&
        topping.count === 1
      )
    },

    calculateToppingPrice(toppings = [], count = 1) {
      if (!Array.isArray(toppings)) return 0
      return toppings.reduce((sum, topping) => {
        if (!topping?.price) return sum
        return sum + (Number(topping.price) * count)
      }, 0)
    },

    calculateSizePrice(size, count = 1) {
      const prices = { M: 6000, L: 10000 }
      return (prices[size] || 0) * count
    },

    formatPrice(price) {
      if (typeof price === 'string') {
        price = parseFloat(price)
      }
      return new Intl.NumberFormat('vi-VN').format(price || 0)
    },

    calculateTotalPrice() {
      this.subtotal = Math.max(0, this.orders.reduce((sum, order) => {
        return sum + this.getProductPrice(order)
      }, 0))
      
      const shippingFee = 15000
      const discount = this.voucherStore.selectedVoucher?.price || 0
      
      this.totalPrice = Math.max(0, this.subtotal + shippingFee - discount)
      
      this.$emit('order-loaded', {
        items: this.orders,
        totalPrice: this.totalPrice,
        voucher: this.voucherStore.selectedVoucher
      })
    },

    openEditDialog(order) {
      this.selectedOrder = { ...order }  // Clone order để tránh thay đổi trực tiếp
      this.showEditDialog = true
    },

    handleEditComplete(updatedOrder) {
      // Cập nhật order trong danh sách
      const index = this.orders.findIndex(o => o.id === updatedOrder.id)
      if (index !== -1) {
        this.orders.splice(index, 1, updatedOrder)
        // Lưu lại vào localStorage
        localStorage.setItem('order', JSON.stringify(this.orders))
        // Tính toán lại tổng tiền
        this.calculateTotalPrice()
      }
      this.showEditDialog = false
    },

    async handleDeleteItem(item) {
      if (this.isProcessingDelete) return
      
      const notificationStore = useNotificationStore()
      const cartStore = useCartStore()
      this.isProcessingDelete = true
      
      try {
        if (!item || !item.id) {
          console.error('Item hoặc item.id không hợp lệ:', item)
          return
        }

        cartStore.removeItem(item.id)
        await this.loadOrderData()

        if (cartStore.itemCount === 0) {
          notificationStore.warning('Giỏ hàng của bạn hiện đang trống. Vui lòng thêm sản phẩm trước khi đặt hàng.', 5000)
          setTimeout(() => {
            this.$router.push('/mainpage')
          }, 3000)
        } else {
          notificationStore.success(`Đã xóa "${item.product_item.name}" khỏi giỏ hàng`, 3000)
        }
      } catch (error) {
        console.error('Chi tiết lỗi:', error)
        notificationStore.error('Lỗi khi xóa sản phẩm: ' + error.message)
      } finally {
        this.isProcessingDelete = false
      }
    },

    handleVoucherChange(event) {
      if (event.detail?.storage) {
        this.voucherStore.selectedVoucher = JSON.parse(event.detail.storage)
        this.calculateTotalPrice()
      }
    },

    handleVoucherSelected(voucher) {
      this.voucherStore.setSelectedVoucher(voucher)
      this.calculateTotalPrice()
    }
  }
}
</script> 