<template>
    <v-container fluid class="order-detail-container">
        <v-card class="order-detail-card">
            <!-- Header Section -->
            <div class="header-gradient pa-6">
                <v-row align="center" justify="space-between">
                    <v-col cols="auto">
                        <v-skeleton-loader v-if="loading" type="text" width="300"></v-skeleton-loader>
                        <div v-else class="d-flex align-center">
                            <v-icon icon="mdi-file-document-outline" size="32" color="white" class="mr-3"></v-icon>
                            <span class="text-h4 font-weight-bold text-white">CHI TIẾT ĐƠN HÀNG</span>
                        </div>
                    </v-col>
                    <v-col cols="auto">
                        <v-skeleton-loader v-if="loading" type="chip"></v-skeleton-loader>
                        <div v-else class="d-flex align-center">
                            <span class="text-h6 text-white mr-3">Mã đơn: {{ userOrderInfor.order_code }}</span>
                            <v-chip :color="getStatusColor(userOrderInfor.order_status)" class="status-chip"
                                size="large" :class="getStatusClass(userOrderInfor.order_status)" elevation="2">
                                <v-icon start :icon="getStatusIcon(userOrderInfor.order_status)" class="mr-2"></v-icon>
                                {{ getStatusText(userOrderInfor.order_status) }}
                            </v-chip>
                        </div>
                    </v-col>
                </v-row>
            </div>

            <!-- Main Content -->
            <v-card-text class="pa-6">
                <!-- Customer Information Card -->
                <div class="customer-info">
                    <div class="section-title">
                        <i class="fas fa-user-circle"></i>
                        <h3>THÔNG TIN KHÁCH HÀNG</h3>
                    </div>
                    <div class="info-content">
                        <template v-if="loading">
                            <div class="info-row contact-row">
                                <div class="info-item">
                                    <div class="skeleton-label"></div>
                                    <div class="skeleton-value"></div>
                                </div>
                                <div class="info-item">
                                    <div class="skeleton-label"></div>
                                    <div class="skeleton-value"></div>
                                </div>
                            </div>
                            <div class="info-row">
                                <div class="info-item contact-item">
                                    <div class="skeleton-label"></div>
                                    <div class="skeleton-value"></div>
                                </div>
                            </div>
                            <div class="info-row">
                                <div class="info-item contact-item">
                                    <div class="skeleton-label"></div>
                                    <div class="skeleton-value note"></div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="info-row contact-row">
                                <div class="info-item contact-item">
                                    <div class="info-label">
                                        <i class="fas fa-user"></i>
                                        <span>Tên khách hàng:</span>
                                    </div>
                                    <div class="info-value">{{ userOrderInfor.order_username }}</div>
                                </div>
                                <div class="info-item contact-item">
                                    <div class="info-label">
                                        <i class="fas fa-phone"></i>
                                        <span>Số điện thoại:</span>
                                    </div>
                                    <div class="info-value">{{ userOrderInfor.order_userphone }}</div>
                                </div>
                            </div>
                            <div class="info-row">
                                <div class="info-item contact-item">
                                    <div class="info-label">
                                        <i class="fas fa-map-marker-alt"></i>
                                        <span>Địa chỉ giao hàng:</span>
                                    </div>
                                    <div class="info-value">{{ userOrderInfor.order_useraddress }}</div>
                                </div>
                            </div>
                            <div class="info-row" v-if="userOrderInfor.order_note">
                                <div class="info-item contact-item">
                                    <div class="info-label">
                                        <i class="fas fa-sticky-note"></i>
                                        <span>Ghi chú:</span>
                                    </div>
                                    <div class="info-value note">{{ userOrderInfor.order_note }}</div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>

                <!-- Products Card -->
                <v-card class="mb-6 info-card" elevation="1">
                    <v-card-title class="card-title">
                        <v-icon start color="primary" class="mr-2">mdi-cart</v-icon>
                        THÔNG TIN SẢN PHẨM
                    </v-card-title>
                    <v-card-text>
                        <v-skeleton-loader v-if="loading" type="table"></v-skeleton-loader>
                        <v-data-table v-else :headers="headers" :items="products_infors" density="comfortable"
                            class="custom-table" hover>
                            <template v-slot:item.topping_name="{ item }">
                                <div v-if="item.toppings && item.toppings.length > 0" class="topping-list">
                                    <div v-for="(topping, index) in item.toppings" :key="index" class="topping-item">
                                        <v-icon size="small" color="primary" class="mr-1">mdi-plus</v-icon>
                                        {{ topping.name }} (+{{ topping.price }}đ)
                                    </div>
                                </div>
                                <div v-else class="text-medium-emphasis">Không có topping</div>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>

                <!-- Payment Card -->
                <v-card class="mb-6 info-card" elevation="1">
                    <v-card-title class="card-title">
                        <v-icon start color="primary" class="mr-2">mdi-cash-register</v-icon>
                        THANH TOÁN
                    </v-card-title>
                    <v-card-text>
                        <v-skeleton-loader v-if="loading" type="list-item-three-line"></v-skeleton-loader>
                        <template v-else>
                            <v-row class="payment-row">
                                <v-col cols="8" class="text-subtitle-1">Tổng tiền hàng:</v-col>
                                <v-col cols="4" class="text-right">
                                    <span class="text-subtitle-1">{{ formattedPrice(userOrderInfor.order_total_price)
                                    }}đ</span>
                                </v-col>
                            </v-row>

                            <v-row class="payment-row">
                                <v-col cols="8" class="text-subtitle-1">Phí giao hàng:</v-col>
                                <v-col cols="4" class="text-right">
                                    <span class="text-subtitle-1">{{ formattedPrice(userOrderInfor.order_shipping_fee)
                                    }}đ</span>
                                </v-col>
                            </v-row>

                            <v-row class="payment-row">
                                <v-col cols="8" class="text-subtitle-1">Voucher khuyến mãi:</v-col>
                                <v-col cols="4" class="text-right">
                                    <span class="text-subtitle-1 error--text">- {{
                                        formattedPrice(userOrderInfor.order_discount_amount) }}đ</span>
                                </v-col>
                            </v-row>

                            <v-divider class="my-4"></v-divider>

                            <v-row class="payment-row total-row">
                                <v-col cols="8">
                                    <div class="text-h6 font-weight-bold">THÀNH TIỀN:</div>
                                </v-col>
                                <v-col cols="4" class="text-right">
                                    <span class="text-h6 font-weight-bold primary--text">{{
                                        formattedPrice(payment_infor[0].total) }}đ</span>
                                </v-col>
                            </v-row>

                            <v-row class="payment-row mt-4">
                                <v-col cols="8">
                                    <div class="text-subtitle-1">Phương thức thanh toán:</div>
                                </v-col>
                                <v-col cols="4" class="text-right">
                                    <v-chip :color="getPaymentMethodColor(payment_infor[0].method)"
                                        class="payment-method-chip">
                                        {{ getPaymentMethodText(payment_infor[0].method) }}
                                    </v-chip>
                                </v-col>
                            </v-row>
                        </template>
                    </v-card-text>
                </v-card>

                <!-- Action Buttons -->
                <v-row justify="center" class="mt-6" spacing="4">
                    <v-col v-if="canShowActionButtons" cols="auto">
                        <v-btn color="success" size="large" @click="handleGiaoHang" :loading="loading"
                            :disabled="loading" class="action-button" elevation="2">
                            <v-icon start>mdi-truck-delivery</v-icon>
                            BẮT ĐẦU GIAO HÀNG
                        </v-btn>
                    </v-col>
                    <v-col v-if="canShowActionButtons" cols="auto">
                        <v-btn color="error" size="large" @click="handleCancel" :loading="loading" :disabled="loading"
                            class="action-button" elevation="2">
                            <v-icon start>mdi-close-circle</v-icon>
                            HỦY ĐƠN HÀNG
                        </v-btn>
                    </v-col>
                    <!-- Nút Giao thành công cho admin -->
                    <v-col v-if="canShowGiaoThanhCongButton" cols="auto">
                        <v-btn color="primary" size="large" @click="handleGiaoThanhCong" :loading="loading"
                            :disabled="loading" class="action-button" elevation="2">
                            <v-icon start>mdi-check-circle</v-icon>
                            GIAO THÀNH CÔNG
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { adminAPI } from "@/api/admin"
import { useNotificationStore } from '@/stores/notification';
import { formatPrice } from '@/utils/format';
export default {
    name: "OrderDetails",
    components: {

    },
    setup() {
        const notificationStore = useNotificationStore();
        return { notificationStore };
    },

    data() {
        return {
            loading: true,
            currentCODE: '',
            customerFields: [
                { label: 'Tên khách hàng', key: 'order_username' },
                { label: 'Số điện thoại', key: 'order_userphone' },
                { label: 'Địa chỉ', key: 'order_useraddress' },
                { label: 'Thời gian đặt hàng', key: 'order_time' },
            ],
            additionalCosts: [
                { label: 'Tổng tiền hàng', key: 'order_total_price' },
                { label: 'Voucher khuyến mãi', key: 'order_discount_amount' },
                { label: 'Phí giao hàng', key: 'order_shipping_fee' },
            ],
            headers: [
                { title: 'STT', key: 'number', align: 'center', width: '10%' },
                { title: 'TÊN SẢN PHẨM', key: 'name', align: 'center', width: '20%' },
                { title: 'Topping', key: 'topping_name', align: 'center', width: '30%' },
                { title: 'Ghi chú', key: 'item_note', align: 'center', width: '20%' },
                { title: 'CỠ', key: 'size', align: 'center', width: '10%' },
                { title: 'SỐ LƯỢNG', key: 'quantity', align: 'center', width: '10%' },
                { title: 'ĐƠN GIÁ', key: 'price', align: 'center', width: '10%' },
                { title: 'GIẢM GIÁ', key: 'discount', align: 'center', width: '10%' },
            ],
            payment_headers: [
                { title: 'PHƯƠNG THỨC THANH TOÁN', key: 'method', align: 'center', width: '60%' },
                { title: 'THÀNH TIỀN', key: 'total', align: 'center', width: '40%' },
            ],
            payment_infor: [{
                method: 'Tiền Mặt',
                total: '525000',
            }],
            products_infors: [],
            userOrderInfor: {
                order_id: "",
                order_code: "",
                order_username: "",
                order_useraddress: "",
                order_userphone: "",
                order_discount_amount: "",
                order_shipping_fee: "",
                order_time: "",
                order_note: "",
                order_status: "",
            }
        }
    },

    watch: {
        '$route': {
            immediate: true,
            handler(to) {
                const orderId = to.params.order_id;
                if (orderId && orderId !== this.currentCODE) {
                    this.currentCODE = orderId;
                    this.getOrderInfo();
                }
            }
        }
    },

    created() {
        // Không cần gọi getOrderInfo ở đây nữa vì watch với immediate: true sẽ tự động gọi
    },

    computed: {
        // Kiểm tra xem có hiển thị nút hành động không
        canShowActionButtons() {
            const order = this.userOrderInfor;
            // Chỉ hiển thị nút khi đơn đang ở trạng thái xử lý (status = 0)
            // và là đơn COD chưa thanh toán hoặc đơn online đã thanh toán
            return order.order_status === '0' && (
                (order.payment_method === 'cod' && order.payment_status === '0') ||
                (order.payment_method !== 'cod' && order.payment_status === '1')
            );
        },
        // Hiển thị nút Giao thành công khi đơn đang ở trạng thái ĐANG GIAO HÀNG
        canShowGiaoThanhCongButton() {
            return this.userOrderInfor.order_status === '1';
        }
    },

    methods: {
        formattedPrice(price) {
            return formatPrice(price);
        },

        async getOrderInfo() {
            try {
                this.loading = true;
                const { data } = await adminAPI.order.getById(this.currentCODE);
                this.updatePaymentInfo(data.order);
                this.updateUserOrderInfo(data.order);
                this.updateProductsInfo(data.order.order_items);
            } catch (error) {
                console.error("Error fetching order info:", error);
            } finally {
                this.loading = false;
            }
        },

        updatePaymentInfo(orderInfo) {
            this.payment_infor[0].method = orderInfo.payment_method;
            this.payment_infor[0].total = orderInfo.final_price;
        },

        updateUserOrderInfo(orderInfo) {
            //console.log(orderInfo);
            this.userOrderInfor = {
                order_id: orderInfo.id,
                order_code: orderInfo.order_code,
                order_username: orderInfo.user_name,
                order_useraddress: orderInfo.address,
                order_userphone: orderInfo.mobile_no,
                order_note: orderInfo.note,
                order_total_price: orderInfo.total_price,
                order_discount_amount: orderInfo.discount_amount,
                order_shipping_fee: orderInfo.shipping_fee,
                order_time: new Date(orderInfo.created_at).toLocaleString(),
                order_status: orderInfo.status,
                payment_method: orderInfo.payment_method,
                payment_status: orderInfo.payment_status,
            };
        },

        updateProductsInfo(products) {
            this.products_infors = products.map((product, index) => {
                return {
                    number: index + 1,
                    name: product.product_name,
                    size: product.size,
                    quantity: product.product_quantity,
                    price: this.formattedPrice(product.product_price),
                    discount: 0,
                    item_note: product.item_note,
                    toppings: product.topping_items.map(topping => ({
                        name: topping.name,
                        price: this.formattedPrice(topping.price)
                    }))
                };
            });
        },

        calculatePrice(product, toppingPrice) {
            let price = toppingPrice;
            if (product.size === 'M') price += 6000;
            else if (product.size === 'L') price += 10000;
            return price + (product.price * product.product_count);
        },

        async handleGiaoHang() {
            try {
                await adminAPI.order.startDelivery(this.userOrderInfor.order_id);
                this.notificationStore.success("Xác nhận giao hàng thành công", 3000);
                this.$router.push('/admin/pages/manage-orders');
            } catch (error) {
                console.error("Error accepting order:", error);
            }
        },

        async handleCancel() {
            try {
                await adminAPI.order.cancel(this.userOrderInfor.order_id);
                this.notificationStore.success("Xác nhận hủy đơn hàng thành công", 3000);
                this.$router.push('/admin/pages/manage-orders');
            } catch (error) {
                console.error("Error canceling order:", error);
            }
        },

        async handleGiaoThanhCong() {
            try {
                await adminAPI.order.complete(this.userOrderInfor.order_id);
                this.notificationStore.success("Xác nhận giao thành công", 3000);
                this.$router.push('/admin/pages/manage-orders');
            } catch (error) {
                console.error("Error completing delivery:", error);
            }
        },

        getStatusColor(status) {
            const statusColors = {
                '0': 'warning',
                '1': 'info',
                '2': 'success',
                '-1': 'error'
            };
            return statusColors[status] || 'grey';
        },

        getStatusText(status) {
            const statusTexts = {
                '0': 'CHỜ GIAO HÀNG',
                '1': 'ĐANG GIAO HÀNG',
                '2': 'ĐÃ GIAO HÀNG',
                '-1': 'ĐÃ HỦY'
            };
            return statusTexts[status] || 'KHÔNG XÁC ĐỊNH';
        },

        getPaymentMethodColor(method) {
            const colors = {
                'cod': 'warning',
                'momo': 'pink',
                'vnpay': 'blue',
                'zalopay': 'indigo'
            };
            return colors[method] || 'grey';
        },

        getPaymentMethodText(method) {
            const texts = {
                'cod': 'Thanh toán khi nhận hàng',
                'momo': 'Ví MoMo',
                'vnpay': 'VNPay',
                'zalopay': 'ZaloPay'
            };
            return texts[method] || method;
        },

        getStatusIcon(status) {
            const icons = {
                '0': 'mdi-clock-outline',
                '1': 'mdi-truck-delivery',
                '2': 'mdi-check-circle',
                '-1': 'mdi-close-circle'
            };
            return icons[status] || 'mdi-help-circle';
        },

        getStatusClass(status) {
            const classes = {
                '0': 'status-warning',
                '1': 'status-info',
                '2': 'status-success',
                '-1': 'status-error'
            };
            return classes[status] || '';
        },
    }
};
</script>

