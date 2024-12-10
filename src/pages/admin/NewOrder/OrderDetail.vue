<template>
    <v-container fluid>
        <v-card class="pa-4">
            <!-- Title and Status Row -->
            <v-row align="center" justify="space-between" class="px-4 mb-4">
                <v-col cols="auto">
                    <v-skeleton-loader v-if="loading" type="text" width="300"></v-skeleton-loader>
                    <span v-else class="text-h5">CHI TIẾT ĐƠN HÀNG - {{ userOrderInfor.order_code }}</span>
                </v-col>
                <v-col cols="auto">
                    <v-skeleton-loader v-if="loading" type="chip"></v-skeleton-loader>
                    <v-chip v-else :color="getStatusColor(userOrderInfor.order_status)" class="px-4">
                        {{ getStatusText(userOrderInfor.order_status) }}
                    </v-chip>
                </v-col>
            </v-row>

            <!-- Customer Information -->
            <v-row>
                <v-col cols="12" md="6" v-for="field in customerFields" :key="field.label">
                    <v-row align="center">
                        <v-col cols="12" md="4">
                            <div class="text-subtitle-1 font-weight-medium">{{ field.label }}:</div>
                        </v-col>
                        <v-col cols="12" md="8">
                            <v-skeleton-loader v-if="loading" type="text"></v-skeleton-loader>
                            <v-text-field v-else :model-value="userOrderInfor[field.key]" readonly density="compact"
                                variant="outlined" hide-details></v-text-field>
                        </v-col>
                    </v-row>
                </v-col>

                <!-- Delivery Note -->
                <v-col cols="12">
                    <v-row align="center">
                        <v-col cols="12" md="2">
                            <div class="text-subtitle-1 font-weight-medium">Ghi chú hướng dẫn giao hàng:</div>
                        </v-col>
                        <v-col cols="12" md="10">
                            <v-skeleton-loader v-if="loading" type="text"></v-skeleton-loader>
                            <v-text-field v-else :model-value="userOrderInfor.order_note" readonly density="compact"
                                variant="outlined" hide-details></v-text-field>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>

            <!-- Products Table -->
            <v-card class="mt-6">
                <v-card-title class="text-center py-4">Thông tin sản phẩm</v-card-title>
                <v-skeleton-loader v-if="loading" type="table"></v-skeleton-loader>
                <v-data-table v-else :headers="headers" :items="products_infors" density="compact" class="elevation-1">
                    <template v-slot:item.topping_name="{ item }">
                        <div v-if="item.toppings && item.toppings.length > 0">
                            <div v-for="(topping, index) in item.toppings" :key="index">
                                <span class="ml-4">{{ topping.name }} + {{ topping.price }}đ</span>
                            </div>
                        </div>
                        <div v-else>Không có topping</div>
                    </template>
                </v-data-table>
            </v-card>

            <!-- Additional Costs and Final Payment -->
            <v-card class="mt-6 pa-4">
                <v-card-title class="text-center py-4">Thanh toán</v-card-title>
                <v-skeleton-loader v-if="loading" type="list-item-three-line"></v-skeleton-loader>
                <template v-else>
                    <!-- Subtotal -->
                    <v-row align="center" class="mb-2">
                        <v-col cols="8" class="text-subtitle-1">Tổng tiền hàng:</v-col>
                        <v-col cols="4" class="text-right">
                            <span class="text-subtitle-1">+ {{ formattedPrice(userOrderInfor.order_total_price) }} đ</span>
                        </v-col>
                    </v-row>

                    <!-- Discount -->
                    <v-row align="center" class="mb-2">
                        <v-col cols="8" class="text-subtitle-1">Voucher khuyến mãi:</v-col>
                        <v-col cols="4" class="text-right">
                            <span class="text-subtitle-1 error--text">- {{
                                formattedPrice(userOrderInfor.order_discount_amount) }}
                                đ</span>
                        </v-col>
                    </v-row>

                    <!-- Shipping Fee -->
                    <v-row align="center" class="mb-2">
                        <v-col cols="8" class="text-subtitle-1">Phí giao hàng:</v-col>
                        <v-col cols="4" class="text-right">
                            <span class="text-subtitle-1">+ {{ formattedPrice(userOrderInfor.order_shipping_fee) }} đ</span>
                        </v-col>
                    </v-row>

                    <!-- Divider -->
                    <v-divider class="my-4"></v-divider>

                    <!-- Final Total -->
                    <v-row align="center">
                        <v-col cols="8">
                            <div class="text-h6 font-weight-bold">THÀNH TIỀN:</div>
                        </v-col>
                        <v-col cols="4" class="text-right">
                            <span class="text-h6 font-weight-bold primary--text">{{ formattedPrice(payment_infor[0].total)
                                }} đ</span>
                        </v-col>
                    </v-row>

                    <!-- Payment Method -->
                    <v-row align="center" class="mt-4">
                        <v-col cols="8">
                            <div class="text-subtitle-1">Phương thức thanh toán:</div>
                        </v-col>
                        <v-col cols="4" class="text-right">
                            <span class="text-subtitle-1">{{ payment_infor[0].method }}</span>
                        </v-col>
                    </v-row>
                </template>
            </v-card>

            <!-- Action Buttons -->
            <v-row justify="center" class="mt-6 pa-4" spacing="4">
                <v-col cols="auto">
                    <v-btn color="success" size="large" @click="handleGiaoHang" :loading="loading" :disabled="loading">
                        BẮT ĐẦU GIAO HÀNG
                    </v-btn>
                </v-col>
                <v-col cols="auto">
                    <v-btn color="error" size="large" @click="handleCancel" :loading="loading" :disabled="loading">
                        HỦY
                    </v-btn>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
