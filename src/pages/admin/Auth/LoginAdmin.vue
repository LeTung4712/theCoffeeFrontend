<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-5 rounded-lg">
          <v-img cover height="200"
            src="https://order.thecoffeehouse.com/_nuxt/img/thumbnail-login-pop-up.e10d0dd.png"></v-img>

          <v-card-text class="text-center pt-4">
            <h2 class="text-h5 mb-2">The Coffee Shop Bách Khoa</h2>
            <p class="text-subtitle-1 mb-4">Login for admin</p>

            <v-form @submit.prevent="handleLogin">
              <v-text-field v-model="admin.email" label="Email" type="email" :rules="[rules.required, rules.email]"
                variant="outlined" density="comfortable"></v-text-field>

              <v-text-field v-model="admin.password" label="Mật khẩu" :type="showPassword ? 'text' : 'password'"
                :rules="[rules.required]" variant="outlined" density="comfortable"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"></v-text-field>

              <v-btn block color="red" size="large" type="submit" :loading="loading">
                Đăng nhập
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useNotificationStore } from '@/stores/notification';
import { useAuthStore } from '@/stores/auth';

export default {
  name: "LoginAdmin",

  setup() {
    const notificationStore = useNotificationStore();
    const authStore = useAuthStore();
    return { notificationStore, authStore }
  },

  data: () => ({
    admin: {
      email: "",
      password: "",
    },
    showPassword: false,
    loading: false,
    rules: {
      required: v => !!v || 'Trường này là bắt buộc',
      email: v => /.+@.+\..+/.test(v) || 'Email không hợp lệ'
    }
  }),

  methods: {
    async handleLogin() {
      // Validate form trước khi gửi request
      if (!this.admin.email || !this.admin.password) {
        this.notificationStore.warning('Vui lòng nhập đầy đủ thông tin đăng nhập', 3000)
        return
      }

      if (!/.+@.+\..+/.test(this.admin.email)) {
        this.notificationStore.warning('Email không hợp lệ', 3000)
        return
      }

      this.loading = true
      try {
        // Gọi API login thông qua auth store
        await this.authStore.loginAdmin({
          username: this.admin.email,
          password: this.admin.password
        })

        // Nếu login thành công
        this.notificationStore.success('Đăng nhập thành công', 3000)

        // Chuyển hướng đến trang admin
        this.$router.push('/admin')
      } catch (error) {
        // Xử lý các loại lỗi khác nhau
        if (error.response) {
          switch (error.response.status) {
            case 401:
              this.notificationStore.error('Email hoặc mật khẩu không đúng', 3000)
              break
            case 403:
              this.notificationStore.error('Tài khoản không có quyền truy cập', 3000)
              break
            case 429:
              this.notificationStore.error('Quá nhiều yêu cầu đăng nhập. Vui lòng thử lại sau', 3000)
              break
            default:
              this.notificationStore.error('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau', 3000)
          }
        } else if (error.request) {
          // Không nhận được response từ server
          this.notificationStore.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng', 3000)
        } else {
          // Lỗi khác
          this.notificationStore.error('Có lỗi xảy ra. Vui lòng thử lại sau', 3000)
        }
      } finally {
        this.loading = false
        // Reset password field sau khi login
        this.admin.password = ""
      }
    }
  },

  // Thêm mounted hook để kiểm tra nếu đã đăng nhập thì chuyển hướng
  mounted() {
    if (this.authStore.isAdminLoggedIn) {
      this.$router.push('/admin')
    }
  }
};
</script>