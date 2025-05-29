<template>
    <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="800px">
        <v-card>
            <v-card-title class="text-h5 bg-primary py-3 text-white d-flex align-center">
                <span>Chi tiết đơn hàng {{ orderDetail ? orderDetail.order_code : '' }}</span>
                <v-spacer></v-spacer>
                <v-btn icon variant="text" @click="$emit('update:modelValue', false)" class="ml-2" color="white">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text class="pt-4">
                <template v-if="orderDetail">
                    <v-row>
                        <v-col cols="6">
                            <p><strong>Thời gian:</strong> {{ formatDateTime(orderDetail.created_at) }}</p>
                            <p><strong>Khách hàng:</strong> {{ orderDetail.user_name }}</p>
                            <p><strong>Địa chỉ:</strong> {{ orderDetail.address }}</p>
                            <p><strong>Số điện thoại:</strong> {{ orderDetail.mobile_no }}</p>
                            <p><strong>Hướng dẫn giao hàng:</strong> {{ orderDetail.note }}</p>
                        </v-col>
                        <v-col cols="6">
                            <p><strong>Tổng tiền:</strong>{{ formatPrice(orderDetail.final_price) }}VNĐ</p>
                            <p><strong>Trạng thái:</strong> {{ getStatusText(orderDetail.status) }}</p>
                            <p v-if="orderDetail.status === '-1'"><strong>Thời gian hủy:</strong>{{
                                formatDateTime(orderDetail.updated_at) }}</p>
                            <p v-if="orderDetail.status === '3'"><strong>Thời gian hoàn thành:</strong>{{
                                formatDateTime(orderDetail.updated_at) }}</p>
                        </v-col>
                    </v-row>

                    <v-divider class="my-4"></v-divider>

                    <h3 class="text-h6 mb-3">Chi tiết sản phẩm </h3>
                    <h4 class="text-subtitle-1 text-medium-emphasis">Thành tiền = (Đơn giá + Tổng giá trị Topping + Giá
                        size) * Số lượng</h4>
                    <v-table density="comfortable" class="responsive-table">
                        <thead>
                            <tr>
                                <th>Sản phẩm</th>
                                <th>Ghi chú</th>
                                <th>Số lượng</th>
                                <th>Đơn giá</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in orderDetail.order_items" :key="item.id">
                                <td>
                                    {{ item.product_name }} x Size: {{ item.size }}
                                    <template v-if="item.topping_items && item.topping_items.length">
                                        <div v-for="topping in item.topping_items" :key="topping.id"
                                            class="text-caption text-grey ml-3">
                                            + {{ topping ? topping.name : '' }} ({{ topping ? formatPrice(topping.price)
                                                : 0 }}VNĐ)
                                        </div>
                                    </template>
                                </td>
                                <td>{{ item.item_note || '' }}</td>
                                <td>{{ item.product_quantity }}</td>
                                <td>{{ formatPrice(item.product_price) }}VNĐ</td>
                                <td>{{ formatPrice(calculateItemTotal(item)) }}VNĐ</td>
                            </tr>
                        </tbody>
                    </v-table>

                    <v-row class="mt-4">
                        <v-col cols="6"></v-col>
                        <v-col cols="6">
                            <div class="d-flex justify-space-between mb-2">
                                <strong>Tổng tiền hàng:</strong>
                                <span>{{ formatPrice(orderDetail.total_price) }}VNĐ</span>
                            </div>
                            <div class="d-flex justify-space-between mb-2">
                                <strong>Phí vận chuyển:</strong>
                                <span>{{ formatPrice(orderDetail.shipping_fee) }}VNĐ</span>
                            </div>
                            <div class="d-flex justify-space-between mb-2">
                                <strong>Giảm giá:</strong>
                                <span>-{{ formatPrice(orderDetail.discount) }}VNĐ</span>
                            </div>
                            <v-divider class="my-2"></v-divider>
                            <div class="d-flex justify-space-between">
                                <strong>Tổng thanh toán:</strong>
                                <span class="text-primary font-weight-bold">{{ formatPrice(orderDetail.final_price)
                                    }}VNĐ</span>
                            </div>
                            <v-divider class="my-2"></v-divider>
                            <div class="d-flex justify-space-between">
                                <strong>Phương thức thanh toán:</strong>
                                <span class="text-primary font-weight-bold">{{
                                    getPaymentMethodText(orderDetail.payment_method) }}</span>
                            </div>
                        </v-col>
                    </v-row>
                </template>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import { formatPrice, formatDateTime } from '@/utils/format'

export default {
    name: 'OrderDetailDialog',
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
        orderDetail: {
            type: Object,
            default: null
        }
    },
    emits: ['update:modelValue'],
    methods: {
        formatDateTime,
        formatPrice(price) {
            return formatPrice(price)
        },

        calculateItemTotal(item) {
            const toppingTotal = (item.topping_items || []).reduce((sum, topping) =>
                sum + (topping ? parseInt(topping.price) : 0), 0)
            const sizePrice = item.size === 'M' ? 6000 :
                item.size === 'L' ? 10000 : 0
            const total = (parseInt(item.product_price) + toppingTotal + sizePrice) * item.product_quantity
            return total
        },

        getStatusText(status) {
            const statusTexts = {
                '-1': 'Đã hủy',
                '0': 'Chờ xác nhận',
                '1': 'Đã thanh toán',
                '2': 'Đang giao hàng',
                '3': 'Hoàn thành',
                '4': 'Giao thất bại'
            };
            return statusTexts[status] || 'Không xác định';
        },

        getPaymentMethodText(method) {
            const methods = {
                'cod': 'Thanh toán khi nhận hàng',
                'online': 'Chuyển khoản online',
                'momo': 'Ví MoMo',
                'zalopay': 'Ví ZaloPay'
            };
            return methods[method] || 'Không xác định';
        }
    }
}
</script>

<style scoped>
@media (max-width: 600px) {
    .responsive-table {
        display: block;
        overflow-x: auto;
    }

    .text-h6 {
        font-size: 1rem !important;
    }

    :deep(.v-table) {
        font-size: 0.875rem;
    }

    :deep(.v-card-text) {
        padding: 12px;
    }
}
</style>