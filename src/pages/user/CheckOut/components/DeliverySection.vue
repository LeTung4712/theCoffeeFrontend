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
    <v-form class="pa-4">
      <v-text-field :value="addressStore.address.user_name" @input="updateAddressField('user_name', $event)"
        placeholder="Họ và tên người nhận" variant="outlined" density="comfortable" class="mb-4" />

      <v-text-field :value="addressStore.address.mobile_no" @input="updateAddressField('mobile_no', $event)"
        placeholder="Số điện thoại" variant="outlined" density="comfortable" class="mb-4" />

      <v-text-field v-model="noteDelivery" placeholder="Thêm hướng dẫn giao hàng" variant="outlined"
        density="comfortable" />
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
      noteDelivery: ''
    }
  },

  computed: {
    addressDisplay() {
      return this.addressStore.address.address || 'Chưa có địa chỉ giao hàng'
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
      const savedAddress = JSON.parse(localStorage.getItem("oldAddress"))
      return {
        name: this.userData.name,
        phone: this.userData.phone,
        address: this.addressDisplay,
        note: this.noteDelivery,
        isLogged: this.userData.isLogged,
        user_name: savedAddress?.user_name,
        mobile_no: savedAddress?.mobile_no,
        address_type: savedAddress?.address_type,
        district_code: savedAddress?.district_code,
        province_code: savedAddress?.province_code,
        ward_code: savedAddress?.ward_code
      }
    }
  },

  watch: {
    deliveryInfo: {
      handler(newInfo) {
        this.$emit('delivery-info-loaded', newInfo)
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    updateAddressField(field, value) {
      this.addressStore.updateAddress({
        [field]: value
      })
    }
  }
}
</script>