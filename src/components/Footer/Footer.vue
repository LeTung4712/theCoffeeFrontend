<template>
  <v-footer class="footer bg-black" role="contentinfo" aria-label="Footer">
    <v-container>
      <v-row>
        <!-- Cột thông tin liên hệ -->
        <v-col cols="12" md="6">
          <h3 class="text-h6 text-white font-weight-bold mb-2" id="company-info">The Coffee Shop</h3>
          <div class="text-caption text-white" aria-labelledby="company-info">
            <p>Hotline đặt hàng: <a href="tel:18006936" class="text-white text-decoration-none" aria-label="Gọi hotline đặt hàng 1800 6936">1800 6936</a></p>
            <p>Địa chỉ: 123 Đại Cồ Việt, Quận Hai Bà Trưng, Hà Nội</p>
            <p>Email: <a href="mailto:hi@thecoffeeshop.com"
                class="text-white text-decoration-none" aria-label="Gửi email đến hi@thecoffeeshop.com">hi@thecoffeeshop.com</a></p>
          </div>
        </v-col>

        <!-- Cột liên kết nhanh -->
        <v-col cols="12" md="3">
          <h3 class="text-subtitle-1 text-white font-weight-bold mb-2" id="quick-links">Liên kết</h3>
          <nav role="navigation" aria-labelledby="quick-links">
            <v-list density="compact" class="bg-transparent pa-0" role="list">
              <v-list-item v-for="item in quickLinks" :key="item.title" :title="item.title" :to="item.to"
                class="text-white px-0" density="compact" role="listitem"
                :aria-label="`Đi đến trang ${item.title}`"></v-list-item>
            </v-list>
          </nav>
        </v-col>

        <!-- Cột mạng xã hội -->
        <v-col cols="12" md="3">
          <h3 class="text-subtitle-1 text-white font-weight-bold mb-2" id="social-links">Kết nối với chúng tôi</h3>
          <div class="d-flex flex-column" role="group" aria-labelledby="social-links">
            <v-btn variant="text" color="white" href="https://www.facebook.com/The.Coffee.House.2014/"
              class="mb-2 justify-start" aria-label="Theo dõi chúng tôi trên Facebook" target="_blank"
              rel="noopener noreferrer">
              <v-icon class="mr-2">mdi-facebook</v-icon>
              Facebook
            </v-btn>
            <v-btn variant="text" color="white" href="https://www.instagram.com/thecoffeehousevn/" class="justify-start"
              aria-label="Theo dõi chúng tôi trên Instagram" target="_blank" rel="noopener noreferrer">
              <v-icon class="mr-2">mdi-instagram</v-icon>
              Instagram
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-3 bg-white" role="separator" aria-hidden="true"></v-divider>

      <!-- Copyright -->
      <div class="text-center text-caption text-white" role="contentinfo">
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