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
              {{(addressTypes.find(t => t.value === address.address_type) && addressTypes.find(t => t.value ===
                address.address_type).text) || address.address_type}}
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

    <v-alert v-else type="info" text="Bạn chưa có địa chỉ giao hàng nào" class="mt-4"></v-alert>

    <!-- Dialog để thêm hoặc chỉnh sửa địa chỉ -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card class="pa-4">
        <v-card-title class="px-0">
          <span class="text-h5 font-weight-bold">{{ isEdit ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới' }}</span>
        </v-card-title>

        <v-card-text class="px-0 py-4">
          <v-form ref="form" v-model="isFormValid">
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field v-model="newAddress.user_name" label="Tên người nhận" variant="outlined"
                  density="comfortable" hide-details="auto" class="mb-3" :rules="nameRules" required></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field v-model="newAddress.mobile_no" label="Số điện thoại" variant="outlined"
                  density="comfortable" hide-details="auto" class="mb-3" :rules="phoneRules" required></v-text-field>
              </v-col>

              <v-col cols="12">
                <div class="search-container">
                  <v-text-field v-model="newAddress.address" label="Địa chỉ" variant="outlined" density="comfortable"
                    hide-details="auto" class="mb-3" :rules="addressRules" required prepend-inner-icon="mdi-magnify"
                    clearable @click:clear="clearSearch" @update:model-value="handleSearch" :loading="addressStore.isSearching"
                    bg-color="surface" color="primary"></v-text-field>

                  <!-- Kết quả tìm kiếm -->
                  <div v-if="addressStore.currentSearchResults.length > 0" class="search-results mb-4">
                    <v-list class="search-results-list">
                      <v-list-item v-for="(result, index) in addressStore.currentSearchResults" :key="index"
                        @click="selectSearchResult(result)" class="search-result-item">
                        <template v-slot:prepend>
                          <v-icon color="grey">mdi-map-marker</v-icon>
                        </template>
                        <v-list-item-title class="search-result-text">{{ result.description }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </div>

                  <!-- Không có kết quả -->
                  <v-alert v-if="newAddress.address && !addressStore.isSearching && !addressStore.currentSearchResults.length"
                    type="info" variant="tonal" class="mt-4" density="comfortable">
                    Không tìm thấy địa chỉ phù hợp
                  </v-alert>
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select v-model="newAddress.address_type" :items="addressTypes" item-title="text" item-value="value"
                  label="Loại địa chỉ" variant="outlined" density="comfortable" hide-details="auto" class="mb-3"
                  required></v-select>
              </v-col>
            </v-row>

            <v-switch v-model="newAddress.is_default" label="Đặt làm địa chỉ mặc định" color="success" hide-details
              class="mt-4"></v-switch>
          </v-form>
        </v-card-text>

        <v-card-actions class="px-0 pt-2">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" color="grey" @click="closeDialog" class="mr-2" min-width="100">
            Hủy
          </v-btn>
          <v-btn color="primary" @click="saveAddress" :disabled="!isFormValid" min-width="100">
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
      },
      showDeleteDialog: false,
      addressToDelete: null,
      addressTypes: [
        { text: 'Nhà riêng', value: 'home' },
        { text: 'Văn phòng', value: 'office' },
        { text: 'Khác', value: 'other' }
      ],
      nameRules: [
        v => !!v || 'Họ tên không được để trống',
        v => v.length >= 2 || 'Họ tên phải có ít nhất 2 ký tự',
        v => v.length <= 50 || 'Họ tên không được vượt quá 50 ký tự'
      ],
      phoneRules: [
        v => !!v || 'Số điện thoại không được để trống',
        v => /^0\d{9}$/.test(v) || 'Số điện thoại không đúng định dạng '
      ],
      addressRules: [
        v => !!v || 'Địa chỉ không được để trống',
        v => v.length >= 2 || 'Địa chỉ phải có ít nhất 2 ký tự',
        v => v.length <= 255 || 'Địa chỉ không được vượt quá 255 ký tự'
      ],
      isFormValid: false,
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
          user_name: address.user_name,
          address: address.address,
          place_id: address.place_id,
          mobile_no: address.mobile_no,
          address_type: address.address_type,
          is_default: Boolean(Number(address.is_default)),
        };
      } else {
        this.resetNewAddress();
      }
    },

    resetNewAddress() {
      this.newAddress = {
        user_name: '',
        address: '',
        place_id: '',
        mobile_no: '',
        address_type: 'home',
        is_default: false,
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
      if (this.addresses.length > 4) {
        this.notificationStore.error('Bạn chỉ được phép thêm tối đa 4 địa chỉ.', 3000);
        return;
      }
      try {
        const addressData = {
          ...this.newAddress,
          is_default: this.newAddress.is_default ? 1 : 0
        };

        let response;
        if (this.isEdit) {
          response = await userAPI.address.update(this.newAddress.address_id, addressData);
        } else {
          response = await userAPI.address.create(addressData);
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
          await userAPI.address.delete(this.addressToDelete);

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

    closeDialog() {
      this.dialog = false;
      this.resetNewAddress();
    },

    handleSearch() {
      this.addressStore.searchAddress(this.newAddress.address);
    },

    clearSearch() {
      this.newAddress.address = "";
      this.addressStore.clearSearchCache();
    },

    selectSearchResult(result) {
      // Tạm thời tắt watch để tránh trigger handleSearch
      this.$nextTick(() => {
        this.newAddress.address = result.description;
        this.newAddress.place_id = result.place_id;
        this.addressStore.clearSearchCache();
      });
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

.search-container {
  position: relative;
  margin-bottom: 16px;
}

.search-results {
  position: relative;
  z-index: 1;
}

.search-results-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  background: white;
  margin: 0 4px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.search-results-list::-webkit-scrollbar {
  display: none;
}

.search-result-text {
  font-size: 0.875rem;
  line-height: 1.25rem;
  white-space: normal;
  word-break: break-word;
}

.search-result-item {
  cursor: pointer;
  transition: background-color 0.2s;
  padding: 8px 16px;
  min-height: 40px;
}

.search-result-item:hover {
  background-color: rgb(var(--v-theme-surface-variant));
}
</style>