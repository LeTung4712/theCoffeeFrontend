<template>
    <v-container class="fill-height payment-container">
        <v-row justify="center" align="center">
            <v-col cols="12" sm="10" md="8" lg="6">
                <!-- Success State -->
                <v-card v-if="paymentStatus === 'success'" class="payment-card success-card" elevation="4">
                    <v-card-title class="text-center text-h4 font-weight-bold pt-6 pb-2">
                        <v-icon color="success" size="40">mdi-check-circle</v-icon>
                        Thanh toán thành công!
                    </v-card-title>

                    <v-card-text class="text-center">
                        <div class="text-h6 text-medium-emphasis mb-6">
                            Cảm ơn bạn đã đặt hàng tại The Coffee ShopShop
                        </div>

                        <!-- Payment Details -->
                        <v-card flat class="payment-details pa-4 mb-6">
                            <div class="d-flex align-center justify-space-between mb-4">
                                <div class="text-subtitle-1 font-weight-bold">Thông tin giao dịch</div>
                                <v-chip color="success" variant="tonal" size="small" class="text-caption">
                                    Hoàn tất
                                </v-chip>
                            </div>
                            <v-divider class="mb-4"></v-divider>
                            <div class="transaction-info">
                                <div class="d-flex justify-space-between align-center mb-3">
                                    <div class="d-flex align-center">
                                        <v-icon color="primary" size="small" class="me-2">mdi-receipt</v-icon>
                                        <span class="text-body-2">Mã giao dịch</span>
                                    </div>
                                    <span class="text-primary font-weight-medium">{{ paymentData && paymentData.bankCode
                                    }}</span>
                                </div>

                                <div class="d-flex justify-space-between align-center mb-3">
                                    <div class="d-flex align-center">
                                        <v-icon color="primary" size="small" class="me-2">mdi-bank</v-icon>
                                        <span class="text-body-2">Phương thức</span>
                                    </div>
                                    <span class="text-primary font-weight-medium">{{ paymentData && paymentData.method
                                    }}</span>
                                </div>

                                <div class="d-flex justify-space-between align-center mb-3">
                                    <div class="d-flex align-center">
                                        <v-icon color="primary" size="small" class="me-2">mdi-clock-outline</v-icon>
                                        <span class="text-body-2">Thời gian</span>
                                    </div>
                                    <span class="text-primary font-weight-medium">{{ paymentData &&
                                        formatDate(paymentData.timestamp) }}</span>
                                </div>

                                <v-divider class="my-3"></v-divider>

                                <div class="d-flex justify-space-between align-center">
                                    <div class="d-flex align-center">
                                        <v-icon color="primary" size="small" class="me-2">mdi-currency-usd</v-icon>
                                        <span class="text-body-2 font-weight-medium">Số tiền</span>
                                    </div>
                                    <span class="text-primary text-h6 font-weight-bold">{{ paymentData &&
                                        paymentData.amount }}đ</span>
                                </div>
                            </div>
                        </v-card>
                    </v-card-text>

                    <v-card-actions class="justify-center pb-6">
                        <v-btn color="primary" size="large" to="/user/lich-su" class="action-btn me-4" elevation="2">
                            <v-icon start icon="mdi-clipboard-list"></v-icon>
                            Xem đơn hàng
                        </v-btn>
                        <v-btn color="secondary" size="large" to="/collections/menu/00" class="action-btn"
                            variant="outlined">
                            <v-icon start icon="mdi-coffee"></v-icon>
                            Tiếp tục mua sắm
                        </v-btn>
                    </v-card-actions>
                </v-card>

                <!-- Error State -->
                <v-card v-else-if="paymentStatus === 'error'" class="payment-card error-card" elevation="4">
                    <v-card-title class="text-center text-h4 font-weight-bold pt-6 pb-2">
                        <v-icon color="error" size="40" class="me-2">mdi-alert-circle</v-icon>
                        Thanh toán thất bại
                    </v-card-title>

                    <v-card-text class="text-center">
                        <div class="text-h6 text-medium-emphasis mb-6">
                            {{ errorMessage || 'Đã có lỗi xảy ra trong quá trình thanh toán' }}
                        </div>

                        <!-- Payment Details -->
                        <v-card flat class="payment-details pa-4 mb-6">
                            <div class="d-flex align-center justify-space-between mb-4">
                                <div class="text-subtitle-1 font-weight-bold">Thông tin giao dịch</div>
                                <v-chip color="error" variant="tonal" size="small" class="text-caption">
                                    Thất bại
                                </v-chip>
                            </div>
                            <v-divider class="mb-4"></v-divider>
                            <div class="transaction-info">
                                <div class="d-flex justify-space-between align-center mb-3">
                                    <div class="d-flex align-center">
                                        <v-icon color="error" size="small" class="me-2">mdi-receipt</v-icon>
                                        <span class="text-body-2">Mã giao dịch</span>
                                    </div>
                                    <span class="text-error font-weight-medium">{{ paymentData && paymentData.bankCode
                                    }}</span>
                                </div>

                                <div class="d-flex justify-space-between align-center mb-3">
                                    <div class="d-flex align-center">
                                        <v-icon color="error" size="small" class="me-2">mdi-bank</v-icon>
                                        <span class="text-body-2">Phương thức</span>
                                    </div>
                                    <span class="text-error font-weight-medium">{{ paymentData && paymentData.method
                                    }}</span>
                                </div>

                                <div class="d-flex justify-space-between align-center mb-3">
                                    <div class="d-flex align-center">
                                        <v-icon color="error" size="small" class="me-2">mdi-clock-outline</v-icon>
                                        <span class="text-body-2">Thời gian</span>
                                    </div>
                                    <span class="text-error font-weight-medium">{{ paymentData &&
                                        formatDate(paymentData.timestamp) }}</span>
                                </div>

                                <v-divider class="my-3"></v-divider>

                                <div class="d-flex justify-space-between align-center">
                                    <div class="d-flex align-center">
                                        <v-icon color="error" size="small" class="me-2">mdi-currency-usd</v-icon>
                                        <span class="text-body-2 font-weight-medium">Số tiền</span>
                                    </div>
                                    <span class="text-error text-h6 font-weight-bold">{{ paymentData &&
                                        paymentData.amount }}đ</span>
                                </div>
                            </div>
                        </v-card>
                    </v-card-text>

                    <v-card-actions class="justify-center pb-6">
                        <v-btn color="error" size="large" to="/user/lich-su" class="action-btn me-4" elevation="2">
                            <v-icon start icon="mdi-refresh"></v-icon>
                            Xem đơn hàng
                        </v-btn>
                        <v-btn color="secondary" size="large" to="/collections/menu/00" class="action-btn"
                            variant="outlined">
                            <v-icon start icon="mdi-coffee"></v-icon>
                            Tiếp tục mua sắm
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { useNotificationStore } from '@/stores/notification'
import { useOrderStore } from '@/stores/order'

