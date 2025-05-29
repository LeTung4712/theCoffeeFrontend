<template>
  <v-container fluid class="new-order-container">
    <v-card class="mx-auto rounded-lg" elevation="2">
      <!-- Header Section -->
      <div class="header-gradient pa-6">
        <v-row align="center" class="mb-4">
          <v-col cols="12" class="d-flex align-center">
            <v-icon icon="mdi-cart-clock" size="32" color="white" class="mr-3"></v-icon>
            <h1 class="text-h4 font-weight-bold text-white mb-0">ĐƠN HÀNG CHỜ XÁC NHẬN</h1>
          </v-col>
        </v-row>

        <!-- Stats Cards -->
        <v-row>
          <v-col cols="12" md="6">
            <v-card class="stats-card pa-4 rounded-lg" elevation="4">
              <div class="d-flex align-center">
                <v-icon icon="mdi-shopping" size="24" color="primary" class="mr-3"></v-icon>
                <div>
                  <div class="text-subtitle-1 text-grey-darken-1">TỔNG SỐ ORDER TRONG NGÀY</div>
                  <div class="text-h4 font-weight-bold primary--text mt-1">
                    <v-skeleton-loader v-if="loading" type="text" width="50"></v-skeleton-loader>
                    <template v-else>{{ new_orders.length }}</template>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card class="search-card pa-4 rounded-lg" elevation="4">
              <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Tìm kiếm theo mã đơn hàng"
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
            <v-chip :color="getStatusColor(item.payment_status)" size="small" class="status-chip"
              :class="item.payment_status === '0' ? 'pulse-animation' : ''">
              {{ getStatusText(item.payment_status) }}
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
      headers: [
        { title: 'STT', key: 'number', align: 'center', width: '5%' },
        { title: 'MÃ ĐƠN', key: 'order_code', align: 'center', width: '15%' },
        { title: 'Thời gian', key: 'created_at', align: 'center', width: '20%' },
        { title: 'SỐ ĐIỆN THOẠI', key: 'mobile_no', align: 'center', width: '15%' },
        { title: 'ĐỊA CHỈ', key: 'address', align: 'center', width: '40%' },
        { title: 'PHƯƠNG THỨC TT', key: 'payment_method', align: 'center', width: '10%' },
        { title: 'TRẠNG THÁI', key: 'payment_status', align: 'center', width: '15%' },
      ],
      new_orders: [],
    }
  },

  computed: {
    tableItems() {
      return this.new_orders.map((order, index) => ({
        ...order,
        number: index + 1
      }));
    }
  },

  created() {
    this.fetchOrders();
  },

  methods: {
    async fetchOrders() {
      try {
        const { data } = await orderAPI.getUnsuccessOrders();
        this.new_orders = data.orders;
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Có thể thêm xử lý lỗi ở đây (hiển thị thông báo lỗi)
      } finally {
        this.loading = false;
      }
    },

    formatDateTime,

    getStatusColor(payment_status) {
      const statusColors = {
        '0': 'warning',
        '1': 'info'
      };
      return statusColors[payment_status] || 'grey';
    },

    getStatusText(payment_status) {
      const statusTexts = {
        '0': 'CHỜ THANH TOÁN',
        '1': 'ĐÃ THANH TOÁN'
      };
      return statusTexts[payment_status] || 'KHÔNG XÁC ĐỊNH';
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
</style>