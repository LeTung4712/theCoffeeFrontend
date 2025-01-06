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
import { orderAPI } from "@/api/order";

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
            totalRevenue: 0,
            revenueGrowth: 0,
            totalOrders: 0,
            orderGrowth: 0,
            newCustomers: 0,
            customerGrowth: 0,
            completionRate: 0,
            topProducts: [
                {
                    id: 1,
                    name: "",
                    image_url: "",
                    soldCount: 0,
                    revenue: 0
                },
                // Thêm các sản phẩm khác
            ],
            revenueChart: null,
            orderStatusChart: null,
            paymentMethodChart: null,
        }
    },

    setup() {
        const notificationStore = useNotificationStore();
        return { notificationStore }
    },

    mounted() {
        //this.initCharts()
    },

    methods: {
        formattedPrice(price) {
            return formatPrice(price);
        },

        async updateData() {
            this.isLoading = true;
            try {
                const res = await orderAPI.getAnalyzeOrders({ timeRange: this.timeRange });
                console.log(res);
                this.totalRevenue = res.data.totalRevenue;
                this.revenueGrowth = res.data.revenueGrowth;
                this.totalOrders = res.data.totalOrders;
                this.orderGrowth = res.data.orderGrowth;
                this.newCustomers = res.data.newCustomers;
                this.customerGrowth = res.data.customerGrowth;
                this.completionRate = res.data.completionRate;
                this.topProducts = res.data.topProducts;
                this.initCharts(res.data);
                this.notificationStore.success('Cập nhật dữ liệu thành công', 3000);
            } catch (error) {
                console.log(error);
            } finally {
                this.isLoading = false;
            }
        },

        initCharts(data) {
            // Hủy biểu đồ cũ nếu đã tồn tại
            if (this.revenueChart) {
                this.revenueChart.destroy();
            }
            if (this.orderStatusChart) {
                this.orderStatusChart.destroy();
            }
            if (this.paymentMethodChart) {
                this.paymentMethodChart.destroy();
            }

            // Tạo biểu đồ doanh thu
            this.revenueChart = new Chart(this.$refs.revenueChart, {
                type: 'line',
                data: {
                    labels: data.revenueByTimeRange.labels,
                    datasets: [
                        {
                            label: 'Chi phí',
                            data: data.revenueByTimeRange.costData,
                            borderColor: '#1976D2',
                            tension: 0.1
                        },
                        {
                            label: 'Doanh thu',
                            data: data.revenueByTimeRange.revenueData,
                            borderColor: '#4CAF50',
                            tension: 0.1
                        },
                        {
                            label: 'Lợi nhuận',
                            data: data.revenueByTimeRange.profitData,
                            borderColor: '#FF5722',
                            tension: 0.1
                        }
                    ]
                }
            });

            // Tạo biểu đồ trạng thái đơn hàng
            this.orderStatusChart = new Chart(this.$refs.orderStatusChart, {
                type: 'doughnut',
                data: {
                    labels: ['Hoàn thành', 'Đang xử lý', 'Đã hủy'],
                    datasets: [{
                        data: [data.orderStatusByTimeRange.completed, data.orderStatusByTimeRange.pending, data.orderStatusByTimeRange.canceled],
                        backgroundColor: ['#4CAF50', '#2196F3', '#F44336']
                    }]
                }
            });

            // Tạo biểu đồ phương thức thanh toán
            this.paymentMethodChart = new Chart(this.$refs.paymentMethodChart, {
                type: 'pie',
                data: {
                    labels: ['COD', 'MoMo', 'Zalopay', 'VNPay'],
                    datasets: [{
                        data: [data.paymentMethodByTimeRange.COD, data.paymentMethodByTimeRange.MoMo, data.paymentMethodByTimeRange.Zalopay, data.paymentMethodByTimeRange.VNPay],
                        backgroundColor: ['#FFC107', '#9C27B0', '#00BCD4', '#FF5722']
                    }]
                }
            });
        },

        async analyzeShoppingBehavior() {
            this.isAnalyzing = true;
            try {
                const response = await axios.post('/api/analyze/shopping-behavior', {
                    algorithm: this.selectedAlgorithm,
                    minSupport: this.minSupport,
                    minConfidence: this.minConfidence,
                    timeRange: this.timeRange
                });

                this.associationRules = response.data.rules;
                this.totalRules = response.data.totalRules;
                this.executionTime = response.data.executionTime;

                this.notificationStore.success('Phân tích hành vi mua sắm thành công');
            } catch (error) {
                console.error('Error analyzing shopping behavior:', error);
                this.notificationStore.error('Có lỗi xảy ra khi phân tích hành vi mua sắm');
            } finally {
                this.isAnalyzing = false;
            }
        }
    }
}
</script>

<style scoped>
.v-card {
    height: 100%;
}
</style>