<style scoped>
.order-detail-container {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding: 24px;
}

.order-detail-card {
    border-radius: 12px;
    overflow: hidden;
}

.header-gradient {
    background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%);
}

.status-chip {
    font-weight: 600;
    letter-spacing: 0.5px;
    font-size: 1rem;
    padding: 8px 16px;
    border-radius: 8px;
    min-width: 180px;
    justify-content: center;
    text-transform: uppercase;
}

.status-warning {
    background-color: #fff3e0 !important;
    color: #e65100 !important;
    border: 2px solid #ffb74d;
}

.status-info {
    background-color: #e3f2fd !important;
    color: #1565c0 !important;
    border: 2px solid #64b5f6;
}

.status-success {
    background-color: #e8f5e9 !important;
    color: #2e7d32 !important;
    border: 2px solid #81c784;
}

.status-error {
    background-color: #ffebee !important;
    color: #c62828 !important;
    border: 2px solid #e57373;
}

:deep(.status-chip .v-icon) {
    font-size: 20px;
}

.info-card {
    border-radius: 8px;
    transition: transform 0.2s;
}

.info-card:hover {
    transform: translateY(-2px);
}

.card-title {
    background-color: #f8f9fa;
    border-bottom: 1px solid #e0e0e0;
    font-weight: 600;
    letter-spacing: 0.5px;
    padding: 16px;
}

