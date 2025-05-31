<template>
  <v-container fluid class="new-order-container">
    <v-card class="mx-auto rounded-lg" elevation="2">
      <!-- Header Section -->
      <div class="header-gradient pa-6">
        <v-row align="center" class="mb-4">
          <v-col cols="12" class="d-flex align-center">
            <v-icon icon="mdi-cart-clock" size="32" color="white" class="mr-3"></v-icon>
            <h1 class="text-h4 font-weight-bold text-white mb-0">QUẢN LÝ ĐƠN HÀNG</h1>
          </v-col>
        </v-row>

        <!-- Stats Cards -->
        <v-row class="align-center">
          <v-col cols="12" md="8">
            <v-card class="tabs-container" elevation="0">
              <v-tabs v-model="activeTab" color="primary" bg-color="white" class="rounded-t-lg">
                <v-tab value="pending" class="tab-item">
                  <div class="d-flex align-center">
                    <v-icon start color="warning">mdi-cart-outline</v-icon>
                    <span class="ml-2">CHỜ XÁC NHẬN</span>
                    <v-chip v-if="pendingOrdersCount > 0" color="warning" size="small" class="ml-2" variant="flat">
                      {{ pendingOrdersCount }}
                    </v-chip>
                  </div>
                </v-tab>
                <v-tab value="confirmed" class="tab-item">
                  <div class="d-flex align-center">
                    <v-icon start color="info">mdi-cart-check</v-icon>
                    <span class="ml-2">CHỜ GIAO HÀNG</span>
                    <v-chip v-if="confirmedOrdersCount > 0" color="info" size="small" class="ml-2" variant="flat">
                      {{ confirmedOrdersCount }}
                    </v-chip>
                  </div>
                </v-tab>
                <v-tab value="delivering" class="tab-item">
                  <div class="d-flex align-center">
                    <v-icon start color="success">mdi-truck-delivery</v-icon>
                    <span class="ml-2">ĐANG GIAO</span>
                    <v-chip v-if="deliveringOrdersCount > 0" color="success" size="small" class="ml-2" variant="flat">
                      {{ deliveringOrdersCount }}
                    </v-chip>
                  </div>
                </v-tab>
              </v-tabs>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="search-card pa-2 rounded-lg" elevation="4">
              <v-text-field v-model="search" prepend-inner-icon="mdi-magnify"
                :label="activeTab === 'pending' ? 'Tìm kiếm đơn chờ xác nhận' : activeTab === 'confirmed' ? 'Tìm kiếm đơn chờ giao' : 'Tìm kiếm đơn đang giao'"
                density="comfortable" variant="outlined" hide-details class="search-field" :disabled="loading"
                bg-color="white"></v-text-field>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <!-- Data Table Section -->
      <v-card-text class="pa-6">
        <v-skeleton-loader v-if="loading" type="table" class="rounded-lg"></v-skeleton-loader>
        <v-data-table v-else :headers="headers" :items="tableItems" :search="search" :items-per-page="5" hover
          class="elevation-1 rounded-lg custom-table">
          <template v-slot:item.order_code="{ item }">
            <div class="order-code-link" @click="navigateToDetails(item.order_code)">
              {{ item.order_code }}
            </div>
          </template>
          <template v-slot:item.payment_status="{ item }">
            <v-chip :color="getPaymentStatusColor(item.payment_status)" size="small" class="status-chip"
              :class="item.payment_status === '0' ? 'pulse-animation' : ''">
              {{ getPaymentStatusText(item.payment_status) }}
            </v-chip>
          </template>
          <template v-slot:item.payment_method="{ item }">
            <v-chip :color="getPaymentMethodColor(item.payment_method)" size="small" class="status-chip">
              {{ getPaymentMethodText(item.payment_method) }}
            </v-chip>
          </template>
          <template v-slot:item.created_at="{ item }">
            <div class="d-flex align-center">
              {{ formatDateTime(item.created_at) }}
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { orderAPI } from "@/api/order";
import { formatDateTime } from "@/utils/format";

