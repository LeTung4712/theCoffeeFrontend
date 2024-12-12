<template>
  <div class="order-history-tab">
    <v-text-field v-model="searchLocal" label="Tìm kiếm đơn hàng" prepend-inner-icon="mdi-magnify" outlined dense
      clearable />
    <v-list>
      <v-list-item v-for="order in paginatedOrders" :key="order.order_code" class="mb-4">
        <v-card width="100%" class="order-card" elevation="2" @click="toggleDetails(order.order_code)">
          <v-card-title class="d-flex justify-space-between py-2 px-4">
            <span class="text-subtitle-1 font-weight-bold bg-secondary px-2 py-1 rounded">
              Mã đơn: {{ order.order_code }}
            </span>
            <v-chip :color="getStatusColor(order.status)" text-color="white" small>
              {{ getStatusText(order.status) }}
            </v-chip>
          </v-card-title>

          <v-card-text class="pt-2">
            <v-row dense>
              <v-col cols="12" sm="12">
                <v-icon small class="mr-2">mdi-clock-outline</v-icon>
                {{ formatDateTime(order.order_time) }}
              </v-col>
              <v-col cols="12" sm="12">
                <v-icon small class="mr-2">mdi-map-marker</v-icon>
                {{ order.address }}
              </v-col>
            </v-row>

            <v-expand-transition>
              <v-row v-if="isDetailsVisible(order.order_code)" class="order-details">
                <v-col cols="12">
                  <div class="customer-info">
                    <div class="info-line"><strong>Khách hàng:</strong> {{ order.user_name }}</div>
                    <div class="info-line"><strong>Số điện thoại:</strong> {{ order.mobile_no }}</div>
                    <div class="info-line"><strong>Ghi chú:</strong> {{ order.note || 'Không có' }}</div>
                  </div>

                  <v-divider class="my-3"></v-divider>

                  <v-row class="products-list mt-3">
                    <v-col cols="12">
                      <div class="products-section">
                        <div class="section-title mb-2">Sản phẩm đã đặt:</div>
                        <v-row v-for="product in order.order_items" :key="product.product_id" class="product-item py-2">
                          <v-col cols="12">
                            <v-row align="center" justify="space-between" no-gutters>
                              <v-col>
                                <div class="product-name">
                                  {{ product.product_quantity }} x {{ product.product_name }}
                                  <span class="size-tag">(Size {{ product.size }})</span>
                                </div>
                                <div class="product-note">
                                  Ghi chú: {{ product.item_note }}
                                </div>

                                <div v-for="topping in product.topping_items" :key="topping.id"
                                  class="topping-list mt-1">
                                  + {{ topping.name }} ({{ formattedPrice(topping.price) }}đ)
                                </div>
                              </v-col>

                              <v-col cols="auto">
                                <div class="product-price">{{ calculateTotalPrice(product) }}đ</div>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row class="price-info mt-3">
                    <v-col cols="12">
                      <div class="price-line">
                        <span><strong>Tổng tiền hàng:</strong></span>
                        <span>{{ formattedPrice(order.total_price) }}đ</span>
                      </div>
                      <div class="price-line">
                        <span><strong>Phí ship:</strong></span>
                        <span>{{ formattedPrice(order.shipping_fee) }}đ</span>
                      </div>
                      <div class="price-line">
                        <span><strong>Giảm giá:</strong></span>
                        <span>- {{ formattedPrice(order.discount_amount) }}đ</span>
                      </div>
                      <div class="price-line total">
                        <span><strong>Tổng thanh toán:</strong></span>
                        <span>{{ formattedPrice(order.final_price) }}đ</span>
                      </div>
                    </v-col>
                  </v-row>

                  <!-- Thêm các nút hành động -->
                  <v-row v-if="isDetailsVisible(order.order_code) && canShowActionButtons(order.status)" class="mt-3">
                    <v-col cols="12" class="d-flex justify-end">
                      <v-btn
                        v-if="canReceiveOrder(order.status)"
                        color="success"
                        class="mr-2"
                        @click.stop="confirmReceiveOrder(order.id)"
                      >
                        <v-icon left>mdi-check-circle</v-icon>
                        Đã nhận hàng
                      </v-btn>
                      <v-btn
                        v-if="canCancelOrder(order.status)"
                        color="error"
                        @click.stop="confirmCancelOrder(order.id)"
                      >
                        <v-icon left>mdi-close-circle</v-icon>
                        Hủy đơn
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-expand-transition>

            <v-icon class="expand-icon" :class="{ 'rotated': isDetailsVisible(order.order_code) }">
              mdi-chevron-down
            </v-icon>
          </v-card-text>
        </v-card>
      </v-list-item>
    </v-list>

    <div class="text-center pt-3">
      <v-pagination v-model="currentPage" :length="totalPages" :total-visible="7"></v-pagination>
    </div>
  </div>
</template>

