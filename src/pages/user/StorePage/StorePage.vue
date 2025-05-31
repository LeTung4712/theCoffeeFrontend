<template>
    <v-container class="py-8">
        <v-row>
            <v-col cols="12">
                <h1 class="text-h2 text-center font-weight-bold text-primary mb-6">
                    Chi Nhánh Của Chúng Tôi
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
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241676507!2d106.6986!3d10.7756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzMyLjEiTiAxMDbCsDQxJzU0LjkiRQ!5e0!3m2!1svi!2s!4v1234567890"
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
                    name: 'Chi Nhánh Quận 1',
                    address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
                    phone: '(028) 1234 5678',
                    hours: '10:00 - 22:00',
                    email: 'q1@restaurant.com',
                    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
                    mapLink: 'https://goo.gl/maps/your-location-1'
                },
                {
                    name: 'Chi Nhánh Quận 7',
                    address: '456 Đường Nguyễn Thị Thập, Quận 7, TP.HCM',
                    phone: '(028) 8765 4321',
                    hours: '10:00 - 22:00',
                    email: 'q7@restaurant.com',
                    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80',
                    mapLink: 'https://goo.gl/maps/your-location-2'
                },
                {
                    name: 'Chi Nhánh Quận 2',
                    address: '789 Đường Thảo Điền, Quận 2, TP.HCM',
                    phone: '(028) 9876 5432',
                    hours: '10:00 - 22:00',
                    email: 'q2@restaurant.com',
                    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
                    mapLink: 'https://goo.gl/maps/your-location-3'
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