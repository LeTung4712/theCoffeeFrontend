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
                                <v-img :src="item.icon" :opacity="select === i + 1 ? 1 : 0.7" width="20" class="me-2"/>
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
                    <!-- Header -->
                    <v-row justify="center" align="center" class="user-info-header ">
                        <v-col cols="12" class="text-center">
                            <div class="d-inline-flex align-center">
                                <v-avatar size="48" class="me-3">
                                    <v-img src="https://order.thecoffeehouse.com/_nuxt/img/user-icon-gold.5f2886d.svg"
                                        alt="User Icon" />
                                </v-avatar>
                                <h2 class="text-h5 font-weight-bold mb-0">Tài khoản của bạn</h2>
                            </div>
                        </v-col>
                    </v-row>

                    <v-window v-model="select">
                        <!-- User Info Tab -->
                        <v-window-item :value="1">
                            <UserInfoTab :user-info="userInfomation" @update="handleUpdate" />
                        </v-window-item>

                        <!-- Address Tab -->
                        <v-window-item :value="2">
                            <AddressTab :addresses="listAddresses" />
                        </v-window-item>

                        <!-- Benefits Tab -->
                        <v-window-item :value="3">
                            <BenefitsTab />
                        </v-window-item>

                        <!-- Order History Tab -->
                        <v-window-item :value="4">
                            <OrderHistoryTab :orders="listOrders" :search="search" @update:search="search = $event" />
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
        return {
            notificationStore,
            authStore
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
            userInfomation: {
                id: "",
                last_name: "",
                first_name: "",
                mobile_no: "",
                birth: "",
                email: "",
                gender: "male"
            },
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
        membershipCardStyle() {
            return {
                background: 'linear-gradient(rgb(255, 149, 34) 0%, rgb(218, 84, 9) 50%)'
            }
        },

        filteredOrders() {
            return this.listOrders.filter(order =>
                order.order_id.toLowerCase().includes(this.search.toLowerCase())
            )
        },

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
            const userData = this.authStore.userInfo
            this.userInfomation = userData
            console.log('user', this.userInfomation)
            if (!userData) {
                this.$router.push('/')
                return
            }
            await Promise.all([
                this.getAddresses(),
                this.getOrders()
            ])
        },

        async getAddresses() {
            const response = await userAPI.getAddressNote()
            this.listAddresses = response.data
        },

        async getOrders() {
            const response = await userAPI.getOrdersUser()
            this.listOrders = response.data
        },

        handleMenuClick(index) {
            this.select = index
            const route = this.menuItems[index - 1].route
            this.$router.push({
                name: 'user',
                params: { name: route }
            })
        },

        async handleUpdate(updatedInfo) {
            this.loading = true
            try {
                await userAPI.updateUserInfo(updatedInfo)
                this.userInfomation = { ...this.userInfomation, ...updatedInfo }
                this.notificationStore.showSuccessNotification('Cập nhật thông tin thành công', 3000)
            } catch (error) {
                console.error('Lỗi khi cập nhật thông tin:', error)
                this.notificationStore.showErrorNotification('Có lỗi xảy ra khi cp nhật thông tin', 3000)
            } finally {
                this.loading = false
            }
        },

        async refreshData() {
            this.loading = true
            try {
                await this.initializeUserData()
                this.notificationStore.showSuccessNotification('Dữ liệu đã được cập nhật', 3000)
            } catch (error) {
                console.error('Lỗi khi làm mới dữ liệu:', error)
                this.notificationStore.showErrorNotification('Có lỗi xảy ra khi lm mới dữ liệu', 3000)
            } finally {
                this.loading = false
            }
        },

        generateBarcode() {
            const canvas = document.createElement('canvas')
            JsBarcode(canvas, this.memberCode, {
                format: "CODE128",
                width: 2,
                height: 100,
                displayValue: false
            })
            this.barcodeUrl = canvas.toDataURL("image/png")
        }
    },

    watch: {
        async select(newValue) {
            if (newValue === 2 || newValue === 4) {
                await this.refreshData()
            }
        }
    }
}
</script>

<style scope>

</style>