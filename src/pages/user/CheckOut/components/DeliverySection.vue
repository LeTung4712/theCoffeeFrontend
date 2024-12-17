<template>
  <v-card flat class="mr-4">
    <!-- Delivery Section -->
    <v-card-title class="d-flex justify-space-between align-center">
      <div class="text-h6 font-weight-bold">Giao hàng</div>
      <v-btn variant="outlined" size="small" rounded>
        Đổi phương thức
      </v-btn>
    </v-card-title>

    <!-- Address -->
    <v-card flat class="pa-4 d-flex align-center" @click="dialog = true">
      <v-img 
        src="@/assets/Delivery2.png" 
        width="24" 
        height="24"
        contain
        class="mr-4"
      />
      <div class="flex-grow-1">
        <div class="text-subtitle-1">{{ address }}</div>
      </div>
      <v-icon>mdi-chevron-right</v-icon>
    </v-card>

    <!-- Address Dialog -->
    <v-dialog v-model="dialog" width="376">
      <v-card>
        <v-card-title class="d-flex justify-space-between pa-4">
          <v-icon @click="dialog = false">mdi-close</v-icon>
          <span class="text-center flex-grow-1">Giao hàng</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="addressStore.address"
            placeholder="Vui lòng nhập địa chỉ"
            variant="outlined"
            density="comfortable"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="success" @click="dialog = false">
            Xác nhận
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
      <v-text-field
        v-if="!userData.isLogged"
        :placeholder="userData.name"
        variant="outlined"
        density="comfortable"
        class="mb-4"
      />
      <v-text-field
        v-else
        :value="userData.name"
        @input="$emit('update:name', $event)"
        variant="outlined"
        density="comfortable"
        class="mb-4"
      />
      
      <v-text-field
        v-if="!userData.isLogged"
        :placeholder="userData.phone"
        variant="outlined"
        density="comfortable"
        class="mb-4"
      />
      <v-text-field
        v-else
        :value="userData.phone"
        @input="$emit('update:phone', $event)"
        variant="outlined"
        density="comfortable"
        class="mb-4"
      />

      <v-text-field
        v-model="noteDelivery"
        placeholder="Thêm hướng dẫn giao hàng"
        variant="outlined"
        density="comfortable"
      />
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
      dialog: false
    }
  },

  computed: {
    address() {
      return this.addressStore.address
    },
    
    userData() {
      if (this.authStore.isLoggedIn) {
        const user = this.authStore.userInfo
        return {
          name: `${user.last_name} ${user.first_name}`,
          phone: user.mobile_no,
          isLogged: true
        }
      }
      return {
        name: "Tên người nhận",
        phone: "Số điện thoại",
        isLogged: false
      }
    },
    deliveryInfo() {
      return {
        name: this.userData.name,
        phone: this.userData.phone,
        address: this.address,
        note: this.noteDelivery,
        isLogged: this.userData.isLogged
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
  }
}
</script> 