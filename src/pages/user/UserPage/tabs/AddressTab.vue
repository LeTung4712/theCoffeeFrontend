<template>
  <div class="address-tab pa-4">

    <h2 class="text-h5 font-weight-bold mb-2">Địa chỉ giao hàng</h2>

    <div class="d-flex justify-end">
      <v-btn color="primary" @click="openDialog(false)" class="mb-3">Thêm địa chỉ</v-btn>
    </div>

    <v-list v-if="addresses.length" class="bg-grey-lighten-4 rounded-lg">
      <v-list-item v-for="address in addresses" :key="address.id" class="mb-2 pa-3 address-item"
        :class="{ 'default-address': address.is_default }">
        <div class="d-flex flex-column w-100">
          <!-- Header với icon và tên -->
          <div class="d-flex align-center mb-2">
            <v-icon :color="address.is_default ? 'success' : 'primary'" class="mr-3 address-icon">
              {{ address.is_default ? 'mdi-check-circle' : 'mdi-map-marker' }}
            </v-icon>
            <div>
              <div class="d-flex align-center">
                <span class="text-subtitle-1 font-weight-medium">{{ address.user_name }}</span>
                <v-chip v-if="address.is_default" color="success" size="x-small" class="ml-2" variant="outlined">
                  Mặc định
                </v-chip>
              </div>
              <div class="text-body-2 text-grey-darken-1">{{ address.mobile_no }}</div>
            </div>
          </div>

          <!-- Thông tin địa chỉ -->
          <div class="address-info ml-9">
            <div class="text-body-2 text-grey-darken-1 mb-1">{{ address.address }}</div>
            <div class="text-caption text-grey">
              {{ (addressTypes.find(t => t.value === address.address_type) && addressTypes.find(t => t.value ===
                address.address_type).text) || address.address_type }}
            </div>
          </div>

          <!-- Nút hành động -->
          <div class="d-flex justify-end mt-2">
            <v-btn variant="text" size="small" color="primary" class="mr-2" @click="openDialog(true, address)">
              <v-icon size="small">mdi-pencil</v-icon>
              <span class="ml-1">Sửa</span>
            </v-btn>
            <v-btn variant="text" size="small" color="error" @click="confirmDeleteDialog(address.id)">
              <v-icon size="small">mdi-delete</v-icon>
              <span class="ml-1">Xóa</span>
            </v-btn>
          </div>
        </div>
      </v-list-item>
    </v-list>

    <v-alert v-else type="info" text="B��n chưa có địa chỉ giao hàng nào" class="mt-4"></v-alert>

    <!-- Dialog để thêm hoặc chỉnh sửa địa chỉ -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card class="pa-4">
        <v-card-title class="px-0">
          <span class="text-h5 font-weight-bold">{{ isEdit ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới' }}</span>
        </v-card-title>

        <v-card-text class="px-0 py-4">
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field v-model="newAddress.user_name" label="Tên người dùng" variant="outlined"
                density="comfortable" hide-details="auto" class="mb-3" required></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field v-model="newAddress.mobile_no" label="Số điện thoại" variant="outlined"
                density="comfortable" hide-details="auto" class="mb-3" required></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field v-model="newAddress.address" label="Địa chỉ" variant="outlined" density="comfortable"
                hide-details="auto" class="mb-3" required></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-select v-model="newAddress.address_type" :items="addressTypes" item-title="text" item-value="value"
                label="Loại địa chỉ" variant="outlined" density="comfortable" hide-details="auto" class="mb-3"
                required></v-select>
            </v-col>
          </v-row>

          <v-switch v-model="newAddress.is_default" label="Đặt làm địa chỉ mặc định" color="success" hide-details
            class="mt-4"></v-switch>
        </v-card-text>

        <v-card-actions class="px-0 pt-2">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" color="grey" @click="closeDialog" class="mr-2" min-width="100">
            Hủy
          </v-btn>
          <v-btn color="primary" @click="saveAddress" min-width="100">
            {{ isEdit ? 'Cập nhật' : 'Lưu' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog xác nhận xóa -->
    <v-dialog v-model="showDeleteDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Xác nhận xóa</v-card-title>
        <v-card-text>Bạn có chắc chắn muốn xóa địa chỉ này không?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="showDeleteDialog = false">Hủy</v-btn>
          <v-btn color="red darken-1" text @click="deleteAddress">Xóa</v-btn>
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
        user_id: this.authStore.user.id,
        user_name: '',
        address: '',
        mobile_no: '',
        address_type: 'home',
        is_default: false,
        province_code: '1',
        district_code: '1',
        ward_code: '1'
      },
      showDeleteDialog: false,
      addressToDelete: null,
      addressTypes: [
        { text: 'Nhà riêng', value: 'home' },
        { text: 'Văn phòng', value: 'office' },
        { text: 'Khác', value: 'other' }
      ],
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
          address_id: address.id,
          user_id: this.authStore.user.id,
          user_name: address.user_name,
          address: address.address,
          mobile_no: address.mobile_no,
          address_type: address.address_type,
          is_default: Boolean(Number(address.is_default)),
          province_code: address.province_code || '1',
          district_code: address.district_code || '1',
          ward_code: address.ward_code || '1'
        };
      } else {
        this.resetNewAddress();
      }
    },

    resetNewAddress() {
      this.newAddress = {
        user_id: this.authStore.user.id,
        user_name: '',
        address: '',
        mobile_no: '',
        address_type: 'home',
        is_default: false,
        province_code: '1',
        district_code: '1',
        ward_code: '1'
      };
    },

    // Xử lý input số điện thoại
    formatPhoneNumber(mobile_no) {
      if (!mobile_no) return '';
      // Loại bỏ tất cả ký tự không phải số
      const numberOnly = mobile_no.replace(/\D/g, '');
      // Nếu số bắt đầu bằng 0, bỏ số 0
      return numberOnly.startsWith('0') ? numberOnly.slice(1) : numberOnly;
    },

    async saveAddress() {
      // Kiểm tra số lượng địa chỉ hiện tại
      if (this.addresses.length >= 4) {
        this.notificationStore.error('Bạn chỉ được phép thêm tối đa 4 địa chỉ.', 3000);
        return;
      }
      // Kiểm tra xem tất cả các trường có được điền hay không
      if (!this.newAddress.user_name || !this.newAddress.mobile_no || !this.newAddress.address) {
        this.notificationStore.error('Vui lòng điền đầy đủ thông tin.', 3000);
        return;
      }
      if (!this.validatePhoneNumber(this.newAddress.mobile_no)) {
        this.notificationStore.error('Số điện thoại không hợp lệ. Vui lòng nhập đúng số điện thoại Việt Nam (11 số)', 3000);
        return;
      }

      try {
        const addressData = {
          ...this.newAddress,
          is_default: this.newAddress.is_default ? 1 : 0
        };

        let response;
        if (this.isEdit) {
          response = await userAPI.updateAddressNote(addressData);
        } else {
          response = await userAPI.createAddressNote(addressData);
        }

        // Cập nhật store và emit event để parent component biết
        this.addressStore.setAddressNote(response.data.address_note);
        this.$emit('address-updated');

        // Nếu là địa chỉ mặc định, cập nhật địa chỉ chính
        if (this.newAddress.is_default) {
          this.addressStore.updateAddress(this.newAddress.address);
        }

        this.notificationStore.success(
          this.isEdit ? 'Cập nhật địa chỉ thành công' : 'Thêm địa chỉ mới thành công',
          3000
        );
        this.closeDialog();
      } catch (error) {
        this.notificationStore.error('Có lỗi xảy ra khi lưu địa chỉ', 3000);
      }
    },

    async deleteAddress() {
      if (this.addressToDelete) {
        try {
          await userAPI.deleteAddressNote({
            user_id: this.authStore.user.id,
            address_id: this.addressToDelete
          });

          // Xóa khỏi store và emit event
          this.addressStore.removeAddressNoteById(this.addressToDelete);
          this.$emit('address-updated');

          this.notificationStore.success('Địa chỉ đã được xóa thành công.', 3000);
        } catch (error) {
          this.notificationStore.error('Có lỗi xảy ra khi xóa địa chỉ.', 3000);
        }
      }
      this.showDeleteDialog = false;
      this.addressToDelete = null;
    },

    confirmDeleteDialog(addressId) {
      this.addressToDelete = addressId;
      this.showDeleteDialog = true;
    },

    validatePhoneNumber(phoneNumber) {
      const phoneRegex = /^[0-9]{10,11}$/; // Kiểm tra số điện thoại từ 10 đến 11 số
      return phoneRegex.test(phoneNumber);
    },

    closeDialog() {
      this.dialog = false;
      this.resetNewAddress();
    },
  }
}
</script>

<style scoped>
.address-item {
  border: 1px solid #e0e0e0;
  transition: all 0.2s ease;
}

.address-item:hover {
  background-color: #f5f5f5;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.default-address {
  border: 2px solid #4CAF50;
  background-color: #f9fff9;
}

.address-icon {
  font-size: 24px;
}

@media (max-width: 600px) {
  .address-info {
    width: 100%;
  }

  .v-btn {
    min-width: 80px;
  }

  .v-chip {
    font-size: 0.75rem;
  }

  .text-subtitle-1 {
    font-size: 1rem;
  }

  .text-body-2 {
    font-size: 0.875rem;
  }
}
</style>