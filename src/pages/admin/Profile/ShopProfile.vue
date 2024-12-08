<template>
    <v-container fluid class="down-top-padding">
        <v-row style="background-color: white">
            <v-col cols="12" lg="4">
                <v-card>
                    <v-card-text class="text-center pa-7">
                        <v-img
                            :src="logo"
                            alt="user"
                            width="300"
                            class="mx-auto shadow-sm"
                        />
                        <v-card-title class="justify-center mt-2">The XinhLounge</v-card-title>
                        <v-card-subtitle>Bách Khoa</v-card-subtitle>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" lg="8">
                <v-card flat>
                    <v-card-title class="store_infor text-h4 font-weight-medium">
                        Thông tin cửa hàng
                    </v-card-title>

                    <v-card-text>
                        <v-form>
                            <v-row>
                                <v-col cols="12" md="8">
                                    <v-text-field
                                        v-model="shopInfo.name"
                                        label="Tên cửa hàng"
                                        readonly
                                        variant="outlined"
                                        density="comfortable"
                                    />

                                    <v-text-field
                                        v-model="shopInfo.phone"
                                        label="Số điện thoại"
                                        readonly
                                        variant="outlined"
                                        density="comfortable"
                                    />

                                    <v-text-field
                                        v-model="shopInfo.email"
                                        label="Email"
                                        readonly
                                        variant="outlined"
                                        density="comfortable"
                                    />

                                    <v-text-field
                                        v-model="shopInfo.address"
                                        label="Địa chỉ"
                                        readonly
                                        variant="outlined"
                                        density="comfortable"
                                    />
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import logoImage from '@/assets/logo.png'
export default {
    name: "ShopProfile",
    
    data() {
        return {
            logo: logoImage,
            shopInfo: {
                name: "The Coffee Bách Khoa",
                phone: "0828035636",
                email: "iamrobordiy@gmail.com",
                address: "Số 1 Đại Cồ Việt, Bách Khoa, Hai Bà Trưng, Hà Nội"
            }
        }
    },

    created() {
        this.checkAuth()
    },

    methods: {
        checkAuth() {
            if (localStorage.getItem("AdminLoggedIn") === "false") {
                this.$router.push("/admin/login")
            }
        }
    }
}
</script>

<style scoped>
.store_infor {
    text-align: left;
    position: relative;
}

.store_infor::before {
    content: "";
    position: absolute;
    width: 60%;
    bottom: -5px;
    left: 0;
    border-bottom: 2px solid #fa8c16;
}

:deep(.v-text-field) {
    max-width: 500px;
}
</style>