.custom-field {
    background-color: #f8f9fa;
}

.custom-table {
    border-radius: 8px;
    overflow: hidden;
}

:deep(.v-data-table-header) {
    background-color: #f8f9fa;
}

:deep(.v-data-table-header th) {
    font-weight: 600 !important;
    color: #424242 !important;
}

:deep(.v-data-table-row:hover) {
    background-color: #f5f5f5 !important;
}

.topping-list {
    padding-left: 8px;
}

.topping-item {
    font-size: 0.9rem;
    color: rgba(0, 0, 0, 0.6);
    margin: 4px 0;
}

.payment-row {
    padding: 8px 0;
}

.total-row {
    background-color: #f8f9fa;
    padding: 16px 0;
    border-radius: 4px;
}

.payment-method-chip {
    font-weight: 500;
    letter-spacing: 0.5px;
}

.action-button {
    min-width: 200px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: none;
}

@media (max-width: 960px) {
    .order-detail-container {
        padding: 16px;
    }

    .header-gradient {
        padding: 16px !important;
    }

    .card-title {
        padding: 12px;
    }

    .action-button {
        min-width: 160px;
    }
}

.customer-info {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    padding: 20px;
    margin-bottom: 24px;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 2px solid #f0f0f0;
}

.section-title i {
    font-size: 24px;
    color: #1890ff;
}

