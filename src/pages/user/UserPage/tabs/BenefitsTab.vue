<template>
  <div class="benefits-tab">
    <v-container>
      <!-- Header Section -->
      <div class="text-center mb-8">
        <h2 class="text-h4 font-weight-bold mb-2">Quyền lợi thành viên</h2>
        <p class="text-subtitle-1 text-medium-emphasis">Khám phá những đặc quyền dành riêng cho bạn</p>
      </div>

      <!-- Benefits Grid -->
      <v-row>
        <!-- Bronze Level -->
        <v-col cols="12" md="4">
          <v-card class="benefit-card h-100" elevation="2">
            <v-card-item>
              <template v-slot:prepend>
                <v-icon size="48" color="grey-lighten-1">mdi-medal</v-icon>
              </template>
              <v-card-title class="text-h5">Hạng Bạc</v-card-title>
              <v-card-subtitle>0 - 99 bean</v-card-subtitle>
            </v-card-item>

            <v-card-text>
              <v-list density="compact">
                <v-list-item prepend-icon="mdi-check-circle" title="Giảm giá 5% cho mọi đơn hàng"></v-list-item>
                <v-list-item prepend-icon="mdi-check-circle" title="Nhận thông báo ưu đãi"></v-list-item>
                <v-list-item prepend-icon="mdi-check-circle" title="Tích điểm mua hàng"></v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Silver Level -->
        <v-col cols="12" md="4">
          <v-card class="benefit-card h-100" elevation="3">
            <v-card-item>
              <template v-slot:prepend>
                <v-icon size="48" color="orange-lighten-1">mdi-medal</v-icon>
              </template>
              <v-card-title class="text-h5">Hạng Vàng</v-card-title>
              <v-card-subtitle>100 - 499 bean</v-card-subtitle>
            </v-card-item>

            <v-card-text>
              <v-list density="compact">
                <v-list-item prepend-icon="mdi-check-circle" title="Giảm giá 10% cho mọi đơn hàng"></v-list-item>
                <v-list-item prepend-icon="mdi-check-circle" title="Ưu đãi sinh nhật đặc biệt"></v-list-item>
                <v-list-item prepend-icon="mdi-check-circle" title="Tặng quà mỗi tháng"></v-list-item>
                <v-list-item prepend-icon="mdi-check-circle" title="Ưu tiên đặt bàn"></v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Gold Level -->
        <v-col cols="12" md="4">
          <v-card class="benefit-card h-100" elevation="4">
            <v-card-item>
              <template v-slot:prepend>
                <v-icon size="48" color="blue-darken-2">mdi-medal</v-icon>
              </template>
              <v-card-title class="text-h5">Hạng Kim Cương</v-card-title>
              <v-card-subtitle>Từ 500 bean</v-card-subtitle>
            </v-card-item>

            <v-card-text>
              <v-list density="compact">
                <v-list-item prepend-icon="mdi-check-circle" title="Giảm giá 15% cho mọi đơn hàng"></v-list-item>
                <v-list-item prepend-icon="mdi-check-circle" title="Quà tặng sinh nhật cao cấp"></v-list-item>
                <v-list-item prepend-icon="mdi-check-circle" title="Ưu đãi đặc biệt mỗi tháng"></v-list-item>
                <v-list-item prepend-icon="mdi-check-circle" title="Đặt bàn ưu tiên VIP"></v-list-item>
                <v-list-item prepend-icon="mdi-check-circle" title="Tham gia sự kiện đặc biệt"></v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Current Status -->
      <v-card class="mt-8" color="primary" theme="dark">
        <v-card-text>
          <div class="d-flex align-center">
            <v-icon size="32" class="me-4">mdi-account-star</v-icon>
            <div>
              <h3 class="text-h6 mb-1">Trạng thái hiện tại</h3>
              <p class="mb-0">Bạn đang là thành viên {{ currentLevel }} với {{ currentPoints }} điểm</p>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- How to Earn Points -->
      <v-card class="mt-6">
        <v-card-title class="text-h6">
          <v-icon class="me-2">mdi-star</v-icon>
          Cách tích điểm
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary">mdi-currency-usd</v-icon>
              </template>
              <v-list-item-title>1 điểm = 10.000đ chi tiêu</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary">mdi-calendar-check</v-icon>
              </template>
              <v-list-item-title>Điểm được cộng vào tài khoản sau 24h</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary">mdi-clock-outline</v-icon>
              </template>
              <v-list-item-title>Điểm có hiệu lực trong 12 tháng</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'BenefitsTab',
  data() {
    return {
      currentLevel: 'Bạc',
      currentPoints: 250
    }
  }
}
</script>

<style scoped>
.benefit-card {
  transition: transform 0.3s ease;
}

.benefit-card:hover {
  transform: translateY(-5px);
}

.v-card-title {
  font-weight: 600;
}

.v-list-item {
  min-height: 40px;
}
</style>