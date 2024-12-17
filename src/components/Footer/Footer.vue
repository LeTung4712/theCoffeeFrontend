<template>
  <v-footer class="bg-black">
    <v-container>
      <v-row>
        <!-- Cột Giới thiệu -->
        <v-col cols="12" sm="6" md="3">
          <h3 class="text-h6 text-white font-weight-bold mb-4">Giới thiệu</h3>
          <v-list density="compact" class="bg-transparent pa-0">
            <v-list-item v-for="(item, i) in introLinks" :key="i"
              :title="item.title"
              :href="item.href"
              class="text-white px-0"
              density="compact"
            >
            </v-list-item>
          </v-list>
        </v-col>

        <!-- Cột Điều khoản -->
        <v-col cols="12" sm="6" md="3">
          <h3 class="text-h6 text-white font-weight-bold mb-4">Điều khoản</h3>
          <v-list density="compact" class="bg-transparent pa-0">
            <v-list-item v-for="(item, i) in termsLinks" :key="i"
              :title="item.title"
              :href="item.href"
              class="text-white px-0"
              density="compact"
            >
            </v-list-item>
          </v-list>
        </v-col>

        <!-- Cột Liên hệ -->
        <v-col cols="12" sm="6" md="3">
          <div class="contact-info">
            <v-list density="compact" class="bg-transparent pa-0">
              <v-list-item prepend-icon="mdi-phone" class="text-white px-0">
                Đặt hàng: 1800 6936
              </v-list-item>
              <v-list-item prepend-icon="mdi-map-marker" class="text-white px-0">
                Liên hệ
              </v-list-item>
            </v-list>
            
            <p class="text-body-2 text-white mt-4">
              Tầng 3-4 Hub Building<br>
              195/10E Điện Biên Phủ, P.15,<br>
              Q.Bình Thạnh, TP.Hồ Chí Minh
            </p>
          </div>
        </v-col>

        <!-- Cột Mạng xã hội -->
        <v-col cols="12" sm="6" md="3">
          <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FThe.Coffee.House.2014&tabs=timeline&width=270&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId" 
            width="100%" 
            height="130" 
            class="border-0">
          </iframe>
          
          <v-row class="mt-4" no-gutters>
            <v-col cols="auto" class="mr-4">
              <v-btn icon="mdi-facebook" variant="text" color="white" href="https://www.facebook.com/The.Coffee.House.2014/"></v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn icon="mdi-instagram" variant="text" color="white" href="https://www.instagram.com/thecoffeehousevn/"></v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-divider class="my-4 bg-white"></v-divider>

      <!-- Footer bottom -->
      <v-row>
        <v-col cols="12" md="9">
          <div class="text-caption text-white">
            <p>Công ty cổ phần thương mại dịch vụ Trà Cà Phê VN</p>
            <p>Mã số DN: 0312867172 do sở kế hoạch và đầu tư tp. HCM cấp ngày 23/07/2014. Người đại diện: NGÔ NGUYÊN KHA</p>
            <p>Địa chỉ: 86-88 Cao Thắng, phường 04, quận 3, tp Hồ Chí Minh - Điện thoại: (028) 7107 8079 - Email: hi@thecoffeehouse.vn</p>
            <p>© 2014-2022 Công ty cổ phần thương mại dịch vụ Trà Cà Phê VN mọi quyền bảo lưu</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      introLinks: [
        { title: 'Về Chúng Tôi', href: '/about' },
        { title: 'Sản phẩm', href: '/collections/menu' },
        { title: 'Khuyến mại', href: '/promotion' },
        { title: 'Chuyện cà phê', href: '/blogs' },
        { title: 'Cửa Hàng', href: '/store' },
        { title: 'Tuyển dụng', href: '/job' },
      ],
      termsLinks: [
        { title: 'Điều khoản sử dụng', href: '/terms' },
        { title: 'Chính sách bảo mật thông tin', href: '/privacy' },
      ]
    }
  }
}
</script>

<style scoped>
.v-list-item {
  min-height: 32px !important;
}

.v-list-item__prepend {
  margin-right: 8px !important;
}
</style>