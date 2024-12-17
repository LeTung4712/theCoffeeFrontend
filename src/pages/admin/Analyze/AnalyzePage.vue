<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <h1>Thống kê</h1>
            </v-col>
        </v-row>
        <!-- Thời gian filter -->
        <v-row>
            <v-col cols="12" sm="6" md="3">
                <v-select v-model="timeRange" :items="timeRanges" label="Khoảng thời gian" variant="outlined"
                    density="comfortable"></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-btn color="primary" @click="updateData" prepend-icon="mdi-refresh" :loading="isLoading">
                    Cập nhật dữ liệu
                </v-btn>
            </v-col>
        </v-row>

        <!-- Thống kê tổng quan -->
        <v-row>
            <v-col cols="12" sm="6" md="3">
                <v-card>
                    <v-card-text>
                        <div class="text-subtitle-1 mb-2">Tổng doanh thu</div>
                        <div class="text-h5 primary--text">{{ formattedPrice(totalRevenue) }}</div>
                        <v-chip :color="revenueGrowth >= 0 ? 'success' : 'error'" size="small" class="mt-2">
                            {{ revenueGrowth >= 0 ? '+' : '' }}{{ revenueGrowth }}%
                        </v-chip>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
                <v-card>
                    <v-card-text>
                        <div class="text-subtitle-1 mb-2">Tổng đơn hàng</div>
                        <div class="text-h5">{{ totalOrders }}</div>
                        <v-chip :color="orderGrowth >= 0 ? 'success' : 'error'" size="small" class="mt-2">
                            {{ orderGrowth >= 0 ? '+' : '' }}{{ orderGrowth }}%
                        </v-chip>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
                <v-card>
                    <v-card-text>
                        <div class="text-subtitle-1 mb-2">Khách hàng mới</div>
                        <div class="text-h5">{{ newCustomers }}</div>
                        <v-chip :color="customerGrowth >= 0 ? 'success' : 'error'" size="small" class="mt-2">
                            {{ customerGrowth >= 0 ? '+' : '' }}{{ customerGrowth }}%
                        </v-chip>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
                <v-card>
                    <v-card-text>
                        <div class="text-subtitle-1 mb-2">Tỷ lệ hoàn thành</div>
                        <div class="text-h5">{{ completionRate }}%</div>
                        <v-progress-linear :model-value="completionRate" color="success" height="8"
                            class="mt-2"></v-progress-linear>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Biểu đồ doanh thu -->
        <v-row>
            <v-col cols="12" md="8">
                <v-card>
                    <v-card-title>Biểu đồ doanh thu</v-card-title>
                    <v-card-text>
                        <canvas ref="revenueChart"></canvas>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card>
                    <v-card-title>Top sản phẩm bán chạy</v-card-title>
                    <v-list>
                        <v-list-item v-for="product in topProducts" :key="product.id">
                            <template v-slot:prepend>
                                <v-avatar size="40">
                                    <v-img :src="product.image_url"></v-img>
                                </v-avatar>
                            </template>
                            <v-list-item-title>{{ product.name }}</v-list-item-title>
                            <v-list-item-subtitle>
                                Đã bán: {{ product.soldCount }} | Doanh thu: {{ formattedPrice(product.revenue) }}
                            </v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>

        <!-- Phân tích đơn hàng -->
        <v-row>
            <v-col cols="12" md="6">
                <v-card>
                    <v-card-title>Trạng thái đơn hàng</v-card-title>
                    <v-card-text>
                        <canvas ref="orderStatusChart"></canvas>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <v-card>
                    <v-card-title>Phương thức thanh toán</v-card-title>
                    <v-card-text>
                        <canvas ref="paymentMethodChart"></canvas>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import Chart from 'chart.js/auto'
import { formatPrice } from "@/utils/format";
import { useNotificationStore } from "@/stores/notification";

export default {
    name: 'AnalyzePage',
    data() {
        return {
            isLoading: false,
            timeRange: 'week',
            timeRanges: [
                { title: '7 ngày qua', value: 'week' },
                { title: '30 ngày qua', value: 'month' },
                { title: '90 ngày qua', value: 'quarter' },
                { title: '365 ngày qua', value: 'year' },
            ],
            // Dữ liệu mẫu
            totalRevenue: 15000000,
            revenueGrowth: 12.5,
            totalOrders: 150,
            orderGrowth: 8.3,
            newCustomers: 45,
            customerGrowth: -2.1,
            completionRate: 95,
            topProducts: [
                {
                    id: 1,
                    name: "Sữa tươi bánh flan",
                    image_url: "https://product.hstatic.net/1000075078/product/1696220170_phin-sua-tuoi-banh-flan_0172beb85d08408b8912bf5f1dae7fd9_large.jpg",
                    soldCount: 50,
                    revenue: 5000000
                },
                // Thêm các sản phẩm khác
            ],
        }
    },

    setup() {
        const notificationStore = useNotificationStore();
        return { notificationStore }
    },

    mounted() {
        this.initCharts()
    },

    methods: {
        formattedPrice(price) {
            return formatPrice(price);
        },

        updateData() {
            // Gọi API để cập nhật dữ liệu
        },

        initCharts() {
            // Biểu đồ doanh thu
            new Chart(this.$refs.revenueChart, {
                type: 'line',
                data: {
                    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
                    datasets: [{
                        label: 'Doanh thu',
                        data: [1200000, 1900000, 1500000, 2100000, 1800000, 2500000, 2000000],
                        borderColor: '#1976D2',
                        tension: 0.1
                    }]
                }
            })

            // Biểu đồ trạng thái đơn hàng
            new Chart(this.$refs.orderStatusChart, {
                type: 'doughnut',
                data: {
                    labels: ['Hoàn thành', 'Đang giao', 'Đã hủy'],
                    datasets: [{
                        data: [70, 25, 5],
                        backgroundColor: ['#4CAF50', '#2196F3', '#F44336']
                    }]
                }
            })

            // Biểu đồ phương thức thanh toán
            new Chart(this.$refs.paymentMethodChart, {
                type: 'pie',
                data: {
                    labels: ['Tiền mặt', 'Thẻ', 'Ví điện tử'],
                    datasets: [{
                        data: [45, 30, 25],
                        backgroundColor: ['#FFC107', '#9C27B0', '#00BCD4']
                    }]
                }
            })
        }
    }
}
</script>

<style scoped>
.v-card {
    height: 100%;
}
</style>
