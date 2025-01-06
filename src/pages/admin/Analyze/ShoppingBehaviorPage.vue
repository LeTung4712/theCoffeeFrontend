<template>
    <v-container fluid>
        <!-- Phân tích hành vi mua sắm -->
        <v-row>
            <v-col cols="12">
                <h1>Phân tích hành vi mua sắm</h1>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" sm="6" md="3">
                <v-select v-model="selectedAlgorithm" :items="algorithms" label="Thuật toán" density="comfortable"
                    variant="outlined"></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-select v-model="timeRange" :items="timeRanges" label="Khoảng thời gian" density="comfortable"
                    variant="outlined"></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-btn color="primary" class="ml-4" @click="analyzeShoppingBehavior" :loading="isLoading">
                    Phân tích
                </v-btn>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="6">
                <!-- Cấu hình thuật toán -->
                <v-card variant="outlined">
                    <v-card-title class="d-flex align-center">
                        Cấu hình thuật toán
                        <v-tooltip location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" class="ml-2" size="small">mdi-help-circle-outline</v-icon>
                            </template>
                            <span class="text-subtitle-2">
                                Support: Tỉ lệ xuất hiện của tập sản phẩm trong tổng số giao dịch<br>
                                Confidence: Độ tin cậy của luật kết hợp
                            </span>
                        </v-tooltip>
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                                <div class="slider-container">
                                    <div class="slider-label">Ngưỡng support tối thiểu</div>
                                    <v-slider v-model="minSupport" min="0.1" max="1" step="0.01" thumb-label
                                        color="blue" class="slider-input" hide-details></v-slider>
                                </div>
                            </v-col>
                            <v-col cols="12">
                                <div class="slider-container">
                                    <div class="slider-label">Ngưỡng confidence tối thiểu</div>
                                    <v-slider v-model="minConfidence" min="0.1" max="1" step="0.01" thumb-label
                                        color="green" class="slider-input" hide-details></v-slider>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <!-- Thống kê kết quả -->
                <v-card variant="outlined">
                    <v-card-title>Thống kê kết quả</v-card-title>
                    <v-card-text>
                        <div class="text-subtitle-1">Tổng số giao dịch: {{ totalTransactions }}</div>
                        <div class="text-subtitle-1">Tổng số luật kết hợp: {{ totalRules }}</div>
                        <div class="text-subtitle-1">Thời gian thực thi: {{ executionTime }}ms</div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Bảng kết quả -->
        <v-card class="mt-4" variant="outlined">
            <v-card-item>
                <div class="d-flex align-center justify-space-between">
                    <div>
                        <v-card-title class="text-primary font-weight-bold pb-1">
                            <v-icon start icon="mdi-chart-timeline-variant" class="mr-2"></v-icon>
                            Kết quả phân tích
                        </v-card-title>
                        <v-card-subtitle class="text-black">
                            Thống kê vào lúc {{ formatDate(time_analyze) }}
                        </v-card-subtitle>
                    </div>
                    <div class="d-flex align-center">
                        <v-chip class="mr-2" color="primary" variant="outlined" prepend-icon="mdi-database">
                            Tổng số luật: {{ totalRules2 }}
                        </v-chip>
                    </div>
                </div>
            </v-card-item>

            <v-divider></v-divider>

            <v-card-text>
                <v-data-table :headers="headers" :items="formattedRules" class="elevation-0">
                    <template v-slot:item.index="{ item, index }">
                        {{ index + 1 }}
                    </template>
                    <template v-slot:item.antecedent="{ item }">
                        <v-chip v-for="product in item.antecedent_products" :key="product.id" class="ma-1"
                            color="primary" size="small">
                            {{ product.name }}
                        </v-chip>
                    </template>
                    <template v-slot:item.consequent="{ item }">
                        <v-chip v-for="product in item.consequent_products" :key="product.id" class="ma-1"
                            color="success" size="small">
                            {{ product.name }}
                        </v-chip>
                    </template>
                    <template v-slot:item.confidence="{ item }">
                        {{ (Number(item.confidence) * 100).toFixed(1) }}%
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

    </v-container>
