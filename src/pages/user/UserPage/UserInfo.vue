<template>
    <v-container fluid class="body">
        <!-- Main Content -->
        <v-row class="user-info" justify="center">
            <!-- Left Panel -->
            <v-col cols="12" lg="4">
                <v-card class="user-info-left pa-4">
                    <!-- Bean Card Section -->
                    <v-card class="mb-4 pa-4" color="primary" rounded="lg">
                        <div class="text-white mb-2">
                            <span class="text-h6">bean -</span>
                            <v-btn variant="text" class="float-right" color="white">
                                Tích điểm
                                <v-icon>mdi-chevron-right</v-icon>
                            </v-btn>
                        </div>

                        <!-- Barcode Section -->
                        <v-card class="pa-4 text-center mb-4" rounded="lg">
                            <v-img :src="barcodeUrl" alt="Barcode" contain height="60">
                            </v-img>
                            <div class="mt-2">{{ memberCode }}</div>
                        </v-card>

                        <!-- Progress Bar -->
                        <div>
                            <div class="d-flex justify-space-between mb-2">
                                <span class="text-white">VÀNG</span>
                                <span class="text-white">KIM CƯƠNG</span>
                            </div>
                            <v-progress-linear v-model="persent" color="warning" height="12" rounded>
                                <template v-slot:default="{ value }">
                                    <div class="position-relative w-100 h-100">
                                        <v-sheet class="rounded-circle position-absolute" color="white" width="12"
                                            height="12" style="left: 0; top: 50%; transform: translateY(-50%)">
                                        </v-sheet>
                                        <v-sheet class="rounded-circle position-absolute" color="white" width="12"
                                            height="12"
                                            :style="{ left: `${value - 13}%`, top: '50%', transform: 'translateY(-50%)' }">
                                        </v-sheet>
                                        <v-sheet class="rounded-circle position-absolute" color="white" width="12"
                                            height="12" style="right: 0; top: 50%; transform: translateY(-50%)">
                                        </v-sheet>
                                    </div>
                                </template>
                            </v-progress-linear>
                        </div>
                    </v-card>

                    <!-- Navigation Menu -->
                    <v-list class="rounded-lg" elevation="2">
                        <v-list-item v-for="(item, i) in menuItems" :key="i" :active="select === i + 1"
                            @click="handleMenuClick(i + 1)" :color="select === i + 1 ? 'primary' : undefined"
                            class="py-3">
                            <template v-slot:prepend>
                                <v-img :src="item.icon" :opacity="select === i + 1 ? 1 : 0.7" width="20" class="me-2" />
                            </template>
                            <v-list-item-title :class="{
                                'text-primary': select === i + 1,
                                'font-weight-medium': select === i + 1,
                                'text-medium-emphasis': select !== i + 1
                            }">
                                {{ item.title }}
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>

            <!-- Right Panel -->
            <v-col cols="12" lg="7">
                <v-card class="user-info-right">
                    <v-window v-model="select">
                        <!-- User Info Tab -->
                        <v-window-item :value="1">
                            <UserInfoTab :user-info="userInfomation" @update="handleUpdate" />
                        </v-window-item>

                        <!-- Address Tab -->
                        <v-window-item :value="2">
                            <AddressTab :addresses="listAddresses" @address-updated="handleAddressUpdated" />
                        </v-window-item>

                        <!-- Benefits Tab -->
                        <v-window-item :value="3">
                            <BenefitsTab />
                        </v-window-item>

                        <!-- Order History Tab -->
                        <v-window-item :value="4">
                            <OrderHistoryTab :orders="listOrders" @order-status-updated="handleOrderStatusUpdated" />
                        </v-window-item>
                    </v-window>
                </v-card>
            </v-col>
        </v-row>

    </v-container>
</template>

<script>
import { userAPI } from "@/api/user";
import { useAuthStore } from "@/stores/auth";
import { useAddressStore } from "@/stores/address";
import { useNotificationStore } from "@/stores/notification";
import UserInfoTab from './tabs/UserInfoTab.vue'
import AddressTab from './tabs/AddressTab.vue'
import BenefitsTab from './tabs/BenefitsTab.vue'
import OrderHistoryTab from './tabs/OrderHistoryTab.vue'
import JsBarcode from 'jsbarcode'


// Import icons
import userIcon from '@/assets/icons/user-icon.svg'
import addressBookIcon from '@/assets/icons/address-book.svg'
import benefitIcon from '@/assets/icons/member-benefit.svg'
import orderHistoryIcon from '@/assets/icons/history-order.svg'