export default {
    name: 'PaymentProcessing',

    setup() {
        const notificationStore = useNotificationStore()
        const orderStore = useOrderStore()
        return { notificationStore, orderStore }
    },

    data() {
        return {
            paymentStatus: '', // 'success', 'error'
            errorMessage: '',
            paymentData: null
        }
    },

    async created() {
        try {
            // Lấy thông tin thanh toán từ URL parameters
            const urlParams = new URLSearchParams(window.location.search)

            // Xác định loại thanh toán từ URL
            const paymentType = this.determinePaymentType(urlParams)
            //console.log(paymentType)
            // Xử lý kết quả thanh toán dựa trên loại
            switch (paymentType) {
                case 'vnpay':
                    await this.handleVNPayResult(urlParams)
                    break
                case 'momo':
                    await this.handleMomoResult(urlParams)
                    break
                case 'zalopay':
                    await this.handleZaloPayResult(urlParams)
                    break
                default:
                    throw new Error('Phương thức thanh toán không được hỗ trợ')
            }
        } catch (error) {
            console.error('Payment processing error:', error)
            this.handleError(error)
        }
    },

    methods: {
        determinePaymentType(urlParams) {
            // Kiểm tra các tham số đặc trưng của từng loại thanh toán
            if (urlParams.has('vnp_ResponseCode')) return 'vnpay'
            if (urlParams.has('resultCode')) return 'momo'
            if (urlParams.has('apptransid')) return 'zalopay'
            return null
        },

        async handleVNPayResult(urlParams) {
            const vnpResponseCode = urlParams.get('vnp_ResponseCode')
            const vnpTransactionNo = urlParams.get('vnp_TransactionNo')
            const vnpOrderInfo = urlParams.get('vnp_OrderInfo')
            const vnpAmount = urlParams.get('vnp_Amount')
            const vnpBankCode = urlParams.get('vnp_BankCode')
            const vnpPayDate = urlParams.get('vnp_PayDate')
            const vnpTxnRef = urlParams.get('vnp_TxnRef')

            this.paymentData = {
                responseCode: vnpResponseCode,
                transactionNo: vnpTransactionNo,
                orderInfo: vnpOrderInfo,
                amount: vnpAmount / 100,
                method: vnpBankCode,
                bankCode: vnpTxnRef,
                timestamp: vnpPayDate
            }

            if (vnpResponseCode === '00') {
                await this.handleSuccessfulPayment()
            } else {
                this.handleFailedPayment()
            }
        },

        async handleMomoResult(urlParams) {
            const resultCode = urlParams.get('resultCode')
            const transId = urlParams.get('transId')
            const orderId = urlParams.get('orderId')
            const amount = urlParams.get('amount')
            const responseTime = urlParams.get('responseTime')

            // Chuyển đổi timestamp sang định dạng yyyyMMddHHmmss
            const momoDate = new Date(parseInt(responseTime))
            const formattedDate = momoDate.getFullYear() +
                String(momoDate.getMonth() + 1).padStart(2, '0') +
                String(momoDate.getDate()).padStart(2, '0') +
                String(momoDate.getHours()).padStart(2, '0') +
                String(momoDate.getMinutes()).padStart(2, '0') +
                String(momoDate.getSeconds()).padStart(2, '0')

            this.paymentData = {
                responseCode: resultCode,
                transactionNo: transId,
                bankCode: orderId,
                amount: amount,
                method: 'MoMo',
                timestamp: formattedDate,
            }

            if (resultCode === '0') {
                await this.handleSuccessfulPayment()
            } else {
                this.handleFailedPayment()
            }
        },

        async handleZaloPayResult(urlParams) {
            const status = urlParams.get('status')
            const apptransid = urlParams.get('apptransid')
            const amount = urlParams.get('amount')
            const message = urlParams.get('message')

            // Format thời gian hiện tại thành yyyyMMddHHmmss
            const now = new Date()
            const formattedDate = now.getFullYear() +
                String(now.getMonth() + 1).padStart(2, '0') +
                String(now.getDate()).padStart(2, '0') +
                String(now.getHours()).padStart(2, '0') +
                String(now.getMinutes()).padStart(2, '0') +
                String(now.getSeconds()).padStart(2, '0')

            this.paymentData = {
                responseCode: status,
                bankCode: apptransid,
                amount: amount,
                method: 'ZaloPay',
                timestamp: formattedDate,
                message: message
            }
            console.log(this.paymentData)

            if (status === '1') {
                await this.handleSuccessfulPayment()
            } else {
                this.handleFailedPayment()
            }
        },

        formatDate(dateStr) {
            if (!dateStr) return ''
            // Format: yyyyMMddHHmmss -> dd/MM/yyyy HH:mm:ss
            const year = dateStr.substring(0, 4)
            const month = dateStr.substring(4, 6)
            const day = dateStr.substring(6, 8)
            const hour = dateStr.substring(8, 10)
            const minute = dateStr.substring(10, 12)
            const second = dateStr.substring(12, 14)
            return `${day}/${month}/${year} ${hour}:${minute}:${second}`
        },

        handleSuccessfulPayment() {
            try {
                // Gọi API để cập nhật trạng thái đơn hàng
                // await this.orderStore.updateOrderStatus({
                //     order_code: this.paymentData.txnRef,
                //     status: 'paid'
                // })

                this.paymentStatus = 'success'
                this.notificationStore.success('Thanh toán thành công!')



                // Lưu thông tin thanh toán vào localStorage để có thể xem lại
                localStorage.setItem('lastPayment', JSON.stringify({
                    ...this.paymentData,
                    timestamp: new Date().toISOString()
                }))
            } catch (error) {
                console.error('Error updating order status:', error)
                this.handleError(error)
            }
        },

        handleFailedPayment() {
            this.paymentStatus = 'error'
            this.errorMessage = 'Giao dịch không thành công. Vui lòng thử lại sau.'
            this.notificationStore.error(this.errorMessage)
        },

        handleError(error) {
            this.paymentStatus = 'error'
            this.errorMessage = error.message || 'Có lỗi xảy ra trong quá trình xử lý thanh toán'
            this.notificationStore.error(this.errorMessage)
        }
    }
}
</script>