</template>

<script>
import { formatPrice } from "@/utils/format";
import { useNotificationStore } from "@/stores/notification";
import { recommendAPI } from "@/api/recommend";
export default {
    name: 'ShoppingBehaviorPage',

    setup() {
        const notificationStore = useNotificationStore();
        return { notificationStore }
    },

    data() {
        return {
            isLoading: false,
            selectedAlgorithm: 'apriori',
            algorithms: [
                { title: 'Thuật toán Apriori', value: 'apriori' },
                { title: 'Thuật toán FP-Growth', value: 'fp_growth' }
            ],
            timeRange: 'week',
            timeRanges: [
                { title: '7 ngày qua', value: 'week' },
                { title: '30 ngày qua', value: 'month' },
                { title: '90 ngày qua', value: 'quarter' },
                { title: '365 ngày qua', value: 'year' },
            ],
            headers: [
                { title: 'STT', key: 'index', align: 'center', width: '80px' },
                { title: 'Sản phẩm gốc', key: 'antecedent', align: 'start' },
                { title: 'Sản phẩm gợi ý', key: 'consequent', align: 'start' },
                { title: 'Độ tin cậy', key: 'confidence', align: 'center', width: '120px' }
            ],
            minSupport: 0.1,
            minConfidence: 0.5,
            totalTransactions: 0,
            totalRules: 0,
            totalRules2: 0,
            executionTime: 0,
            time_analyze: null,
            associationRules: [
                {
                    antecedent: ['A', 'B'],
                    consequent: ['C'],
                    confidence: 0.8
                }
            ]
        }
    },

    computed: {
        formattedRules() {
            return this.associationRules.map(rule => ({
                antecedent_products: rule.antecedent_products || [],
                consequent_products: rule.consequent_products || [],
                confidence: rule.confidence
            }));
        }
    },

    created() {
        this.getAssociationRules()
    },

    methods: {
        formattedPrice(price) {
            return formatPrice(price);
        },

        async getAssociationRules() {
            this.isLoading = true;
            try {
                const response = await recommendAPI.getAssociationRules();
                if (response.data) {
                    this.associationRules = response.data.associationRules;
                    this.time_analyze = response.data.associationRules.updated_at;
                    this.totalRules2 = this.associationRules.length;
                }
            } catch (error) {
                console.error('Error getting association rules:', error);
            } finally {
                this.isLoading = false;
            }
        },

        async analyzeShoppingBehavior() {
            this.isLoading = true;
            try {
                const response = await recommendAPI.analyzeShoppingBehavior({
                    algorithm: this.selectedAlgorithm,
                    minSupport: this.minSupport,
                    minConfidence: this.minConfidence,
                    timeRange: this.timeRange
                });

                if (response.data) {
                    this.associationRules = response.data.associationRules;
                    this.totalRules = response.data.associationRules.length;
                    this.totalRules2 = response.data.associationRules.length;
                    this.totalTransactions = response.data.totalTransactions;
                    this.executionTime = response.data.executionTime;
                    this.time_analyze = new Date();
                    this.notificationStore.success('Phân tích hành vi mua sắm thành công', 3000);
                }
            } catch (error) {
                console.error('Error analyzing shopping behavior:', error);
                this.notificationStore.error('Có lỗi xảy ra khi phân tích hành vi mua sắm', 3000);
            } finally {
                this.isLoading = false;
            }
        },

        formatDate(date) {
            return new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        }
    }
}
</script>

<style>
.slider-container {
    display: flex;
    align-items: center;
    gap: 16px;
    height: 48px;
}

.slider-label {
    min-width: 180px;
    display: flex;
    align-items: center;
}

.slider-input {
    flex: 1;
    margin-top: 0;
    padding-top: 0;
}

.v-slider-thumb__label {
    background-color: #757575 !important;
}

.text-subtitle-2 {
    color: #e70c0c !important;
}
</style>