export default {
    name: "UserInfo",

    components: {
        UserInfoTab,
        AddressTab,
        BenefitsTab,
        OrderHistoryTab,
    },

    setup() {
        const notificationStore = useNotificationStore()
        const authStore = useAuthStore()
        const addressStore = useAddressStore()
        return {
            notificationStore,
            authStore,
            addressStore
        }
    },

    data() {
        return {
            persent: 0,
            select: 1,
            search: '',
            bean: 0,
            menuItems: [
                {
                    icon: userIcon,
                    title: 'Thông tin tài khoản',
                    route: 'user-info'
                },
                {
                    icon: addressBookIcon,
                    title: 'Sổ địa chỉ',
                    route: 'so-dia-chi'
                },
                {
                    icon: benefitIcon,
                    title: 'Quyền lợi thành viên',
                    route: 'quyen-loi'
                },
                {
                    icon: orderHistoryIcon,
                    title: 'Lịch sử mua hàng',
                    route: 'lich-su'
                }
            ],
            userInfomation: {},
            listOrders: [],
            listAddresses: [],
            loading: false,
            memberCode: 'M162357905',
            barcodeUrl: '',
        }
    },

    mounted() {
        this.generateBarcode()
    },

    computed: {
        // Tạo mã QR từ dữ liệu của người dùng
        qrValue() {
            return JSON.stringify({
                id: this.userInfomation.id,
                phone: this.userInfomation.mobile_no,
                name: `${this.userInfomation.last_name} ${this.userInfomation.first_name}`,
                rank: 'VÀNG',
                bean: this.bean,
                memberCode: 'M162357905'
            })
        }
    },

    created() {
        this.initializeUserData()
    },

    methods: {
        async initializeUserData() {
            try {
                const userData = this.authStore.userInfo
                if (!userData) {
                    this.$router.push('/')
                    return
                }
                this.userInfomation = userData

                await Promise.all([
                    this.getAddresses(userData.id),
                    this.getOrders(userData.id)
                ])
            } catch (error) {
                this.notificationStore.error('Không thể tải thông tin người dùng', 3000)
                console.error('Lỗi khi khởi tạo dữ liệu:', error)
            }
        },

        // Lấy danh sách địa chỉ của người dùng
        async getAddresses(userId) {
            try {
                const response = await userAPI.getAddressNote({ user_id: userId })
                this.addressStore.setAddressNote(response.data.address_note)
                this.listAddresses = this.addressStore.addressNote
                const defaultAddress = this.listAddresses.find(address => address.is_default)
                if (defaultAddress) {
                    this.addressStore.updateAddress(defaultAddress.address)
                }
            } catch (error) {
                this.notificationStore.error('Không thể tải danh sách địa chỉ', 3000)
                console.error('Lỗi khi lấy địa chỉ:', error)
            }
        },

        // Lấy danh sách đơn hàng của người dùng
        async getOrders(userId) {
            try {
                const response = await userAPI.getOrdersUser({ user_id: userId })
                this.listOrders = response.data.orders
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    this.notificationStore.info('Bạn chưa có lịch sử mua hàng', 3000)
                    this.listOrders = [] // Đảm bảo mảng rỗng khi không có đơn hàng
                } else {
                    this.notificationStore.error('Không thể tải lịch sử đơn hàng', 3000)
                }
                console.error('Lỗi khi lấy đơn hàng:', error)
            }
        },

        // Chuyển đến trang tương ứng với item trong menu
        handleMenuClick(index) {
            this.select = index
            const route = this.menuItems[index - 1].route
            this.$router.push({
                name: 'UserInfo',
                params: { name: route }
            })
        },

        // Cập nhật thông tin của người dùng
        async handleUpdate(updatedInfo) {
            this.loading = true
            try {
                const response = await userAPI.updateInfo(updatedInfo)
                this.userInfomation = { ...this.userInfomation, ...updatedInfo }
                if (response.data?.userInfo) {
                    this.authStore.updateUser(response.data.userInfo)
                }
                this.notificationStore.success('Cập nhật thông tin thành công', 3000)
            } catch (error) {
                console.error('Lỗi khi cập nhật thông tin:', error)
                this.notificationStore.error('Có lỗi xảy ra khi cập nhật thông tin', 3000)
            } finally {
                this.loading = false
            }
        },

        // Tạo mã barcode từ dữ liệu của người dùng
        generateBarcode() {
            const canvas = document.createElement('canvas')
            JsBarcode(canvas, this.memberCode, {
                format: "CODE128",
                width: 2,
                height: 100,
                displayValue: false
            })
            this.barcodeUrl = canvas.toDataURL("image/png")
        },

        async handleAddressUpdated() {
            await this.getAddresses(this.userInfomation.id);
        },

        async handleOrderStatusUpdated(orderId, status) {
            await this.getOrders(this.userInfomation.id);
            this.listOrders = this.listOrders.map(order => {
                if (order.id === orderId) {
                    order.status = status;
                }
                return order;
            });
        }
    },

    watch: {
        // Theo dõi sự thay đổi của route params
        '$route.params.name': {
            immediate: true,
            handler(newName) {
                switch (newName) {
                    case 'user-info':
                        this.select = 1
                        break
                    case 'so-dia-chi':
                        this.select = 2
                        break
                    case 'quyen-loi':
                        this.select = 3
                        break
                    case 'lich-su':
                        this.select = 4
                        break
                    default:
                        this.select = 1
                }
            }
        }
    }
}
</script>

<style scope></style>