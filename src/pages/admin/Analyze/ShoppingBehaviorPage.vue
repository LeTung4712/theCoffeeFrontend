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
                <v-btn color="primary" class="ml-4" @click="analyzeShoppingBehavior" :loading="isAnalyzing">
                    Phân tích
                </v-btn>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="6">
                <!-- Cấu hình thuật toán -->
                <v-card variant="outlined">
                    <v-card-title>Cấu hình thuật toán</v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                                <div class="slider-container">
                                    <div class="slider-label">Ngưỡng support tối thiểu</div>
                                    <v-slider v-model="minSupport" min="0" max="1" step="0.01" thumb-label color="blue"
                                        class="slider-input" hide-details></v-slider>
                                </div>
                            </v-col>
                            <v-col cols="12">
                                <div class="slider-container">
                                    <div class="slider-label">Ngưỡng confidence tối thiểu</div>
                                    <v-slider v-model="minConfidence" min="0" max="1" step="0.01" thumb-label
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
                        <div class="text-subtitle-1">Tổng số luật kết hợp: {{ totalRules }}</div>
                        <div class="text-subtitle-1">Thời gian thực thi: {{ executionTime }}ms</div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Bảng kết quả -->
        <v-data-table :headers="headers" :items="associationRules" class="elevation-1">
            <template v-slot:item.index="{ item, index }">
                {{ index + 1 }}
            </template>
            <template v-slot:item.antecedent="{ item: row }">
                <v-chip v-for="item in row.antecedent" :key="item" class="ma-1" color="primary" size="small">
                    {{ item }}
                </v-chip>
            </template>
            <template v-slot:item.consequent="{ item: row }">
                <v-chip v-for="item in row.consequent" :key="item" class="ma-1" color="success" size="small">
                    {{ item }}
                </v-chip>
            </template>

        </v-data-table>

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
                { title: 'Thuật toán FP-Growth', value: 'fp-growth' }
            ],
            timeRange: 'week',
            timeRanges: [
                { title: '7 ngày qua', value: 'week' },
                { title: '30 ngày qua', value: 'month' },
                { title: '90 ngày qua', value: 'quarter' },
                { title: '365 ngày qua', value: 'year' },
            ],
            headers: [
                { title: 'STT', key: 'index' },
                { title: 'Sản phẩm gốc', key: 'antecedent' },
                { title: 'Sản phẩm gợi ý', key: 'consequent' },
                { title: 'Support', key: 'support' },
                { title: 'Confidence', key: 'confidence' },
                { title: 'Lift', key: 'lift' }
            ],
            minSupport: 0.1,
            minConfidence: 0.5,
            totalRules: 0,
            executionTime: 0,
            associationRules: [
                {
                    antecedent: ['A', 'B'],
                    consequent: ['C'],
                    support: 0.7,
                    confidence: 0.8,
                    lift: 1.2
                }
            ],
            search: '',
        }
    },

    methods: {
        formattedPrice(price) {
            return formatPrice(price);
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

                this.associationRules = response.data.rules;
                this.totalRules = response.data.totalRules;
                this.executionTime = response.data.executionTime;

                this.notificationStore.success('Phân tích hành vi mua sắm thành công');
            } catch (error) {
                console.error('Error analyzing shopping behavior:', error);
                this.notificationStore.error('Có lỗi xảy ra khi phân tích hành vi mua sắm');
            } finally {
                this.isLoading = false;
            }
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
</style>
