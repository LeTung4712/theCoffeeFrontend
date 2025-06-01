<template>
  <v-card flat class="mr-4">
    <!-- Delivery Section -->
    <v-card-title class="d-flex justify-space-between align-center">
      <div class="text-h6 font-weight-bold">Giao hàng</div>
    </v-card-title>

    <!-- Address -->
    <v-card flat class="pa-4 d-flex align-center">
      <v-img src="@/assets/Delivery2.png" width="24" height="24" contain class="mr-4" />
      <div class="flex-grow-1">
        <div class="text-subtitle-1">{{ addressDisplay }}</div>
      </div>
    </v-card>

    <!-- Delivery Time -->
    <v-card flat class="pa-4 d-flex align-center">
      <div class="flex-grow-1">
        <div class="text-subtitle-1">Nhận hàng trong ngày 15-30 phút</div>
        <div class="text-body-2">Nhận càng sớm càng tốt</div>
      </div>
      <v-icon>mdi-chevron-right</v-icon>
    </v-card>

    <!-- Customer Info -->
    <v-form ref="form" class="pa-4" @submit.prevent>
      <v-text-field v-model="addressStore.address.user_name" placeholder="Họ và tên người nhận" variant="outlined"
        density="comfortable" class="mb-4" :rules="nameRules" required />

      <v-text-field v-model="addressStore.address.mobile_no" placeholder="Số điện thoại" variant="outlined"
        density="comfortable" class="mb-4" :rules="phoneRules" required />

      <v-text-field v-model="noteDelivery" placeholder="Thêm hướng dẫn giao hàng" variant="outlined"
        density="comfortable" :rules="noteRules" />
    </v-form>
  </v-card>
</template>

<script>
import { useAddressStore } from '@/stores/address'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'DeliverySection',

  emits: ['delivery-info-loaded'],

  setup() {
    const addressStore = useAddressStore()
    const authStore = useAuthStore()
    return { addressStore, authStore }
  },

  data() {
    return {
      noteDelivery: '',
      nameRules: [
        v => !!v || 'Họ tên không được để trống',
        v => v.length >= 2 || 'Họ tên phải có ít nhất 2 ký tự',
        v => v.length <= 50 || 'Họ tên không được vượt quá 50 ký tự'
      ],
      phoneRules: [
        v => !!v || 'Số điện thoại không được để trống',
        v => /^0\d{9}$/.test(v) || 'Số điện thoại không đúng định dạng '
      ],
      noteRules: [
        v => !v || v.length <= 200 || 'Ghi chú không được vượt quá 200 ký tự'
      ]
    }
  },

  computed: {
    addressDisplay() {
      return this.addressStore.address.address || 'Chưa có địa chỉ giao hàng'
    },

    isPhoneValid() {
      return /^0\d{9,10}$/.test(this.addressStore.address.mobile_no)
    },

    userData() {
      const savedAddress = JSON.parse(localStorage.getItem("oldAddress"))
      if (this.authStore.isLoggedIn) {
        const user = this.authStore.userInfo
        return {
          name: savedAddress?.user_name || `${user.last_name} ${user.first_name}`,
          phone: savedAddress?.mobile_no || user.mobile_no,
          isLogged: true
        }
      }
      return {
        name: savedAddress?.user_name || "Tên người nhận",
        phone: savedAddress?.mobile_no || "Số điện thoại",
        isLogged: false
      }
    },

    deliveryInfo() {
      return {
        address: this.addressDisplay,
        note: this.noteDelivery,
        user_name: this.addressStore.address.user_name,
        mobile_no: this.addressStore.address.mobile_no,
      }
    },
  },

  watch: {
    deliveryInfo: {
      handler(newInfo) {
        this.$emit('delivery-info-loaded', {
          ...newInfo,
          isPhoneValid: this.isPhoneValid,
          isFormValid: this.isFormValid
        })
      },
      deep: true,
      immediate: true
    },
    'addressStore.address': {
      handler(newVal) {
        localStorage.setItem("oldAddress", JSON.stringify(newVal));
      },
      deep: true
    }
  },
}
</script>