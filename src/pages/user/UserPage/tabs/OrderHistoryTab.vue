<template>
  <div class="order-history-tab">
    <v-text-field v-model="searchLocal" label="Tìm kiếm đơn hàng" prepend-inner-icon="mdi-magnify" outlined dense
      clearable />
    <v-list>
      <v-list-item v-for="order in paginatedOrders" :key="order.order_id" class="mb-4">
        <v-card width="100%" class="order-card" elevation="2" @click="toggleDetails(order.order_id)">
          <v-card-title class="d-flex justify-space-between py-2 px-4">
            <span class="text-subtitle-1 font-weight-bold bg-secondary px-2 py-1 rounded">
              Mã đơn: {{ order.order_id }}
            </span>
            <v-chip :color="getStateColor(order.state)" text-color="white" small>
              {{ getStateText(order.state) }}
            </v-chip>
          </v-card-title>

          <v-card-text class="pt-2">
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-icon small class="mr-2">mdi-clock-outline</v-icon>
                {{ formatDateTime(order.order_time) }}
              </v-col>
              <v-col cols="12" sm="6">
                <v-icon small class="mr-2">mdi-map-marker</v-icon>
                {{ order.address }}
              </v-col>
            </v-row>

            <v-expand-transition>
              <v-row v-if="isDetailsVisible(order.order_id)" class="order-details">
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
                        <v-row v-for="product in order.products" :key="product.id" class="product-item py-2">
                          <v-col cols="12">
                            <v-row align="center" justify="space-between" no-gutters>
                              <v-col>
                                <div class="product-name">
                                  {{ product.product_count }} x {{ product.product_name }}
                                  <span class="size-tag">(Size {{ product.size }})</span>
                                </div>

                                <div v-if="getActiveTopping(product).length > 0" class="topping-list mt-1">
                                  <div v-for="(topping, index) in getActiveTopping(product)" :key="index"
                                    class="topping-item">
                                    + {{ topping.name }}
                                  </div>
                                </div>
                              </v-col>

                              <v-col cols="auto">
                                <div class="product-price">{{ formatPrice(product.price) }}đ</div>
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
                        <span>{{ formatPrice(calculateProductsTotal(order)) }}đ</span>
                      </div>
                      <div class="price-line">
                        <span><strong>Phí ship:</strong></span>
                        <span>{{ formatPrice(order.shipcost) }}đ</span>
                      </div>
                      <div class="price-line">
                        <span><strong>Giảm giá:</strong></span>
                        <span>- {{ formatPrice(order.discount_money) }}đ</span>
                      </div>
                      <div class="price-line total">
                        <span><strong>Tổng thanh toán:</strong></span>
                        <span>{{ formatPrice(order.total_price) }}đ</span>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-expand-transition>

            <v-icon class="expand-icon" :class="{ 'rotated': isDetailsVisible(order.order_id) }">
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
        order.order_id.toString().toLowerCase().includes(this.searchLocal.toLowerCase())
      );
    },

    // Phân trang đơn hàng
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredOrders.slice(start, end)
    }
  },

  watch: {
    searchLocal() {
      this.currentPage = 1
    }
  },

  methods: {
    // Định dạng giá tiền theo định dạng Việt Nam
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN').format(price)
    },

    // Định dạng ngày giờ theo định dạng Việt Nam
    formatDateTime(datetime) {
      return new Date(datetime).toLocaleString('vi-VN')
    },

    // Lấy text tương ứng với trạng thái đơn hàng
    getStateText(state) {
      const states = {
        0: 'Chờ xác nhận',
        1: 'Đã xác nhận',
        2: 'Đang giao hàng',
        3: 'Đã giao hàng',
        4: 'Đã hủy'
      }
      return states[state] || 'Không xác định'
    },

    // Lấy màu tương ứng với trạng thái đơn hàng
    getStateColor(state) {
      const colors = {
        0: 'warning',
        1: 'info',
        2: 'purple',
        3: 'success',
        4: 'error'
      }
      return colors[state] || 'grey'
    },

    // Hiển thị chi tiết đơn hàng
    toggleDetails(orderId) {
      this.visibleDetails = {
        ...this.visibleDetails,
        [orderId]: !this.visibleDetails[orderId]
      }
    },

    // Kiểm tra xem chi tiết đơn hàng có hiển thị hay không
    isDetailsVisible(orderId) {
      return !!this.visibleDetails[orderId];
    },

    // Lấy topping có sử dụng trong đơn hàng
    getActiveTopping(product) {
      return product.topping_id.map((topping, index) => ({
        ...topping,
        count: product.topping_count[index]
      })).filter(topping => topping.count > 0);
    },

    // Tính tổng tiền của các sản phẩm trong đơn hàng chưa tính phí ship và giảm giá
    calculateProductsTotal(order) {
      return order.products.reduce((total, product) => {
        return total + (product.price * product.product_count);
      }, 0);
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
}

.topping-list {
  padding-left: 16px;
}

.topping-item {
  font-size: 0.85rem;
  color: rgba(0, 0, 0, 0.6);
  padding: 2px 0;
}

.product-price {
  font-weight: 600;
  font-size: 0.95rem;
}
</style>