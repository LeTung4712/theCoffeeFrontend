<template>
    <v-container class="py-8">
        <v-row>
            <v-col cols="12">
                <h1 class="text-h2 text-center font-weight-bold text-primary mb-6">
                    Về Chúng Tôi
                </h1>
            </v-col>
        </v-row>

        <v-row>
            <v-col v-for="(section, index) in sections" :key="index" cols="12" md="6">
                <v-card class="h-100 d-flex flex-column align-center text-center pa-4" elevation="3" hover>
                    <v-avatar color="primary" size="64" class="mb-4">
                        <v-icon size="40" color="white">
                            {{ section.icon }}
                        </v-icon>
                    </v-avatar>

                    <h2 class="text-h5 mb-4">{{ section.title }}</h2>

                    <p class="text-body-1 text-medium-emphasis">
                        {{ section.content }}
                    </p>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'AboutPage',

    data() {
        return {
            sections: [
                {
                    icon: 'mdi-food',
                    title: 'Giới thiệu',
                    content: 'Nhà hàng của chúng tôi tự hào mang đến những trải nghiệm ẩm thực độc đáo, kết hợp giữa hương vị truyền thống và hiện đại. Với không gian sang trọng và phục vụ chuyên nghiệp, chúng tôi cam kết mang đến cho quý khách những bữa ăn đáng nhớ.'
                },
                {
                    icon: 'mdi-history',
                    title: 'Lịch sử phát triển',
                    content: 'Được thành lập từ năm 2010, chúng tôi đã không ngừng phát triển và hoàn thiện để trở thành một trong những nhà hàng hàng đầu. Với hơn 10 năm kinh nghiệm, chúng tôi tự hào phục vụ hàng nghìn khách hàng mỗi năm.'
                },
                {
                    icon: 'mdi-lightbulb',
                    title: 'Tầm nhìn & Sứ mệnh',
                    content: 'Chúng tôi mong muốn trở thành điểm đến ẩm thực hàng đầu, nơi mọi người có thể thưởng thức những món ăn ngon và trải nghiệm dịch vụ chất lượng cao. Sứ mệnh của chúng tôi là mang đến niềm vui và sự hài lòng cho mọi thực khách.'
                },
                {
                    icon: 'mdi-account-group',
                    title: 'Đội ngũ nhân viên',
                    content: 'Đội ngũ nhân viên của chúng tôi được đào tạo chuyên nghiệp, nhiệt tình và giàu kinh nghiệm. Chúng tôi luôn nỗ lực để mang đến dịch vụ tốt nhất cho khách hàng.'
                },
                {
                    icon: 'mdi-email',
                    title: 'Liên hệ',
                    content: 'Địa chỉ: 123 Đường ABC, Quận XYZ, TP. HCM\nĐiện thoại: (028) 1234 5678\nEmail: info@restaurant.com\nGiờ mở cửa: 10:00 - 22:00'
                }
            ]
        }
    }
}
</script>

<style scoped>
.v-card {
    transition: transform 0.3s ease-in-out;
}

.v-card:hover {
    transform: translateY(-5px);
}
</style>