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
      <v-img src="https://minio.thecoffeehouse.com/images/tch-web-order/Delivery2.png" 
             width="40" class="mr-4"/>
      <div class="flex-grow-1">
        <div class="text-subtitle-1">{{ userData.address }}</div>
        <div class="text-body-2">{{ userData.address }}</div>
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
            v-model="userData.address"
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
export default {
  name: 'DeliverySection',
  
  data() {
    return {
      userData: {
        name: '',
        phone: '',
        address: '',
        isLogged: false
      },
      noteDelivery: '',
      dialog: false
    }
  },

  created() {
    this.loadUserData()
  },

  mounted() {
    // Thêm event listener để lắng nghe thay đổi localStorage
    window.addEventListener('storage', this.handleStorageChange)
  },

  beforeDestroy() {
    // Cleanup event listener
    window.removeEventListener('storage', this.handleStorageChange)
  },

  methods: {
    loadUserData() {
      try {
        // Lấy địa chỉ đã lưu trước
        let savedAddress = ''
        try {
          const addressData = localStorage.getItem("oldAddress")
          console.log('Địa chỉ đã lưu:', addressData)
          if (addressData) {
            savedAddress = JSON.parse(addressData)
          }
        } catch (e) {
          console.error('Lỗi khi parse oldAddress:', e)
        }

        // Lấy thông tin user nếu có
        const userData = JSON.parse(localStorage.getItem("user"))
        if (userData) {
          this.userData = {
            name: `${userData.last_name} ${userData.first_name}`,
            phone: userData.mobile_no,
            address: userData.address || savedAddress || '',
            isLogged: true
          }
        } else {
          this.initGuestUser()
          this.userData.address = savedAddress || "Chưa có địa chỉ giao hàng"
        }
        
        this.$emit('delivery-info-loaded', this.userData)
      } catch (error) {
        console.error('Lỗi khi load thông tin:', error)
        this.initGuestUser()
      }
    },

    initGuestUser() {
      this.userData = {
        name: "Tên người nhận",
        phone: "Số điện thoại",
        address: "Chưa có địa chỉ giao hàng",
        isLogged: false
      }
    },

    handleStorageChange(event) {
      if (event.key === 'oldAddress') {
        try {
          const newAddress = JSON.parse(event.newValue)
          if (!this.userData.address || this.userData.address === "Chưa có địa chỉ giao hàng") {
            this.userData.address = newAddress
          }
        } catch (e) {
          console.error('Lỗi khi cập nhật địa chỉ mới:', e)
        }
      }
    }
  }
}
</script> 