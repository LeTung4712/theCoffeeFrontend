<template>
  <div class="order-history-tab">
    <!-- Tabs trạng thái đơn hàng -->
    <v-tabs v-model="activeTab" color="primary" slider-color="primary" centered class="mb-4"
      @touchstart="handleTouchStart" @touchend="handleTouchEnd">
      <v-tab value="pending">
        Chờ xác nhận
        <v-badge v-if="pendingOrdersCount > 0" :content="pendingOrdersCount" color="error" offset-x="-10"
          offset-y="-5"></v-badge>
      </v-tab>
      <v-tab value="processing">
        Đang xử lý
        <v-badge v-if="processingOrdersCount > 0" :content="processingOrdersCount" color="error" offset-x="-10"
          offset-y="-5"></v-badge>
      </v-tab>
      <v-tab value="shipping">
        Đang giao
        <v-badge v-if="shippingOrdersCount > 0" :content="shippingOrdersCount" color="error" offset-x="-10"
          offset-y="-5"></v-badge>
      </v-tab>
      <v-tab value="completed">Hoàn thành</v-tab>
      <v-tab value="cancelled">Đã hủy</v-tab>
    </v-tabs>

    <!-- Thanh tìm kiếm -->
    <div class="d-flex align-center mb-4">
      <v-text-field v-model="searchLocal" label="Tìm kiếm đơn hàng" prepend-inner-icon="mdi-magnify" outlined dense
        clearable class="flex-grow-1" />

      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" class="ml-2" variant="outlined" prepend-icon="mdi-filter-variant">
            Lọc
          </v-btn>
        </template>
        <v-list>
          <v-list-subheader>Trạng thái thanh toán</v-list-subheader>
          <v-list-item>
            <v-checkbox v-model="paymentFilters" label="Đã thanh toán" value="1" hide-details></v-checkbox>
          </v-list-item>
          <v-list-item>
            <v-checkbox v-model="paymentFilters" label="Chưa thanh toán" value="0" hide-details></v-checkbox>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <!-- Thông báo không có đơn hàng -->
    <v-alert v-if="paginatedOrders.length === 0" type="info" variant="tonal"
      text="Bạn chưa có đơn hàng nào trong mục này" class="mt-4"></v-alert>

    <!-- Danh sách đơn hàng -->
    <v-list v-else>
      <v-list-item v-for="order in paginatedOrders" :key="order.order_code" class="mb-4">
        <v-card width="100%" class="order-card" elevation="2" @click="toggleDetails(order.order_code)">
          <v-card-title class="py-2 px-4">
            <v-row no-gutters>
              <v-col cols="12" class="mb-2">
                <span class="text-subtitle-1 font-weight-bold bg-secondary px-2 py-1 rounded">
                  Mã đơn: {{ order.order_code }}
                </span>
              </v-col>
              <v-col cols="12">
                <v-chip v-if="order.payment_status == '1'" color="success" text-color="white" small>
                  Đã thanh toán
                </v-chip>
                <v-chip v-if="canPaymentAgain(order) && order.status !== '-1'" color="error" text-color="white" small
                  class="ml-2">
                  {{ getRemainingPaymentTime(order) }}
                </v-chip>
              </v-col>
            </v-row>
          </v-card-title>

          <v-card-text class="pt-2">
            <v-row dense>
              <v-col cols="12" sm="12">
                <v-icon small class="mr-2">mdi-clock-outline</v-icon>
                {{ formatDateTime(order.created_at) }}
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
                    <div class="info-line"><strong>Phương thức thanh toán:</strong> {{
                      getPaymentMethodText(order.payment_method) }}</div>
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
                      <v-btn v-if="canPaymentAgain(order)" color="primary" class="mr-2"
                        @click.stop="handlePaymentAgain(order)">
                        <v-icon left>mdi-cash-register</v-icon>
                        Thanh toán
                      </v-btn>
                      <v-btn v-if="canReceiveOrder(order.status)" color="success" class="mr-2"
                        @click.stop="confirmReceiveOrder(order.id)">
                        <v-icon left>mdi-check-circle</v-icon>
                        Đã nhận hàng
                      </v-btn>
                      <v-btn v-if="canCancelOrder(order.status)" color="error"
                        @click.stop="confirmCancelOrder(order.id)">
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

    <div class="text-center pt-2 pb-2">
      <v-pagination v-model="currentPage" :length="totalPages" :total-visible="totalVisiblePages" rounded="circle"
        density="comfortable" class="order-pagination"></v-pagination>
    </div>

    <!-- Thêm dialog xác nhận -->
    <v-dialog v-model="showConfirmDialog" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h5"
          :class="dialogType === 'cancel' ? 'bg-error text-white' : 'bg-success text-white'">
          {{ dialogTitle }}
        </v-card-title>
        <v-card-text class="pt-4">
          <p>{{ dialogMessage }}</p>
          <p v-if="dialogType === 'cancel'" class="text-subtitle-2 text-error font-weight-medium mt-2">
            Lưu ý: Bạn sẽ không thể hoàn tác hành động này sau khi xác nhận.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="closeDialog">
            Hủy bỏ
          </v-btn>
          <v-btn :color="dialogType === 'cancel' ? 'error' : 'success'" :loading="isProcessing" @click="processAction">
            Xác nhận
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { formatPrice } from '@/utils/format'
import { orderAPI } from '@/api/order'
import { paymentAPI } from '@/api/payment'
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
      activeTab: 'pending',
      paymentFilters: [],
      touchStartX: 0,
      touchEndX: 0,
      showConfirmDialog: false,
      dialogType: '',
      dialogTitle: '',
      dialogMessage: '',
      selectedOrderId: null,
      isProcessing: false,
      paymentTimers: {},
    }
  },

  computed: {
    // Đếm số lượng đơn chờ xác nhận - chỉ đếm đơn online chưa thanh toán
    pendingOrdersCount() {
      return this.orders.filter(order =>
        order.payment_status === '0' && order.payment_method !== 'cod'
      ).length;
    },

    // Đếm số lượng đơn đang xử lý - gồm đơn COD chưa thanh toán và đơn online đã thanh toán, status = 0
    processingOrdersCount() {
      return this.orders.filter(order =>
        order.status === '0' && (
          (order.payment_method === 'cod' && order.payment_status === '0') ||
          (order.payment_method !== 'cod' && order.payment_status === '1')
        )
      ).length;
    },

    // Đếm số lượng đơn đang giao - status = 1
    shippingOrdersCount() {
      return this.orders.filter(order => order.status === '1').length;
    },

    // Lọc đơn hàng theo tab được chọn
    filteredByTabOrders() {
      switch (this.activeTab) {
        case 'pending':
          // Tab chờ xác nhận: chỉ lấy đơn online chưa thanh toán
          return this.orders.filter(order =>
            order.payment_status === '0' && order.payment_method !== 'cod'
          );

        case 'processing':
          // Tab đang xử lý: lấy đơn COD chưa thanh toán hoặc đơn online đã thanh toán, status = 0
          return this.orders.filter(order =>
            order.status === '0' && (
              (order.payment_method === 'cod' && order.payment_status === '0') ||
              (order.payment_method !== 'cod' && order.payment_status === '1')
            )
          );

        case 'shipping':
          // Tab đang giao: lấy đơn có status = 1
          return this.orders.filter(order => order.status === '1');

        case 'completed':
          // Tab hoàn thành: status = 3
          return this.orders.filter(order => order.status === '2');

        case 'cancelled':
          // Tab đã hủy: status = -1
          return this.orders.filter(order => order.status === '-1');

        default:
          return this.orders.filter(order =>
            order.payment_status === '0' && order.payment_method !== 'cod'
          );
      }
    },

    // Lọc theo trạng thái thanh toán
    filteredByPaymentOrders() {
      if (this.paymentFilters.length === 0 || this.paymentFilters.length === 2) {
        return this.filteredByTabOrders;
      }

      return this.filteredByTabOrders.filter(order =>
        this.paymentFilters.includes(order.payment_status?.toString())
      );
    },

    // Lọc đơn hàng theo từ khóa tìm kiếm
    filteredOrders() {
      if (!this.searchLocal) return this.filteredByPaymentOrders;

      return this.filteredByPaymentOrders.filter(order =>
        order.order_code.toString().toLowerCase().includes(this.searchLocal.toLowerCase())
      );
    },

    // Tính tổng số trang
    totalPages() {
      return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    },

    // Phân trang đơn hàng
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredOrders.slice(start, end);
    },

    totalVisiblePages() {
      // Trên mobile hiển thị ít nút hơn
      return window.innerWidth < 600 ? 5 : 7;
    }
  },

  watch: {
    searchLocal() {
      this.currentPage = 1;
    },
    activeTab() {
      this.currentPage = 1;
    },
    paymentFilters() {
      this.currentPage = 1;
    }
  },

  mounted() {
    // Thêm event listener để cập nhật số lượng nút khi resize
    window.addEventListener('resize', this.handleResize);
    this.updatePaymentTimers();
  },

  beforeUnmount() {
    // Cleanup event listener
    window.removeEventListener('resize', this.handleResize);
    Object.values(this.paymentTimers).forEach(timer => clearInterval(timer));
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
        '1': 'Đang giao hàng',
        '2': 'Đã giao hàng',
        '-1': 'Đã hủy'
      }
      return statuses[status] || 'Không xác định'
    },

    // Lấy màu tương ứng với trạng thái đơn hàng
    getStatusColor(status) {
      const colors = {
        '0': 'warning',
        '1': 'info',
        '2': 'success',
        '-1': 'error'
      }
      return colors[status] || 'grey'
    },

    // Lấy text tương ứng với phương thức thanh toán
    getPaymentMethodText(method) {
      const methods = {
        'cod': 'Thanh toán khi nhận hàng',
        'momo': 'Ví điện tử MoMo',
        'vnpay': 'Thanh toán qua VNPay',
        'zalopay': 'Ví điện tử ZaloPay'
      }
      return methods[method] || method
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
      return ['0', '1'].includes(status.toString()) // Chỉ cho phép hiển thị nút hành động khi đơn hàng chưa giao hàng hoặc đang giao hàng
    },

    canReceiveOrder(status) {
      return status.toString() === '1' // Chỉ cho phép nhận đơn khi đang giao hàng
    },

    canCancelOrder(status) {
      return ['0'].includes(status.toString()) // Chỉ cho phép hủy khi chưa giao hàng hoặc đang giao hàng
    },

    canPaymentAgain(order) {
      if (order.payment_status === '1' || order.payment_method === 'cod') {
        return false;
      }

      const orderTime = new Date(order.created_at);
      const now = new Date();
      const hoursDiff = (now - orderTime) / (1000 * 60 * 60);

      return hoursDiff <= 24;
    },

    getRemainingPaymentTime(order) {
      const orderTime = new Date(order.created_at);
      const now = new Date();
      const hoursDiff = (now - orderTime) / (1000 * 60 * 60);
      const remainingHours = 24 - hoursDiff;

      if (remainingHours <= 0) {
        return 'Đã hết thời gian thanh toán';
      }

      const hours = Math.floor(remainingHours);
      const minutes = Math.floor((remainingHours - hours) * 60);
      return `Còn ${hours} giờ ${minutes} phút để thanh toán`;
    },

    async checkAndAutoCancelOrder(order) {
      if (order.payment_status === '1' || order.payment_method === 'cod') {
        return;
      }

      const orderTime = new Date(order.created_at);
      const now = new Date();
      const hoursDiff = (now - orderTime) / (1000 * 60 * 60);

      if (hoursDiff > 24) {
        try {
          await orderAPI.cancelOrder({ order_id: order.id });
          this.notificationStore.warning(`Đơn hàng ${order.order_code} đã bị hủy do quá thời gian thanh toán`, 5000);
          this.$emit('order-status-updated', { orderId: order.id, status: '-1' });
        } catch (error) {
          console.error('Lỗi khi tự động hủy đơn:', error);
        }
      }
    },

    updatePaymentTimers() {
      this.paginatedOrders.forEach(order => {
        if (this.canPaymentAgain(order)) {
          this.paymentTimers[order.order_code] = setInterval(() => {
            this.checkAndAutoCancelOrder(order);
            this.$forceUpdate(); // Cập nhật UI
          }, 60000); // Kiểm tra mỗi phút
        }
      });
    },

    async handlePaymentAgain(order) {
      try {
        const paymentData = {
          order_code: order.order_code,
          return_url: `${window.location.origin}/user/lich-su`
        }
        const response = await paymentAPI.createMomoPayment(paymentData)
        const paymentUrl = response.data.payUrl

        if (!paymentUrl) {
          throw new Error('Không nhận được URL thanh toán')
        }
        // Chuyển hướng người dùng đến trang thanh toán MoMo
        window.location.href = paymentUrl
      } catch (error) {
        this.notificationStore.error('Lỗi khi tạo thanh toán online', 2000)
      }
    },

    confirmReceiveOrder(orderId) {
      this.selectedOrderId = orderId;
      this.dialogType = 'receive';
      this.dialogTitle = 'Xác nhận nhận hàng';
      this.dialogMessage = 'Bạn xác nhận đã nhận được đơn hàng này?';
      this.showConfirmDialog = true;
    },

    confirmCancelOrder(orderId) {
      this.selectedOrderId = orderId;
      this.dialogType = 'cancel';
      this.dialogTitle = 'Xác nhận hủy đơn';
      this.dialogMessage = 'Bạn có chắc chắn muốn hủy đơn hàng này?';
      this.showConfirmDialog = true;
    },

    // Thêm các phương thức xử lý dialog

    closeDialog() {
      this.showConfirmDialog = false;
      this.selectedOrderId = null;
      this.isProcessing = false;
    },

    async processAction() {
      if (!this.selectedOrderId) return;

      this.isProcessing = true;

      try {
        if (this.dialogType === 'receive') {
          await orderAPI.successOrder({ order_id: this.selectedOrderId });
          this.notificationStore.success("Xác nhận giao hàng thành công", 3000);
          this.$emit('order-status-updated', { orderId: this.selectedOrderId, status: '3' });
        } else if (this.dialogType === 'cancel') {
          await orderAPI.cancelOrder({ order_id: this.selectedOrderId });
          this.notificationStore.success("Hủy đơn hàng thành công", 3000);
          this.$emit('order-status-updated', { orderId: this.selectedOrderId, status: '-1' });
        }

        this.$router.push('/user/lich-su');
      } catch (error) {
        console.error(`Lỗi khi ${this.dialogType === 'cancel' ? 'hủy' : 'xác nhận'} đơn hàng:`, error);
        this.notificationStore.error(`Có lỗi xảy ra, vui lòng thử lại sau`, 3000);
      } finally {
        this.isProcessing = false;
        this.showConfirmDialog = false;
      }
    },

    handleTouchStart(e) {
      this.touchStartX = e.touches[0].clientX;
      e.stopPropagation(); // Ngăn chặn sự kiện lan truyền
    },

    handleTouchEnd(e) {
      this.touchEndX = e.changedTouches[0].clientX;
      e.stopPropagation(); // Ngăn chặn sự kiện lan truyền
    },

    handleResize() {
      // Force update computed property
      this.$forceUpdate();
    }
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

/* Thêm CSS cho tabs và filter */
.v-tabs {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: white;
}

/* Thêm style cho badge trên tabs */
:deep(.v-badge__badge) {
  font-size: 12px;
  height: 20px;
  min-width: 20px;
  padding: 0 4px;
  top: -20px !important;
  /* Dịch badge lên trên */
  right: -8px !important;
  /* Điều chỉnh vị trí ngang */
}

:deep(.v-tab) {
  position: relative;
  padding-right: 24px;
  /* Để có chỗ hiển thị badge */
}

.order-pagination {
  /* Đảm bảo phân trang không bị tràn trên mobile */
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 0;
  /* Bỏ margin bottom */
}

/* Tùy chỉnh kích thước nút trên mobile */
@media (max-width: 599px) {
  :deep(.v-pagination__item) {
    min-width: 32px !important;
    height: 32px !important;
  }

  :deep(.v-pagination__prev),
  :deep(.v-pagination__next) {
    min-width: 32px !important;
    height: 32px !important;
  }
}
</style>