<template>
  <v-footer class="footer bg-black">
    <v-container>
      <v-row>
        <!-- Cột thông tin liên hệ -->
        <v-col cols="12" md="6">
          <h3 class="text-h6 text-white font-weight-bold mb-2">The Coffee Shop</h3>
          <div class="text-caption text-white">
            <p>Hotline đặt hàng: 1800 6936</p>
            <p>Địa chỉ: 123 Đại Cồ Việt, Quận Hai Bà Trưng, Hà Nội</p>
            <p>Email: hi@thecoffeeshop.com</p>
          </div>
        </v-col>

        <!-- Cột liên kết nhanh -->
        <v-col cols="12" md="3">
          <h3 class="text-subtitle-1 text-white font-weight-bold mb-2">Liên kết</h3>
          <v-list density="compact" class="bg-transparent pa-0">
            <v-list-item v-for="item in quickLinks" :key="item.title" :title="item.title" :to="item.to"
              class="text-white px-0" density="compact"></v-list-item>
          </v-list>
        </v-col>

        <!-- Cột mạng xã hội -->
        <v-col cols="12" md="3">
          <h3 class="text-subtitle-1 text-white font-weight-bold mb-2">Kết nối với chúng tôi</h3>
          <div class="d-flex">
            <v-btn icon="mdi-facebook" variant="text" color="white"
              href="https://www.facebook.com/The.Coffee.House.2014/" class="mr-2"></v-btn>
            <v-btn icon="mdi-instagram" variant="text" color="white"
              href="https://www.instagram.com/thecoffeehousevn/"></v-btn>
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-3 bg-white"></v-divider>

      <!-- Copyright -->
      <div class="text-center text-caption text-white">
        © 2023 The Coffee Shop. Tất cả quyền được bảo lưu.
      </div>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      quickLinks: [
        { title: 'Về Chúng Tôi', to: '/ve-chung-toi' },
        { title: 'Sản phẩm', to: '/collections/menu/0' },
        { title: 'Tin tức', to: '/tin-tuc' },
        { title: 'Cửa Hàng', to: '/cua-hang' },
      ]
    }
  }
}
</script>

<style scoped>
.footer {
  position: relative;
  width: 100%;
  margin-top: auto;
}

.v-list-item {
  min-height: 32px !important;
}

@media (max-width: 599px) {
  .footer {
    padding-bottom: 56px;
    /* Thêm padding bottom bằng chiều cao của mobile nav */
  }
}
</style>