<script>
import { formatPrice } from '@/utils/format'
import { orderAPI } from '@/api/order'
import { useNotificationStore } from '@/stores/notification'
export default {
  name: 'OrderHistoryTab',
  props: {
    orders: {
      type: Array,
      default: () => []
    },
    search: {
      type: String,
      default: ''
    }
  },

  setup() {
    const notificationStore = useNotificationStore()
    return { notificationStore }
  },

  data() {
    return {
      searchLocal: this.search,
      products: [],
      visibleDetails: {},
      currentPage: 1,
      itemsPerPage: 5,
    }
  },

  computed: {
    // Tính tổng số trang
    totalPages() {
      return Math.ceil(this.filteredOrders.length / this.itemsPerPage)
    },

    // Lọc đơn hàng theo mã đơn hàng
    filteredOrders() {
      if (!this.searchLocal) return this.orders;
      return this.orders.filter(order =>
        order.order_code.toString().toLowerCase().includes(this.searchLocal.toLowerCase())
      );
    },

    // Phân trang đơn hàng
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredOrders.slice(start, end)
    },

    
  },

  watch: {
    searchLocal() {
      this.currentPage = 1
    }
  },

  methods: {
    formattedPrice(price) {
      return formatPrice(price)
    },

    // Định dạng ngày giờ theo định dạng Việt Nam
    formatDateTime(datetime) {
      return new Date(datetime).toLocaleString('vi-VN')
    },

    // Lấy text tương ứng với trạng thái đơn hàng
    getStatusText(status) {
      const statuses = {
        '0': 'Chờ giao hàng',
        '1': 'Đã thanh toán - chờ giao hàng ',
        '2': 'Đang giao hàng',
        '3': 'Thành công',
        '-1': 'Đã hủy'
      }
      return statuses[status] || 'Không xác định'
    },

    // Lấy màu tương ứng với trạng thái đơn hàng
    getStatusColor(status) {
      const colors = {
        '0': 'warning',
        '1': 'info',
        '2': 'purple',
        '3': 'success',
        '-1': 'error'
      }
      return colors[status] || 'grey'
    },

    // Hiển thị hoặc ẩn chi tiết đơn hàng
    toggleDetails(orderCode) {
      this.visibleDetails = {
        ...this.visibleDetails,
        [orderCode]: !this.visibleDetails[orderCode]
      }
    },

    // Kiểm tra xem chi tiết đơn hàng có hiển thị hay không
    isDetailsVisible(orderCode) {
      return !!this.visibleDetails[orderCode]; //neu co gia tri thi tra ve true, nguoc lai tra ve false
    },

    // Tính tổng tiền của từng sản phẩm trong đơn hàng chưa tính phí ship và giảm giá
    calculateTotalPrice(product) {
      const basePrice = parseFloat(product.product_price)
      const toppingPrice = product.topping_items.reduce((total, topping) => total + parseFloat(topping.price), 0)
      const sizePrice = product.size === 'S' ? 0 : product.size === 'M' ? 6000 : 10000
      return formatPrice((basePrice + toppingPrice + sizePrice) * product.product_quantity)
    },

    canShowActionButtons(status) {
      return ['0', '1', '2'].includes(status.toString())
    },

    canReceiveOrder(status) {
      return status.toString() === '2' // Chỉ cho phép nhận đơn khi đang giao hàng
    },

    canCancelOrder(status) {
      return ['0', '1', '2'].includes(status.toString()) // Chỉ cho phép hủy khi chưa giao hàng
    },

    async confirmReceiveOrder(orderCode) {
      if (confirm('Bạn xác nhận đã nhận được đơn hàng này?')) {
        try {
          await orderAPI.successOrder({ order_id: orderCode });
          this.notificationStore.success("Xác nhận giao hàng thành công", 3000);
          this.$router.push('/user/lich-su');
        } catch (error) {
          console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error)
        }
      }
    },

    async confirmCancelOrder(orderCode) {
      if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
        try {
          await orderAPI.cancelOrder({ order_id: orderCode });
          this.notificationStore.success("Xác nhận hủy đơn hàng thành công", 3000);
          this.$router.push('/user/lich-su');
        } catch (error) {
          console.error('Lỗi khi hủy đơn hàng:', error)
        }
      }
    },
  }
}
</script>

<style scoped>
.order-card {
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  border-radius: 8px !important;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
}

.expand-icon {
  position: absolute;
  bottom: 8px;
  right: 8px;
  transition: transform 0.3s;
  opacity: 0.6;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

.order-details {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin-top: 12px;
  padding-top: 12px;
}

.product-item {
  border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
  padding: 12px 0;
}

.size-tag {
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.9em;
  margin-left: 4px;
}

.topping-list {
  font-size: 0.9em;
  color: rgba(0, 0, 0, 0.6);
  margin-top: 4px;
}

.price-info {
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  margin-top: 16px !important;
}

.total {
  color: #1976d2;
  font-size: 1.1em;
  margin-top: 8px;
  display: block;
}

.price-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.price-line.total {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.products-section {
  padding: 8px 0;
}

.section-title {
  font-weight: 600;
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.87);
}

.product-name {
  font-size: 0.95rem;
  line-height: 1.4;
  color: rgba(0, 0, 0, 0.87);
}

.topping-list {
  padding-left: 16px;
}

.topping-item {
  font-size: 0.85rem;
  color: rgba(0, 0, 0, 0.6);
  padding: 2px 0;
}
styleduct-price {
  font-weight: 600;
  font-size: 0.95rem;
}
</style>