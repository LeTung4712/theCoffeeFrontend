<template>
    <v-container class="py-8">
        <v-row>
            <v-col cols="12">
                <h1 class="text-h3 text-center font-weight-bold text-primary mb-6">
                    Cửa Hàng Của Chúng Tôi
                </h1>
            </v-col>
        </v-row>

        <!-- Bản đồ -->
        <v-row class="mb-8">
            <v-col cols="12">
                <v-card class="pa-4">
                    <div class="text-h5 mb-4">Bản Đồ Chi Nhánh</div>
                    <div class="map-container">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.6244699999997!2d105.843056!3d21.006389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4e5e5e5e5e%3A0x1234567890abcdef!2zSMOyYSBCw6FjaCBLaG9hIEjhu5MgTmjhuq1p!5e0!3m2!1svi!2s!4v1234567890"
                            width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <!-- Danh sách chi nhánh -->
        <v-row>
            <v-col v-for="(store, index) in stores" :key="index" cols="12" md="6" lg="4">
                <v-card class="h-100" elevation="3" hover>
                    <v-img :src="store.image" height="200" cover class="align-end">
                        <v-card-title class="text-white text-shadow">
                            {{ store.name }}
                        </v-card-title>
                    </v-img>

                    <v-card-text>
                        <div class="d-flex align-center mb-2">
                            <v-icon color="primary" class="mr-2">mdi-map-marker</v-icon>
                            <span>{{ store.address }}</span>
                        </div>
                        <div class="d-flex align-center mb-2">
                            <v-icon color="primary" class="mr-2">mdi-phone</v-icon>
                            <span>{{ store.phone }}</span>
                        </div>
                        <div class="d-flex align-center mb-2">
                            <v-icon color="primary" class="mr-2">mdi-clock-outline</v-icon>
                            <span>{{ store.hours }}</span>
                        </div>
                        <div class="d-flex align-center">
                            <v-icon color="primary" class="mr-2">mdi-email</v-icon>
                            <span>{{ store.email }}</span>
                        </div>
                    </v-card-text>

                    <v-card-actions>
                        <v-btn color="primary" variant="text" :href="store.mapLink" target="_blank">
                            Xem trên bản đồ
                        </v-btn>
                        <v-btn color="primary" variant="text" :href="'tel:' + store.phone">
                            Gọi ngay
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'StorePage',

    data() {
        return {
            stores: [
                {
                    name: 'Chi Nhánh Hai Bà Trưng',
                    address: '123 Đường Đại Cồ Việt, Quận Hai Bà Trưng, Hà Nội',
                    phone: '1800 6936',
                    hours: '10:00 - 22:00',
                    email: 'hbtrung@thecoffeeshop.com',
                    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
                    mapLink: 'https://www.google.com/maps/place/%C4%90%E1%BA%A1i+H%E1%BB%8Dc+B%C3%A1ch+Khoa+H%C3%A0+N%E1%BB%99i/@21.0061832,105.8431307,17z/data=!3m1!4b1!4m6!3m5!1s0x3135ac71294bf0ab:0xc7e2d20e5e04a9da!8m2!3d21.0061832!4d105.8431307!16s%2Fm%2F027jq68?entry=ttu&g_ep=EgoyMDI1MDUyOC4wIKXMDSoASAFQAw%3D%3D'
                },
                {
                    name: 'Chi Nhánh Cầu Giấy',
                    address: '456 Đường Láng Hạ, Quận Cầu Giấy, Hà Nội',
                    phone: '(024) 8765 4321',
                    hours: '10:00 - 22:00',
                    email: 'caugiay@thecoffeeshop.com',
                    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80',
                    mapLink: 'https://www.google.com/maps/place/Trung+t%C3%A2m+Chi%E1%BA%BFu+phim+Qu%E1%BB%91c+gia/@21.0165942,105.8150848,19.75z/data=!4m14!1m7!3m6!1s0x3135ac71294bf0ab:0xc7e2d20e5e04a9da!2zxJDhuqFpIEjhu41jIELDoWNoIEtob2EgSMOgIE7hu5lp!8m2!3d21.0061832!4d105.8431307!16s%2Fm%2F027jq68!3m5!1s0x3135ab9ef82fed13:0x1ee04aa292e377a2!8m2!3d21.0168438!4d105.8156256!16s%2Fg%2F11f08fxfdq?entry=ttu&g_ep=EgoyMDI1MDUyOC4wIKXMDSoASAFQAw%3D%3D'
                },
                {
                    name: 'Chi Nhánh Tây Hồ',
                    address: '789 Đường Xuân La, Quận Tây Hồ, Hà Nội',
                    phone: '(024) 9876 5432',
                    hours: '10:00 - 22:00',
                    email: 'tayho@thecoffeeshop.com',
                    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
                    mapLink: 'https://www.google.com/maps/place/Ch%E1%BB%A3+Xu%C3%A2n+La/@21.0636332,105.8070307,20.26z/data=!4m14!1m7!3m6!1s0x3135ac71294bf0ab:0xc7e2d20e5e04a9da!2zxJDhuqFpIEjhu41jIELDoWNoIEtob2EgSMOgIE7hu5lp!8m2!3d21.0061832!4d105.8431307!16s%2Fm%2F027jq68!3m5!1s0x3135aae7330dfb25:0xb57cf414ae163f98!8m2!3d21.063814!4d105.8074067!16s%2Fg%2F11bx5_q7l3?entry=ttu&g_ep=EgoyMDI1MDUyOC4wIKXMDSoASAFQAw%3D%3D'
                }
            ]
        }
    }
}
</script>

<style scoped>
.text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.map-container {
    border-radius: 8px;
    overflow: hidden;
}

.v-card {
    transition: transform 0.3s ease-in-out;
}

.v-card:hover {
    transform: translateY(-5px);
}
</style>