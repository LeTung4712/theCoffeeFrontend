<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-5 rounded-lg">
          <v-img
            cover
            height="200"
            src="https://order.thecoffeehouse.com/_nuxt/img/thumbnail-login-pop-up.e10d0dd.png"
          ></v-img>

          <v-card-text class="text-center pt-4">
            <h2 class="text-h5 mb-2">Coffee House Bách Khoa</h2>
            <p class="text-subtitle-1 mb-4">Login for admin</p>
            
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="admin.email"
                label="Email"
                type="email"
                :rules="[rules.required, rules.email]"
                variant="outlined"
                density="comfortable"
              ></v-text-field>

              <v-text-field
                v-model="admin.password"
                label="Mật khẩu"
                :type="showPassword ? 'text' : 'password'"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
              ></v-text-field>

              <v-btn
                block
                color="red"
                size="large"
                type="submit"
                :loading="loading"
              >
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
import { adminAPI } from "@/api/admin";
import { useNotificationStore } from '@/stores/notification';
export default {
  name: "LoginAdmin",
  setup() {
    const notificationStore = useNotificationStore();
    return {
      notificationStore
    }
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
      try {
        this.loading = true;
        const response = await adminAPI.login({
          username: this.admin.email,
          password: this.admin.password
        });
        console.log(response)
        if (!response.data.error) {
          localStorage.setItem("AdminLoggedIn", "true");
          window.dispatchEvent(new CustomEvent('admin-logged-in', {
            detail: { logged_in: true }
          }));
          this.notificationStore.success("Đăng nhập thành công",3000);
          this.$router.push('/admin');
        } else {
          this.notificationStore.error("Sai email hoặc mật khẩu",3000);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          window.alert('Sai email hoặc mật khẩu');
          this.$toast.error('Sai email hoặc mật khẩu');
        } 
      } finally {
        this.loading = false;
        this.admin.password = "";
      }
    }
  }
};
</script>