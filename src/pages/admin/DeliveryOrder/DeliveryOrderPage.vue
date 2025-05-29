<template>
    <v-container fluid class="pa-0">
        <!-- Header Section -->
        <v-row class="bg-white">
            <v-col cols="12">
                <v-row justify="center" class="pa-4">
                    <h2>Đơn Hàng Đang Giao</h2>
                </v-row>
            </v-col>

            <!-- Order Counter and Search Bar Row -->
            <v-col cols="12">
                <v-row>
                    <!-- Order Counter -->
                    <v-col cols="12" sm="6">
                        <v-card flat class="text-center pa-4">
                            <div class="text-grey-darken-2 text-body-1 mb-2">
                                TỔNG SỐ ĐƠN HÀNG ĐANG GIAO
                            </div>
                            <div class="text-h5 font-weight-medium">
                                <v-skeleton-loader v-if="loading" type="text" width="50"></v-skeleton-loader>
                                <template v-else>{{ delivery_orders.length }}</template>
                            </div>
                        </v-card>
                    </v-col>

                    <!-- Search Bar -->
                    <v-col cols="12" sm="6" class="d-flex align-center">
                        <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Nhập mã đơn hàng"
                            density="compact" variant="outlined" hide-details class="max-width-300"
                            :disabled="loading"></v-text-field>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <!-- Data Table -->
        <v-row class="mt-4">
            <v-col cols="12">
                <v-skeleton-loader v-if="loading" type="table"></v-skeleton-loader>
                <v-data-table v-else :headers="headers" :items="tableItems" :search="search" :items-per-page="5" hover
                    class="elevation-1">
                    <template v-slot:item.order_code="{ item }">
                        <div class="text-primary text-decoration-underline cursor-pointer"
                            @click="navigateToDetails(item.order_code)">
                            {{ item.order_code }}
                        </div>
                    </template>
                    <template v-slot:item.created_at="{ item }">
                        {{ formatDateTime(item.created_at) }}
                    </template>
                    <template v-slot:item.status="{ item }">
                        <v-chip :color="getStatusColor(item.status)" size="small">
                            {{ getStatusText(item.status) }}
                        </v-chip>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { orderAPI } from "@/api/order";
import { formatDateTime } from "@/utils/format";

export default {
    name: "DeliveryOrderPage",

    data() {
        return {
            loading: true,
            search: '',
            headers: [
                { title: 'STT', key: 'number', align: 'center', width: '10%' },
                { title: 'MÃ ĐƠN', key: 'order_code', align: 'center', width: '15%' },
                { title: 'Thời gian', key: 'created_at', align: 'center', width: '20%' },
                { title: 'SỐ ĐIỆN THOẠI', key: 'mobile_no', align: 'center', width: '15%' },
                { title: 'ĐỊA CHỈ', key: 'address', align: 'center', width: '25%' },
                { title: 'TRẠNG THÁI', key: 'status', align: 'center', width: '15%' },
            ],
            delivery_orders: [],
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
                const { data } = await orderAPI.getDeliveryOrders(); // Giả sử có API này
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
            };
            return statusColors[status] || 'grey';
        },

        getStatusText(status) {
            const statusTexts = {
                '2': 'ĐANG GIAO HÀNG',
            };
            return statusTexts[status] || 'KHÔNG XÁC ĐỊNH';
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
.cursor-pointer {
    cursor: pointer;
}

.max-width-300 {
    max-width: 300px;
}
</style>
