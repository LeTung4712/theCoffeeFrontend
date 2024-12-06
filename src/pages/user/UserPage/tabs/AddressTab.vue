<template>
  <div class="address-tab pa-4">

    <h2 class="text-h5 font-weight-bold mb-2">Địa chỉ giao hàng</h2>

    <v-btn color="primary" @click="openDialog(false)" class="mb-3">Thêm địa chỉ</v-btn>

    <v-list v-if="addresses.length" class="bg-grey-lighten-4 rounded-lg pa-3">
      <v-list-item v-for="address in addresses" :key="address.id" class="mb-3">
        <template v-slot:prepend>
          <v-icon color="primary" class="mr-3">mdi-map-marker</v-icon>
        </template>

        <v-list-item-content class="d-flex justify-space-between">
          <div>
            <v-list-item-title class="font-weight-medium mb-1">
              {{ address.address }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-grey">
              {{ address.mobile_no || 'Chưa có số điện thoại' }}
            </v-list-item-subtitle>
            <v-list-item-subtitle class="text-grey-darker">
              {{ address.address_type }} - {{ address.is_default ? 'Mặc định' : '' }}
            </v-list-item-subtitle>
          </div>
          <v-list-item-action>
            <v-icon @click="openDialog(true, address)" class="mr-2" color="primary">mdi-pencil</v-icon>
            <v-icon @click="deleteAddress(address.id)" color="red">mdi-delete</v-icon>
          </v-list-item-action>
        </v-list-item-content>
        <v-divider></v-divider>
      </v-list-item>
    </v-list>

    <v-alert v-else type="info" text="Bạn chưa có địa chỉ giao hàng nào" class="mt-4"></v-alert>

    <!-- Dialog để thêm hoặc chỉnh sửa địa chỉ -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ isEdit ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới' }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="newAddress.user_name" label="Tên người dùng" required></v-text-field>
          <v-text-field v-model="newAddress.mobile_no" label="Số điện thoại" required></v-text-field>
          <v-text-field v-model="newAddress.address" label="Địa chỉ" required></v-text-field>
          <v-select v-model="newAddress.address_type" :items="['Nhà', 'Công ty', 'Khác']" label="Loại địa chỉ" required></v-select>
          <v-switch v-model="newAddress.is_default" label="Đặt làm địa chỉ mặc định" class="custom-switch"></v-switch>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Hủy</v-btn>
          <v-btn color="blue darken-1" text @click="saveAddress">{{ isEdit ? 'Cập nhật' : 'Lưu' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { userAPI } from "@/api/user";
import { useAuthStore } from "@/stores/auth";
import { useAddressStore } from "@/stores/address";
import { useNotificationStore } from "@/stores/notification";
export default {
  name: 'AddressTab',
  props: {
    addresses: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialog: false,
      isEdit: false,
      newAddress: {
        user_name: '',
        address: '',
        mobile_no: '',
        address_type: '',
        is_default: 0
      }
    };
  },

  setup() {
        const notificationStore = useNotificationStore()
        const authStore = useAuthStore()
        const addressStore = useAddressStore()
        return {
            notificationStore,
            authStore,
            addressStore
        }
    },

  methods: {
    openDialog(isEdit, address) {
      this.dialog = true;
      this.isEdit = isEdit;
      if (address) {
        this.newAddress = {
          user_name: address.user_name,
          address: address.address,
          mobile_no: address.mobile_no,
          address_type: address.address_type,
          is_default: address.is_default
        };
      } else {
        this.resetNewAddress();
      }
      console.log('is', address.is_default)
    },

    closeDialog() {
      this.dialog = false;
      this.resetNewAddress();
    },
    async saveAddress() {
      // Kiểm tra xem tất cả các trường có được điền hay không
      if (!this.newAddress.user_name || !this.newAddress.mobile_no || !this.newAddress.address ) {
        this.notificationStore.error('Vui lòng điền đầy đủ thông tin.', 3000);
        return;
      }
      if (!this.validatePhoneNumber(this.newAddress.mobile_no)) {
        this.notificationStore.error('Số điện thoại không hợp lệ. Vui lòng nhập đúng số điện thoại Việt Nam (11 số)', 3000);
        return;
      }

      let response;
      if (this.isEdit) {
        // Cập nhật địa chỉ
        response = await userAPI.updateAddressNote(this.newAddress); // Gọi API cập nhật
      } else {
        // Tạo địa chỉ mới
        response = await userAPI.createAddressNote(this.newAddress); // Gọi API tạo mới
      }

      this.addressStore.setAddressNote(response.data.address_note);
      this.closeDialog();
    },
    resetNewAddress() {
      this.newAddress = {
        user_name: '',
        address: '',
        mobile_no: '',
        address_type: '',
        is_default: false
      };
    },
    deleteAddress(addressId) {
      // Logic to delete the address by ID
    },

    validatePhoneNumber(phoneNumber) {
      const phoneRegex = /^[0-9]{10,11}$/; // Kiểm tra số điện thoại từ 10 đến 11 số
      return phoneRegex.test(phoneNumber);
    },

  }
}
</script>

<style scoped></style>