<style scoped>
.payment-container {
    background: linear-gradient(135deg, rgb(var(--v-theme-background)) 0%, rgb(var(--v-theme-surface)) 100%);
    min-height: 100vh;
}

.payment-card {
    border-radius: 16px;
    overflow: hidden;
    transition: transform 0.3s ease;
}

.payment-card:hover {
    transform: translateY(-5px);
}

.success-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border: 1px solid rgba(var(--v-theme-success), 0.1);
}

.error-card {
    background: linear-gradient(135deg, #ffffff 0%, #fff5f5 100%);
    border: 1px solid rgba(var(--v-theme-error), 0.1);
}

.success-icon-wrapper,
.error-icon-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    animation: iconPop 0.5s ease-out;
}

.payment-details {
    background: rgba(var(--v-theme-surface), 0.5);
    border-radius: 12px;
    border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.transaction-info {
    padding: 0.5rem;
}

.action-btn {
    min-width: 200px;
    text-transform: none;
    font-weight: 500;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
}

.action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.2);
}

@keyframes iconPop {
    0% {
        transform: scale(0);
        opacity: 0;
    }

    50% {
        transform: scale(1.2);
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

/* Responsive styles */
@media (max-width: 600px) {
    .payment-card {
        margin: 8px 0 !important;
        max-width: 100vw !important;
        width: 100% !important;
        box-sizing: border-box;
    }

    .payment-container {
        padding: 0 !important;
    }

    .v-card-title,
    .v-card-text,
    .v-card-actions {
        padding-left: 8px !important;
        padding-right: 8px !important;
    }

    .action-btn {
        min-width: 120px;
        font-size: 0.85rem;
        padding-left: 8px;
        padding-right: 8px;
    }
}

/* Thêm styles mới */
.v-chip {
    letter-spacing: 0.5px;
}

.text-body-2 {
    color: rgba(var(--v-theme-on-surface), 0.7);
}

.text-primary {
    font-family: 'Roboto Mono', monospace;
}

.error-help-text {
    background: rgba(var(--v-theme-error), 0.05);
    border-radius: 8px;
    padding: 1rem;
}

.text-error {
    color: rgb(var(--v-theme-error));
    font-family: 'Roboto Mono', monospace;
}

.v-chip-group {
    gap: 0.5rem;
}

.v-chip {
    border-width: 1px;
}
</style>