.section-title h3 {
    font-size: 18px;
    font-weight: 600;
    color: #1f1f1f;
    margin: 0;
}

.info-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.info-row {
    display: flex;
    gap: 24px;
}

.info-item {
    flex: 1;
    min-width: 0;
}

.info-item.full-width {
    flex: 2;
}

.info-label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    color: #666;
    font-size: 14px;
}

.info-label i {
    color: #1890ff;
    font-size: 16px;
}

.info-value {
    font-size: 15px;
    color: #1f1f1f;
    font-weight: 500;
    word-break: break-word;
    line-height: 1.5;
}

.info-value.note {
    color: #666;
    font-style: italic;
    background: #fafafa;
    padding: 12px;
    border-radius: 8px;
    border-left: 3px solid #1890ff;
}

@media (max-width: 768px) {
    .info-row {
        flex-direction: column;
        gap: 16px;
    }

    .info-item {
        width: 100%;
    }

    .info-item.full-width {
        width: 100%;
    }
}

/* Skeleton Loading Styles */
.skeleton-label {
    height: 16px;
    width: 120px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
    margin-bottom: 8px;
}

.skeleton-value {
    height: 20px;
    width: 100%;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
}

.skeleton-value.note {
    height: 60px;
}

@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }

    100% {
        background-position: 200% 0;
    }
}

