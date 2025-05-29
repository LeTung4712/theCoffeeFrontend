<template>
    <v-container fluid class="pa-4">
        <v-row>
            <v-col cols="12">
                <v-card class="rounded-lg" elevation="2">
                    <!-- Header section với gradient background -->
                    <v-card class="rounded-t-lg" color="primary" flat>
                        <v-container>
                            <v-row align="center" class="py-4">
                                <v-col cols="12" sm="6">
                                    <v-row align="center" no-gutters>
                                        <v-col cols="auto" class="mr-4">
                                            <v-avatar size="80" class="elevation-4">
                                                <v-img :src="logo" cover alt="logo" />
                                            </v-avatar>
                                        </v-col>
                                        <v-col>
                                            <h2 class="text-h4 font-weight-bold text-white mb-1">THE COFFEE PAYMENT</h2>
                                            <div class="text-subtitle-1 text-white text-opacity-80">The CoffeeShop Bách
                                                Khoa</div>
                                        </v-col>
                                    </v-row>
                                </v-col>

                                <!-- Date picker với style mới -->
                                <v-col cols="12" sm="6" class="d-flex justify-sm-end">
                                    <v-card class="rounded-lg" color="white" flat>
                                        <v-card-text class="pa-4">
                                            <div class="text-subtitle-2 text-primary mb-2">CHỌN NGÀY XEM BÁO CÁO</div>
                                            <v-text-field v-model="mydate" type="date" density="compact"
                                                variant="outlined" hide-details class="date-picker-custom"
                                                bg-color="white" />
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card>

                    <!-- Stats cards với animation -->
                    <v-container class="mt-n8">
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-card class="rounded-lg" color="white" elevation="4">
                                    <v-card-text class="text-center pa-4">
                                        <v-icon size="32" color="primary" class="mb-2">mdi-cash-multiple</v-icon>
                                        <div class="text-subtitle-2 text-medium-emphasis mb-1">TỔNG TIỀN GIAO DỊCH</div>
                                        <div class="text-h4 font-weight-bold text-primary">{{ saleTotal }} VNĐ</div>
                                        <div class="text-caption text-medium-emphasis">Tính đến {{ formatTime(new
                                            Date()) }}</div>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-card class="rounded-lg" color="white" elevation="4">
                                    <v-card-text class="text-center pa-4">
                                        <v-icon size="32" color="success" class="mb-2">mdi-cart-check</v-icon>
                                        <div class="text-subtitle-2 text-medium-emphasis mb-1">TỔNG SỐ GIAO DỊCH</div>
                                        <div class="text-h4 font-weight-bold text-success">{{ countOrders }}</div>
                                        <div class="text-caption text-medium-emphasis">Giao dịch trong ngày</div>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-card class="rounded-lg" color="white" elevation="4">
                                    <v-card-text class="text-center pa-4">
                                        <v-icon size="32" color="info" class="mb-2">mdi-chart-line</v-icon>
                                        <div class="text-subtitle-2 text-medium-emphasis mb-1">TRUNG BÌNH/ĐƠN</div>
                                        <div class="text-h4 font-weight-bold text-info">
                                            {{ countOrders ? formatPrice(Math.round(parseInt(saleTotal.replace(/\./g,
                                                '')) / countOrders)) : '0' }} VNĐ
                                        </div>
                                        <div class="text-caption text-medium-emphasis">Giá trị trung bình mỗi đơn</div>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>

                    <!-- Search and Table section với style mới -->
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="search" prepend-inner-icon="mdi-magnify"
                                    label="Tìm kiếm theo mã đơn hàng" single-line density="comfortable"
                                    variant="outlined" hide-details class="search-field" bg-color="white" />
                            </v-col>
                        </v-row>

                        <v-card class="mt-4 rounded-lg" elevation="1">
                            <v-data-table :headers="headers" :items="filteredOrders" :search="search"
                                :items-per-page="10" density="comfortable" class="elevation-0" hover>
                                <template v-slot:item.created_at="{ item }">
                                    {{ formatDateTime(item.created_at) }}
                                </template>
                                <template v-slot:item.order_code="{ item }">
                                    <span class="text-primary font-weight-medium cursor-pointer"
                                        @click="showOrderDetail(item)">
                                        {{ item.order_code }}
                                    </span>
                                </template>
                                <template v-slot:item.final_price="{ item }">
                                    <span class="font-weight-medium text-success">
                                        {{ formatPrice(item.final_price) }} VNĐ
                                    </span>
                                </template>
                                <template v-slot:item.status="{ item }">
                                    <v-chip :color="getStatusColor(item.status)" size="small" class="font-weight-medium"
                                        :class="{ 'text-white': item.status === '3' }">
                                        <v-icon start size="small"
                                            :icon="item.status === '3' ? 'mdi-check-circle' : 'mdi-close-circle'" />
                                        {{ getStatusText(item.status) }}
                                    </v-chip>
                                </template>
                            </v-data-table>
                        </v-card>
                    </v-container>
                </v-card>
            </v-col>
        </v-row>

        <OrderDetailDialog v-model="showDetailDialog" :order-detail="selectedOrder" />
    </v-container>
