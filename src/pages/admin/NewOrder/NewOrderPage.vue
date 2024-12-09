<template>
  <v-container fluid class="pa-0">
    <!-- Header Section -->
    <v-row class="bg-white">
      <v-col cols="12">
        <v-row justify="center" class="pa-4">
          <h2>New Orders</h2>
        </v-row>
      </v-col>

      <!-- Order Counter -->
      <v-col cols="12" sm="6" offset-sm="3">
        <v-card flat class="text-center pa-4">
          <div class="text-grey-darken-2 text-body-1 mb-2">
            TỔNG SỐ ORDER TRONG NGÀY
          </div>
          <div class="text-h5 font-weight-medium">
            {{ new_orders.length }}
          </div>
        </v-card>
      </v-col>

      <!-- Search Bar -->
      <v-col cols="12" sm="6" offset-sm="3">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Nhập mã đơn hàng"
          density="compact"
          variant="outlined"
          hide-details
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Data Table -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="tableItems"
          :search="search"
          :items-per-page="5"
          hover
          class="elevation-1"
        >
          <template v-slot:item.order_code="{ item }">
            <div 
              class="text-primary text-decoration-underline cursor-pointer"
              @click="navigateToDetails(item.order_code)"
            >
              {{ item.order_code }}
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { orderAPI } from "@/api/order";

export default {
  name: "NewOrderPage",
  
  data() {
    return {
      search: '',
      headers: [
        { title: 'STT', key: 'number', align: 'center', width: '10%' },
        { title: 'MÃ ĐƠN', key: 'order_code', align: 'center', width: '15%' },
        { title: 'Thời gian', key: 'order_time', align: 'center', width: '20%' },
        { title: 'SỐ ĐIỆN THOẠI', key: 'mobile_no', align: 'center', width: '15%' },
        { title: 'ĐỊA CHỈ', key: 'address', align: 'center', width: '40%' },
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
    this.checkAuth();
  },

  methods: {
    checkAuth() {
      if (localStorage.getItem("AdminLoggedIn") === "false") {
        this.$router.push("/pages/login");
        return;
      }
      this.fetchOrders();
    },

    async fetchOrders() {
      try {
        const { data } = await orderAPI.getUnsuccessOrders();
        this.new_orders = data.orders;
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Có thể thêm xử lý lỗi ở đây (hiển thị thông báo lỗi)
      }
    },

    navigateToDetails(orderId) {
      this.$router.push({
        name: "OrderDetails",
        params: { order_detail_id: orderId },
      }).catch(() => {});
    },
  },
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>