/* Thêm hiệu ứng hover cho các info-item */
.info-item {
    transition: transform 0.2s ease;
}

.info-item:hover {
    transform: translateX(4px);
}

.info-value {
    transition: color 0.2s ease;
}

.info-item:hover .info-value {
    color: #1890ff;
}

/* Thêm hiệu ứng cho icon */
.info-label i {
    transition: transform 0.2s ease;
}

.info-item:hover .info-label i {
    transform: scale(1.1);
}

/* Thêm hiệu ứng cho note */
.info-value.note {
    transition: all 0.3s ease;
}

.info-item:hover .info-value.note {
    border-left-color: #40a9ff;
    background: #f5f5f5;
}

.contact-row {
    display: flex;
    gap: 24px;
    align-items: flex-start;
}

.contact-item {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 16px;
}

.contact-item .info-label {
    margin-bottom: 0;
    white-space: nowrap;
    min-width: 160px;
    padding-top: 2px;
}

.contact-item .info-value {
    flex: 1;
    min-width: 0;
    line-height: 1.5;
}

.contact-item .info-value.note {
    background: #fafafa;
    padding: 12px;
    border-radius: 8px;
    border-left: 3px solid #1890ff;
    margin-top: -2px;
}

@media (max-width: 768px) {
    .contact-row {
        flex-direction: column;
        gap: 16px;
    }

    .contact-item {
        width: 100%;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .contact-item .info-label {
        margin-bottom: 8px;
        min-width: auto;
    }

    .contact-item .info-value.note {
        width: 100%;
        margin-top: 0;
    }
}
</style>
