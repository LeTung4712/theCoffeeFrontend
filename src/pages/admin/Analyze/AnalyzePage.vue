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
                <v-select v-model="analyzeStore.timeRange" :items="analyzeStore.timeRanges" label="Khoảng thời gian"
                    variant="outlined" density="comfortable"></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-btn color="primary" @click="updateData" prepend-icon="mdi-refresh" :loading="analyzeStore.isLoading">
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
                        <div class="text-h5 primary--text">{{ formattedPrice(analyzeStore.statistics.totalRevenue) }}
                        </div>
                        <v-chip :color="analyzeStore.statistics.revenueGrowth >= 0 ? 'success' : 'error'" size="small"
                            class="mt-2">
                            {{ analyzeStore.statistics.revenueGrowth >= 0 ? '+' : '' }}{{
                                analyzeStore.statistics.revenueGrowth }}%
                        </v-chip>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
                <v-card>
                    <v-card-text>
                        <div class="text-subtitle-1 mb-2">Tổng đơn hàng</div>
                        <div class="text-h5">{{ analyzeStore.statistics.totalOrders }}</div>
                        <v-chip :color="analyzeStore.statistics.orderGrowth >= 0 ? 'success' : 'error'" size="small"
                            class="mt-2">
                            {{ analyzeStore.statistics.orderGrowth >= 0 ? '+' : '' }}{{
                                analyzeStore.statistics.orderGrowth }}%
                        </v-chip>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
                <v-card>
                    <v-card-text>
                        <div class="text-subtitle-1 mb-2">Khách hàng mới</div>
                        <div class="text-h5">{{ analyzeStore.statistics.newCustomers }}</div>
                        <v-chip :color="analyzeStore.statistics.customerGrowth >= 0 ? 'success' : 'error'" size="small"
                            class="mt-2">
                            {{ analyzeStore.statistics.customerGrowth >= 0 ? '+' : '' }}{{
                                analyzeStore.statistics.customerGrowth }}%
                        </v-chip>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
                <v-card>
                    <v-card-text>
                        <div class="text-subtitle-1 mb-2">Tỷ lệ hoàn thành</div>
                        <div class="text-h5">{{ analyzeStore.statistics.completionRate }}%</div>
                        <v-progress-linear :model-value="analyzeStore.statistics.completionRate" color="success"
                            height="8" class="mt-2"></v-progress-linear>
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
                        <v-list-item v-for="product in analyzeStore.topProducts" :key="product.id">
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
import { useAnalyzeStore } from '@/stores/analyze'
import { adminAPI } from "@/api/admin"

export default {
    name: 'AnalyzePage',

    setup() {
        const analyzeStore = useAnalyzeStore()
        return { analyzeStore }
    },

    data() {
        return {
            revenueChart: null,
            orderStatusChart: null,
            paymentMethodChart: null,
        }
    },

    mounted() {
        this.updateData()
    },

    methods: {
        formattedPrice(price) {
            return formatPrice(price)
        },

        async updateData() {
            this.analyzeStore.isLoading = true
            try {
                const res = await adminAPI.order.AnalyzeOrders({ timeRange: this.analyzeStore.timeRange })
                this.analyzeStore.setStatistics(res.data)
                this.analyzeStore.setTopProducts(res.data.topProducts)
                this.analyzeStore.setChartData(res.data)
                this.initCharts()
            } catch (error) {
                console.error('Error fetching analytics:', error)
            } finally {
                this.analyzeStore.isLoading = false
            }
        },

        initCharts() {
            // Hủy biểu đồ cũ nếu đã tồn tại
            if (this.revenueChart) this.revenueChart.destroy()
            if (this.orderStatusChart) this.orderStatusChart.destroy()
            if (this.paymentMethodChart) this.paymentMethodChart.destroy()

            // Khởi tạo biểu đồ doanh thu
            const revenueCtx = this.$refs.revenueChart?.getContext('2d')
            if (revenueCtx) {
                this.revenueChart = new Chart(revenueCtx, {
                    type: 'line',
                    data: this.analyzeStore.getRevenueChartData,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                })
            }

            // Khởi tạo biểu đồ trạng thái đơn hàng
            const orderStatusCtx = this.$refs.orderStatusChart?.getContext('2d')
            if (orderStatusCtx) {
                this.orderStatusChart = new Chart(orderStatusCtx, {
                    type: 'doughnut',
                    data: this.analyzeStore.getOrderStatusData,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                })
            }

            // Khởi tạo biểu đồ phương thức thanh toán
            const paymentMethodCtx = this.$refs.paymentMethodChart?.getContext('2d')
            if (paymentMethodCtx) {
                this.paymentMethodChart = new Chart(paymentMethodCtx, {
                    type: 'pie',
                    data: this.analyzeStore.getPaymentMethodData,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                })
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