export default {
  name: "NewOrderPage",

  data() {
    return {
      loading: true,
      search: '',
      activeTab: 'pending',
      headers: [
        { title: 'STT', key: 'number', align: 'center', width: '5%' },
        { title: 'MÃ ĐƠN', key: 'order_code', align: 'center', width: '15%' },
        { title: 'Thời gian', key: 'created_at', align: 'center', width: '15%' },
        { title: 'SỐ ĐIỆN THOẠI', key: 'mobile_no', align: 'center', width: '15%' },
        { title: 'ĐỊA CHỈ', key: 'address', align: 'center', width: '25%' },
        { title: 'PHƯƠNG THỨC TT', key: 'payment_method', align: 'center', width: '15%' },
        { title: 'TRẠNG THÁI TT', key: 'payment_status', align: 'center', width: '15%' },
      ],
      pendingOrders: [],
      confirmedOrders: [],
      deliveringOrders: [],
    }
  },

  computed: {
    // Đơn chờ xác nhận (status = 0)
    filteredPendingOrders() {
      return this.pendingOrders;
    },

    // Đơn đã xác nhận chờ giao (status = 1)
    filteredConfirmedOrders() {
      return this.confirmedOrders;
    },

    // Đơn đang giao (status = 2)
    filteredDeliveringOrders() {
      return this.deliveringOrders;
    },

    // Số lượng đơn chờ xác nhận
    pendingOrdersCount() {
      return this.pendingOrders.length;
    },

    // Số lượng đơn chờ giao
    confirmedOrdersCount() {
      return this.confirmedOrders.length;
    },

    // Số lượng đơn đang giao
    deliveringOrdersCount() {
      return this.deliveringOrders.length;
    },

    // Lọc đơn hàng theo tab đang chọn
    filteredOrders() {
      switch (this.activeTab) {
        case 'pending':
          return this.filteredPendingOrders;
        case 'confirmed':
          return this.filteredConfirmedOrders;
        case 'delivering':
          return this.filteredDeliveringOrders;
        default:
          return this.filteredPendingOrders;
      }
    },

    // Format dữ liệu cho bảng
    tableItems() {
      const orders = this.filteredOrders;
      return orders.map((order, index) => ({
        ...order,
        number: index + 1
      }));
    }
  },

  watch: {
    activeTab: {
      immediate: true,
      handler(newTab) {
        this.fetchOrdersByTab(newTab);
      },
    },
  },

  created() {
    this.fetchAllOrders();
  },

  methods: {
    async fetchAllOrders() {
      this.loading = true;
      try {
        // Gọi đồng thời cả 3 API
        const [pendingResponse, confirmedResponse, deliveringResponse] = await Promise.allSettled([
          orderAPI.getPendingPaymentOrders(),
          orderAPI.getPendingDeliveryOrders(),
          orderAPI.getDeliveringOrders()
        ]);

        // Xử lý từng response
        this.pendingOrders = (pendingResponse.status === 'fulfilled' && pendingResponse.value.data.orders)
          ? pendingResponse.value.data.orders
          : [];
        this.confirmedOrders = (confirmedResponse.status === 'fulfilled' && confirmedResponse.value.data.orders)
          ? confirmedResponse.value.data.orders
          : [];
        this.deliveringOrders = (deliveringResponse.status === 'fulfilled' && deliveringResponse.value.data.orders)
          ? deliveringResponse.value.data.orders
          : [];
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Có thể hiển thị thông báo lỗi tổng quát nếu cần
      } finally {
        this.loading = false;
      }
    },

    async fetchOrdersByTab(tab) {
      // Không cần gọi API nữa vì đã có sẵn data
      this.loading = false;
    },

    async refreshCurrentTab() {
      // Refresh lại toàn bộ data
      await this.fetchAllOrders();
    },

    formatDateTime,

    getPaymentStatusColor(status) {
      const colors = {
        '0': 'warning',
        '1': 'success'
      };
      return colors[status] || 'grey';
    },

    getPaymentStatusText(status) {
      const texts = {
        '0': 'CHỜ THANH TOÁN',
        '1': 'ĐÃ THANH TOÁN'
      };
      return texts[status] || 'KHÔNG XÁC ĐỊNH';
    },

    getPaymentMethodColor(method) {
      const colors = {
        'cod': 'warning',
        'momo': 'pink',
        'vnpay': 'blue',
        'zalopay': 'indigo'
      };
      return colors[method] || 'grey';
    },

    getPaymentMethodText(method) {
      const texts = {
        'cod': 'Thanh toán khi nhận hàng',
        'momo': 'Ví MoMo',
        'vnpay': 'VNPay',
        'zalopay': 'ZaloPay'
      };
      return texts[method] || method;
    },

    navigateToDetails(orderCode) {
      this.$router.push({
        name: "OrderDetails",
        params: { order_code: orderCode },
      }).catch(() => { });
    },
  },
};
</script>

<style scoped>
.new-order-container {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 24px;
}

.header-gradient {
  background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%);
  border-radius: 8px 8px 0 0;
}

.stats-card {
  background: white;
  transition: transform 0.2s;
}

.stats-card:hover {
  transform: translateY(-2px);
}

.search-card {
  background: white;
  height: 100%;
  display: flex;
  align-items: center;
}

.search-field {
  border-radius: 8px;
}

.custom-table {
  border-radius: 8px;
  overflow: hidden;
}

.order-code-link {
  color: #1976d2;
  text-decoration: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: color 0.2s;
}

.order-code-link:hover {
  color: #2196f3;
  text-decoration: underline;
}

.status-chip {
  font-weight: 500;
  letter-spacing: 0.5px;
}

.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.4);
  }

  70% {
    box-shadow: 0 0 0 6px rgba(255, 152, 0, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(255, 152, 0, 0);
  }
}

:deep(.v-data-table) {
  background: white;
}

:deep(.v-data-table-header) {
  background-color: #f5f5f5;
}

:deep(.v-data-table-header th) {
  font-weight: 600 !important;
  color: #424242 !important;
}

:deep(.v-data-table-row:hover) {
  background-color: #f5f5f5 !important;
}

.tabs-container {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.v-tabs) {
  border-bottom: 1px solid #e0e0e0;
}

:deep(.v-tab) {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.5px;
  min-width: 200px;
  height: 48px;
  transition: all 0.3s ease;
}

:deep(.v-tab--selected) {
  background-color: #f5f5f5;
}

:deep(.v-tab:hover) {
  background-color: #fafafa;
}

:deep(.v-tab .v-icon) {
  font-size: 20px;
}

:deep(.v-tab .v-chip) {
  font-weight: 600;
  font-size: 12px;
  height: 20px;
}

:deep(.v-tabs-slider) {
  height: 3px;
}

@media (max-width: 960px) {
  .search-card {
    margin-top: 16px;
  }
}
</style>