</template>

<script>
import { formatDateTime } from '@/utils/format';
import logoImage from '@/assets/logo-admin.png'
import { formatPrice } from '@/utils/format';
import { orderAPI } from "@/api/order";
import OrderDetailDialog from '@/components/Orders/OrderDetailDialog.vue'

export default {
    name: "PaymentHistoryPage",
    components: {
        OrderDetailDialog
    },
    data() {
        return {
            logo: logoImage,
            mydate: new Date().toISOString().slice(0, 10),
            search: '',
            headers: [
                { title: 'THỜI GIAN', key: 'created_at', width: '10%' },
                { title: 'Mã ĐƠN', key: 'order_code', width: '15%' },
                { title: 'SỐ TIỀN', key: 'final_price', width: '15%' },
                { title: 'TÊN KHÁCH HÀNG', key: 'user_name', width: '20%' },
                { title: 'ĐỊA CHỈ', key: 'address', width: '30%' },
                { title: 'TRẠNG THÁI', key: 'status', width: '30%' },
            ],
            contents: [],
            showDetailDialog: false,
            selectedOrder: null
        }
    },
    computed: {
        filteredOrders() {
            return this.contents.filter(item => item.created_at.slice(0, 10) === this.mydate)
                .map(item => ({
                    ...item,
                }));
        },

        saleTotal() {
            return this.formatPrice(
                this.filteredOrders.reduce((total, item) =>
                    total + parseInt(item.final_price), 0)
            );
        },

        countOrders() {
            return this.filteredOrders.length;
        },
    },

    created() {
        this.getOrders();
    },

    methods: {
        formatDateTime,
        formatPrice,
        //lấy danh sách các đơn hàng thành công
        async getOrders() {
            try {
                const response = await orderAPI.getSuccessOrders();
                this.contents = response.data.orders;
                console.log("Sucess: ", response.data);
            } catch (error) {
                console.log("Start\n");
                console.log(error.response)
                console.log("END\n");
            }
        },

        showOrderDetail(order) {
            this.selectedOrder = order;
            this.showDetailDialog = true;
        },

        getStatusColor(status) {
            return status === '3' ? 'success' : 'error';
        },

        getStatusText(status) {
            return status === '3' ? 'Thành công' : 'Đã Hủy';
        },

        formatTime(timeString) {
            if (!timeString) return '';

            try {
                // Xử lý chuỗi thời gian ISO
                const date = new Date(timeString);

                // Lấy giờ và phút
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');

                // Định dạng ngày
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');

                // Trả về định dạng "DD/MM HH:MM"
                return `${day}/${month} ${hours}:${minutes}`;
            } catch (error) {
                console.error('Lỗi định dạng thời gian:', error);
                return timeString;
            }
        },
    }
};
</script>

<style scoped>
.date-picker-custom {
    max-width: 250px;
}

.search-field {
    max-width: 400px;
}

.cursor-pointer {
    cursor: pointer;
}

/* Thêm hiệu ứng hover cho các card */
.v-card {
    transition: transform 0.2s ease-in-out;
}

.v-card:hover {
    transform: translateY(-2px);
}

/* Custom style cho data table */
:deep(.v-data-table) {
    border-radius: 8px;
}

:deep(.v-data-table-header th) {
    font-weight: 600 !important;
    color: rgba(0, 0, 0, 0.87) !important;
    background-color: #f5f5f5 !important;
}

:deep(.v-data-table-row:hover) {
    background-color: #f5f5f5 !important;
}

/* Style cho chip status */
:deep(.v-chip) {
    font-weight: 500;
    letter-spacing: 0.5px;
}
</style>