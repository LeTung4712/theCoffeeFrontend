<template>
    <v-container fluid class="delivery-order-container">
        <v-card class="mx-auto rounded-lg" elevation="2">
            <!-- Header Section -->
            <div class="header-gradient pa-6">
                <v-row align="center" class="mb-4">
                    <v-col cols="12" class="d-flex align-center">
                        <v-icon icon="mdi-truck-delivery" size="32" color="white" class="mr-3"></v-icon>
                        <h1 class="text-h4 font-weight-bold text-white mb-0">ĐƠN HÀNG ĐANG GIAO</h1>
                    </v-col>
                </v-row>

                <!-- Stats and Search Section -->
                <v-row>
                    <!-- Order Counter -->
                    <v-col cols="12" md="6">
                        <v-card class="stats-card pa-4 rounded-lg" elevation="4">
                            <div class="d-flex align-center">
                                <v-icon icon="mdi-truck-fast" size="24" color="info" class="mr-3"></v-icon>
                                <div>
                                    <div class="text-subtitle-1 text-grey-darken-1">TỔNG SỐ ĐƠN ĐANG GIAO</div>
                                    <div class="text-h4 font-weight-bold info--text mt-1">
                                        <v-skeleton-loader v-if="loading" type="text" width="50"></v-skeleton-loader>
                                        <template v-else>{{ delivery_orders.length }}</template>
                                    </div>
                                </div>
                            </div>
                        </v-card>
                    </v-col>

                    <!-- Search Bar -->
                    <v-col cols="12" md="6" class="d-flex align-center">
                        <v-text-field v-model="search" prepend-inner-icon="mdi-magnify"
                            label="Tìm kiếm theo mã đơn hàng" density="comfortable" variant="outlined" hide-details
                            class="search-field" :disabled="loading" bg-color="white"></v-text-field>
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
                    <template v-slot:item.created_at="{ item }">
                        <div class="d-flex align-center">
                            {{ formatDateTime(item.created_at) }}
                        </div>
                    </template>
                    <template v-slot:item.status="{ item }">
                        <v-chip :color="getStatusColor(item.status)" size="small" class="status-chip"
                            :class="getStatusClass(item.status)">
                            {{ getStatusText(item.status) }}
                        </v-chip>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
        <OrderDetailDialog v-model="showDetailDialog" :order-detail="selectedOrder" />
    </v-container>
</template>

<script>
import { orderAPI } from "@/api/order";
import { formatDateTime } from "@/utils/format";
import OrderDetailDialog from '@/components/Orders/OrderDetailDialog.vue'

export default {
    name: "DeliveryOrderPage",
    components: {
        OrderDetailDialog
    },
    data() {
        return {
            loading: true,
            search: '',
            headers: [
                { title: 'STT', key: 'number', align: 'center', width: '5%' },
                { title: 'MÃ ĐƠN', key: 'order_code', align: 'center', width: '15%' },
                { title: 'Thời gian', key: 'created_at', align: 'center', width: '10%' },
                { title: 'SỐ ĐIỆN THOẠI', key: 'mobile_no', align: 'center', width: '15%' },
                { title: 'ĐỊA CHỈ', key: 'address', align: 'center', width: '35%' },
                { title: 'TRẠNG THÁI', key: 'status', align: 'center', width: '10%' },
            ],
            delivery_orders: [],
            showDetailDialog: false,
            selectedOrder: null,
        }
    },

    computed: {
        tableItems() {
            return this.delivery_orders.map((order, index) => ({
                ...order,
                number: index + 1
            }));
        }
    },

    created() {
        this.fetchDeliveryOrders();
    },

    methods: {
        formatDateTime,

        async fetchDeliveryOrders() {
            try {
                const { data } = await orderAPI.getDeliveryOrders();
                this.delivery_orders = data.orders;
            } catch (error) {
                console.error('Error fetching delivery orders:', error);
            } finally {
                this.loading = false;
            }
        },

        getStatusColor(status) {
            const statusColors = {
                '2': 'info',    // Đang giao hàng
                '3': 'success', // Giao thành công
                '4': 'error'    // Giao thất bại
            };
            return statusColors[status] || 'grey';
        },

        getStatusText(status) {
            const statusTexts = {
                '2': 'ĐANG GIAO HÀNG',
                '3': 'GIAO THÀNH CÔNG',
                '4': 'GIAO THẤT BẠI'
            };
            return statusTexts[status] || 'KHÔNG XÁC ĐỊNH';
        },

        getStatusIcon(status) {
            const icons = {
                '2': 'mdi-truck-delivery',
                '3': 'mdi-check-circle',
                '4': 'mdi-alert-circle'
            };
            return icons[status] || 'mdi-help-circle';
        },

        getStatusClass(status) {
            const classes = {
                '2': 'delivering-chip',
                '3': 'success-chip',
                '4': 'error-chip'
            };
            return classes[status] || '';
        },

        callCustomer(phoneNumber) {
            window.location.href = `tel:${phoneNumber}`;
        },

        navigateToDetails(orderCode) {
            const order = this.delivery_orders.find(o => o.order_code === orderCode);
            if (order) {
                this.selectedOrder = order;
                this.showDetailDialog = true;
            }
        },
    },
};
</script>

<style scoped>
.delivery-order-container {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding: 24px;
}

.header-gradient {
    background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
    border-radius: 8px 8px 0 0;
}

.stats-card {
    background: white;
    transition: transform 0.2s;
}

.stats-card:hover {
    transform: translateY(-2px);
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

.delivering-chip {
    background-color: #2196F3 !important;
    color: white !important;
    animation: pulse 2s infinite;
}

.success-chip {
    background-color: #4CAF50 !important;
    color: white !important;
}

.error-chip {
    background-color: #F44336 !important;
    color: white !important;
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.4);
    }

    70% {
        box-shadow: 0 0 0 6px rgba(33, 150, 243, 0);
    }

    100% {
        box-shadow: 0 0 0 0 rgba(33, 150, 243, 0);
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
