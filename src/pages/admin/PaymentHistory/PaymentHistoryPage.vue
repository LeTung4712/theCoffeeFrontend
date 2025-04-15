<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <!-- Header section -->
                    <v-row class="pa-4">
                        <v-col cols="12" sm="6">
                            <v-row>
                                <v-col cols="auto">
                                    <v-avatar size="120" rounded>
                                        <v-img :src=logo cover alt="logo" />
                                    </v-avatar>
                                </v-col>
                                <v-col>
                                    <h4 class="text-h5 font-weight-medium">THE COFFEE PAYMENT</h4>
                                    <div class="text-subtitle-1 text-medium-emphasis">The CoffeeShop Bách Khoa</div>
                                </v-col>
                            </v-row>
                        </v-col>

                        <!-- Stats section -->
                        <v-col cols="12" sm="6">
                            <v-row>
                                <v-col cols="12" sm="6">
                                    <v-card-text class="text-center">
                                        <div class="text-medium-emphasis mb-2">TỔNG TIỀN GD TRONG NGÀY</div>
                                        <div class="text-h5">{{ saleTotal }}VNĐ</div>
                                    </v-card-text>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-card-text class="text-center">
                                        <div class="text-medium-emphasis mb-2">TỔNG SỐ GD TRONG NGÀY</div>
                                        <div class="text-h5">{{ countOrders }}</div>
                                    </v-card-text>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-card-text>
                                        <div class="text-medium-emphasis">NGÀY {{ mydate }}</div>
                                        <v-text-field v-model="mydate" type="date" density="compact" variant="outlined"
                                            hide-details />
                                    </v-card-text>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>

                    <!-- Search and Table section -->
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Nhập mã đơn hàng"
                                    single-line density="compact" variant="outlined" hide-details class="mb-4" />
                            </v-col>
                        </v-row>

                        <v-data-table :headers="headers" :items="filteredOrders" :search="search" :items-per-page="10"
                            density="comfortable">
                            <template v-slot:item.order_code="{ item }">
                                <span class="text-primary cursor-pointer" style="cursor: pointer;"
                                    @click="openOrderDetail(item)">
                                    {{ item.order_code }}
                                </span>
                            </template>
                            <template v-slot:item.final_price="{ item }">
                                {{ formattedPrice(item.final_price) }}
                            </template>
                            <template v-slot:item.status="{ item }">
                                <v-chip :color="getStatusColor(item.status)" size="small">
                                    {{ getStatusText(item.status) }}
                                </v-chip>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <PaymentDetailDialog v-model="showDialog" :order-detail="selectedOrder" />
    </v-container>
</template>

<script>
import logoImage from '@/assets/logo.jpg'
import { formatPrice } from '@/utils/format';
import { orderAPI } from "@/api/order";
import PaymentDetailDialog from './PaymentDetailDialog.vue'

export default {
    name: "PaymentHistoryPage",
    components: {
        PaymentDetailDialog
    },
    data() {
        return {
            logo: logoImage,
            mydate: new Date().toISOString().slice(0, 10),
            search: '',
            headers: [
                { title: 'THỜI GIAN', key: 'formatted_time', width: '15%' },
                { title: 'Mã ĐƠN', key: 'order_code', width: '15%' },
                { title: 'SỐ TIỀN', key: 'final_price', width: '10%' },
                { title: 'TÊN KHÁCH HÀNG', key: 'user_name', width: '20%' },
                { title: 'ĐỊA CHỈ', key: 'address', width: '30%' },
                { title: 'TRẠNG THÁI', key: 'status', width: '30%' },
            ],
            contents: [],
            showDialog: false,
            selectedOrder: null
        }
    },
    computed: {
        filteredOrders() {
            return this.contents.filter(item => item.created_at.slice(0, 10) === this.mydate)
                .map(item => ({
                    ...item,
                    formatted_time: this.formatTime(item.created_at)
                }));
        },

        saleTotal() {
            return this.formattedPrice(
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
        formattedPrice(price) {
            return formatPrice(price);
        },
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

        openOrderDetail(item) {
            this.selectedOrder = item;
            this.showDialog = true;
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