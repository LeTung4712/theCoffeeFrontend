<template>
  <v-dialog v-model="dialog" max-width="420" :scrim="true">
    <v-card class="rounded-lg">
      <!-- Phần ảnh header -->
      <v-img src="https://order.thecoffeehouse.com/_nuxt/img/thumbnail-login-pop-up.e10d0dd.png" height="200" cover />

      <!-- Form đăng nhập -->
      <v-card-item v-show="!loginHidden" class="text-center">
        <v-card-title class="text-body-1 mb-2">
          Chào mừng bạn đến với
        </v-card-title>
        <v-img src="@/assets/logo.png" alt="Logo" class="mx-auto mb-6" width="65%" />

        <v-form @submit.prevent="handleLogin">
          <v-sheet class="d-flex align-center mb-4 bg-grey-lighten-4 rounded">
            <div class="px-3 py-2 border-r d-flex align-center">
              <v-img src="@/assets/flag-vietnam.svg" width="24" class="me-2" />
              <span>+84</span>
            </div>
            <v-text-field v-model="data.mobile_no" placeholder="Nhập số điện thoại" variant="plain" hide-details
              density="compact" class="flex-grow-1 phone-input" />
          </v-sheet>

          <v-btn type="submit" block color="primary" rounded="pill" :loading="loading">
            Đăng nhập
          </v-btn>
        </v-form>
      </v-card-item>

      <!-- Form OTP -->
      <v-card-item v-show="otpActive" class="text-center">
        <v-card-title class="text-body-1 mb-2">
          Xác thực mã OTP
        </v-card-title>
        <v-card-text>
          <p class="mb-2">
            Một mã xác thực gồm 6 số đã được gửi đến số điện thoại
            <span class="font-weight-bold">{{ data.mobile_no }}</span>
          </p>
          <p>Nhập mã để tiếp tục</p>
        </v-card-text>

        <v-form @submit.prevent="sendOTP">
          <v-row justify="space-around" no-gutters class="mb-4">
            <v-col v-for="n in 6" :key="n" cols="auto">
              <v-text-field :ref="'otpInput' + n" v-model="otpDigits[n - 1]" type="tel" maxlength="1" class="otp-input"
                variant="outlined" hide-details width="44" @keydown="handleOtpKeydown($event, n)"
                @input="handleOtpInput(n)" />
            </v-col>
          </v-row>

          <v-row align="center" justify="center" class="mb-4">
            <span>Bạn không nhận được mã?</span>
            <v-btn variant="text" color="primary" class="ms-2 resend-btn" :disabled="loading || countdown > 0"
              @click="resendOTP">
              {{ countdown > 0 ? `Gửi lại (${countdown}s)` : 'Gửi lại' }}
            </v-btn>
          </v-row>

          <v-btn type="submit" block color="primary" rounded="pill" :loading="loading">
            Xác nhận
          </v-btn>
        </v-form>
      </v-card-item>

      <!-- Hiển thị lỗi -->
      <v-snackbar v-model="showError" color="error" timeout="3000">
        {{ errorMessage }}
      </v-snackbar>
    </v-card>
  </v-dialog>
</template>

<script>
import { userAPI } from "@/api/user";
import { useNotificationStore } from '@/stores/notification';
import { useAuthStore } from '@/stores/auth'