import { orderAPI } from "@/api/order"
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
            currentCODE: this.$route.params.order_code,
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
                { title: 'Topping', key: 'topping_name', align: 'center', width: '25%' },
                { title: 'Ghi chú', key: 'item_note', align: 'center', width: '20%' },
                { title: 'CỠ', key: 'size', align: 'center', width: '10%' },
                { title: 'SỐ LƯỢNG', key: 'quantity', align: 'center', width: '10%' },
                { title: 'ĐƠN GIÁ', key: 'price', align: 'center', width: '10%' },
                { title: 'GIẢM GIÁ', key: 'discount', align: 'center', width: '15%' },
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

    created() {
        this.checkAuth();
    },

    methods: {
        formattedPrice(price) {
            return formatPrice(price);
        },

        checkAuth() {
            if (localStorage.getItem("AdminLoggedIn") === "false") {
                this.$router.push("/pages/login");
                return;
            }
            this.getOrderInfo();
        },

        async getOrderInfo() {
            try {
                this.loading = true;
                const { data } = await orderAPI.getOrderInfo(this.currentCODE);
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
                order_time: new Date(orderInfo.order_time).toLocaleString(),
                order_status: orderInfo.status,
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
                await orderAPI.acceptOrder({ order_id: this.userOrderInfor.order_id });
                this.notificationStore.success("Xác nhận giao hàng thành công", 3000);
                this.$router.push('/admin/new-orders');
            } catch (error) {
                console.error("Error accepting order:", error);
            }
        },

        async handleCancel() {
            try {
                await orderAPI.cancelOrder({ order_id: this.userOrderInfor.order_id });
                this.notificationStore.success("Xác nhận hủy đơn hàng thành công", 3000);
                this.$router.push('/admin/new-orders');
            } catch (error) {
                console.error("Error canceling order:", error);
            }
        },

        getStatusColor(status) {
            const statusColors = {
                '0': 'warning',
                '1': 'info',
                '2': 'purple',
                '3': 'success',
                '-1': 'error'
            };
            return statusColors[status] || 'grey';
        },

        getStatusText(status) {
            const statusTexts = {
                '0': 'CHỜ XÁC NHẬN',
                '1': 'ĐÃ THANH TOÁN CHỜ XÁC NHẬN',
                '2': 'ĐANG GIAO HÀNG',
                '3': 'HOÀN THÀNH',
                '-1': 'ĐÃ HỦY'
            };
            return statusTexts[status] || 'KHÔNG XÁC ĐỊNH';
        },
    }
};
</script>

<style scoped>
.v-text-field {
    width: 100%;
}
</style>