export default {
  name: "LoginPopup",

  emits: ['login-success'],

  data: () => ({
    dialog: false,
    otpActive: false,
    loginHidden: false,
    showError: false,
    loading: false,
    data: {
      mobile_no: '',
      otp: '',
    },
    otpDigits: Array(6).fill(''),
    user: null,
    errorMessage: '',
    countdown: 0,
    timer: null,
  }),

  watch: {
    // Reset form khi đóng dialog
    dialog(newVal) {
      if (!newVal) {
        this.resetForm();
      }
    }
  },
  methods: {
    // Thêm phương thức validate số điện thoại
    validatePhoneNumber(phone) {
      if (!phone) return false;
      const numberOnly = phone.replace(/\D/g, '');

      // Kiểm tra xem chuỗi có chứa ký tự không phải số không
      if (phone !== numberOnly) {
        return false;
      }

      // Kiểm tra độ dài số điện thoại (10 số, tính cả số 0)
      if (numberOnly.startsWith('0')) {
        return numberOnly.length === 10;
      }
    },

    // Xử lý chuyển sang màn hình OTP sau khi gửi số điện thoại
    handleLogin() {
      const notificationStore = useNotificationStore();

      // Kiểm tra số điện thoại trống
      if (!this.data.mobile_no) {
        notificationStore.error('Vui lòng nhập số điện thoại', 3000);
        return;
      }

      // Kiểm tra định dạng số điện thoại
      if (!this.validatePhoneNumber(this.data.mobile_no)) {
        notificationStore.error('Số điện thoại không hợp lệ. Vui lòng nhập đúng số điện thoại Việt Nam (10 số)', 3000);
        return;
      }

      this.sendPhoneNumber();
    },

    // Gửi số điện thoại để nhận OTP
    async sendPhoneNumber() {
      try {
        this.loading = true;
        this.errorMessage = '';
        //console.log('this.data.mobile_no', this.data.mobile_no);
        const phoneWithCode = this.data.mobile_no;
        const response = await userAPI.login({ mobile_no: phoneWithCode });

        if (response.status === 200) {
          this.otpActive = true;
          this.loginHidden = true;
          this.data.mobile_no = phoneWithCode; // Lưu số điện thoại đã format
          this.startCountdown();
        }
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
        this.otpActive = true;
        this.loginHidden = true;
        this.data.mobile_no = phoneWithCode;
        console.error('Login error:', error);
        this.startCountdown();
      } finally {
        this.loading = false;
      }
    },

    // Xác thực OTP
    async sendOTP() {
      const notificationStore = useNotificationStore();
      const authStore = useAuthStore();

      if (this.data.otp.length !== 6) {
        notificationStore.error('Vui lòng nhập đủ 6 số OTP', 3000);
        return;
      }

      try {
        this.loading = true;
        this.errorMessage = '';
        const response = await userAPI.verifyOtp(this.data);
        if (!response.data?.userInfo) {
          throw new Error('Xác thực không thành công');
        }

        // Lưu thông tin user và token vào store
        const { userInfo, access_token, refresh_token } = response.data;
        authStore.login(userInfo, {
          access_token,
          refresh_token
        });

        // Emit event login success
        this.$emit('login-success', userInfo);

        // Đóng dialog
        this.dialog = false;

        // Thông báo thành công
        notificationStore.success('Đăng nhập thành công', 3000);
      } catch (error) {
        notificationStore.error(error.response?.data?.message || 'Mã OTP không chính xác', 3000);
        console.error('OTP verification error:', error);
      } finally {
        this.loading = false;
      }
    },

    // Xử lý OTP keydown
    handleOtpKeydown(event, index) {
      if (event.key === 'Backspace') {
        event.preventDefault();
        this.otpDigits[index - 1] = '';
        // Focus vào ô trước đó nếu có
        if (index > 1) {
          this.$refs[`otpInput${index - 1}`][0].$el.querySelector('input').focus();
        }
      }
    },

    // Xử lý OTP input
    handleOtpInput(index) {
      // Đảm bảo chỉ nhận input số
      this.otpDigits[index - 1] = this.otpDigits[index - 1].replace(/\D/g, '');

      // Cập nhật giá trị OTP
      this.data.otp = this.otpDigits.join('');

      // Tự động focus vào ô tiếp theo
      if (this.otpDigits[index - 1] && index < 6) {
        this.$refs[`otpInput${index + 1}`][0].$el.querySelector('input').focus();
      }
    },

    // Gửi lại OTP
    async resendOTP() {
      const notificationStore = useNotificationStore();
      try {
        this.loading = true;
        await this.sendPhoneNumber();
        this.otpDigits = Array(6).fill('');
        this.data.otp = '';
        this.startCountdown();
        notificationStore.success('Đã gửi lại mã OTP', 3000);
      } catch (error) {
        notificationStore.error('Không thể gửi lại mã OTP. Vui lòng thử lại sau.', 3000);
      } finally {
        this.loading = false;
      }
    },

    // Reset form khi đóng dialog
    resetForm() {
      this.data.mobile_no = '';
      this.data.otp = '';
      this.otpDigits = Array(6).fill('');
      this.otpActive = false;
      this.loginHidden = false;
      this.errorMessage = '';
      clearInterval(this.timer);
      this.countdown = 0;
    },

    // Method để mở dialog từ component cha
    openDialog() {
      this.dialog = true;
    },

    startCountdown() {
      this.countdown = 120;
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(this.timer);
        }
      }, 1000);
    },
  }
}
</script>

<style scoped>
.border-r {
  border-right: 1px solid rgb(0 0 0 / 12%);
}

.otp-input {
  width: 44px !important;
}

.otp-input :deep(.v-field__input) {
  text-align: center;
  padding: 0;
}

.phone-input :deep(.v-field__input) {
  padding-left: 16px !important;
  font-size: 14px;
}

.phone-input :deep(.v-field__input::placeholder) {
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
}

.resend-btn:disabled {
  opacity: 1 !important;
}
</style>