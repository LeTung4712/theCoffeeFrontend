<template>
  <v-dialog v-model="showDialog" max-width="750">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" variant="text" class="delivery-btn rounded-pill px-2 px-sm-4" color="secondary">
        <v-row no-gutters align="center" style="height: 100%; width: 100%">
          <v-col cols="auto">
            <v-img src="@/assets/Delivery2.png" width="36" height="36" class="mr-2 rounded-circle" />
          </v-col>
          <v-col class="address-container">
            <div class="ml-2">
              <div class="text-subtitle-1 font-weight-bold text-black">Giao hàng</div>
              <div class="text-caption text-truncate text-black">{{ addressDisplay }}</div>
            </div>
          </v-col>
          <v-col cols="auto">
            <v-icon size="24" class="ml-2">mdi-chevron-down</v-icon>
          </v-col>
        </v-row>
      </v-btn>
    </template>

    <v-card>
      <v-card-text class="delivery-dialog pa-6">
        <div class="text-h6 font-weight-bold mb-4">Địa chỉ giao hàng</div>

        <!-- Thanh tìm kiếm -->
        <v-text-field v-model="addressStore.address.address" placeholder="Nhập địa chỉ giao hàng" variant="outlined"
          density="comfortable" hide-details class="mb-4" prepend-inner-icon="mdi-magnify" clearable @click:clear="clearAddress"
          @input="handleSearchAddress">
        </v-text-field>

        <!-- Địa chỉ đã lưu -->
        <div v-if="savedAddresses.length > 0">
          <div class="text-subtitle-1 font-weight-bold mb-2">Địa chỉ đã lưu</div>
          <v-list>
            <v-list-item v-for="(address, index) in savedAddresses" :key="index" @click="selectAddress(address)">
              <template v-slot:prepend>
                <v-icon color="primary" class="mr-2">
                  {{
                    address.address_type === 'home' ? 'mdi-home' :
                      address.address_type === 'office' ? 'mdi-office-building' : 'mdi-map-marker'
                  }}
                </v-icon>
              </template>
              <v-list-item-title class="text-caption">
                <div>{{ address.address }}</div>
                <div v-if="address.user_name" class="text-grey-darken-1">
                  {{ address.user_name }} - {{ address.mobile_no }}
                </div>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </div>

        <!-- Kết quả tìm kiếm -->
        <div v-if="searchResults.length > 0">
          <div class="text-subtitle-1 font-weight-bold my-2">Kết quả tìm kiếm</div>
          <v-list>
            <v-list-item v-for="(result, index) in searchResults" :key="index" @click="selectSearchResult(result)">
              <template v-slot:prepend>
                <v-icon color="grey" class="mr-2">mdi-map-marker</v-icon>
              </template>

              <v-list-item-title>{{ result.mainText }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">{{ result.secondaryText }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </div>

        <!-- Không có kết quả -->
        <v-alert v-if="searchAddress && !searchResults.length" type="info" variant="tonal" class="mt-4">Không tìm thấy
          địa
          chỉ phù hợp</v-alert>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { useAddressStore } from "@/stores/address";

export default {
  name: "DeliveryAddressButton",

  props: {
    modelValue: {
      type: String,
      default: ""
    }
  },

  emits: ["update:modelValue"],

  setup() {
    const addressStore = useAddressStore();
    return { addressStore };
  },

  data() {
    return {
      showDialog: false,
      searchAddress: "",
      searchResults: [],
    };
  },

  computed: {
    addressDisplay() {
      return this.addressStore.address.address || 'Chưa có địa chỉ giao hàng';
    },

    address() {
      return this.addressStore.address;
    },

    savedAddresses() {
      return this.addressStore.addressNote.slice(0, 4);
    }
  },

  methods: {
    closeDialog() {
      this.showDialog = false;
      this.searchAddress = "";
      this.searchResults = [];
    },

    handleSearchAddress() {
      this.searchResults = [];
    },

    selectAddress(address) {
      this.addressStore.updateAddress({
        address: address.address,
        user_name: address.user_name,
        mobile_no: address.mobile_no,
        address_type: address.address_type,
        province_code: address.province_code,
        district_code: address.district_code,
        ward_code: address.ward_code,
        is_default: address.is_default
      });
      this.$emit("update:modelValue", address.address);
      this.closeDialog();
    },

    selectSearchResult(result) {
      const addressObj = {
        address: `${result.mainText}, ${result.secondaryText}`,
        address_type: 'other',
        is_default: false
      };
      this.addressStore.updateAddress(addressObj);
      this.$emit("update:modelValue", addressObj.address);
      this.closeDialog();
    },

    clearAddress() {
      this.addressStore.updateAddress({
        address: '',
        address_type: '',
        is_default: false
      });
      this.searchResults = [];
    }
  }
};
</script>

<style scoped>
.delivery-btn {
  min-width: 220px;
  max-width: 220px;
  height: 56px !important;
  background-color: rgb(var(--v-theme-secondary)) !important;
  transition: 0.3s ease-in-out;
  border-radius: 8px;
}

.address-container {
  width: 120px;
  /* Đặt chiều rộng cố định cho phần địa chỉ */
  overflow: hidden;
}

/* Điều chỉnh kích thước cho mobile */
@media (max-width: 599px) {
  .delivery-btn {
    height: 48px !important;
    min-width: 180px;
    max-width: 180px;
  }

  .address-container {
    width: 90px;
  }
}

.delivery-dialog {
  max-height: 80vh;
  overflow-y: auto;
}

.delivery-dialog .v-list-item {
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: 8px;
}

.delivery-dialog .v-list-item:hover {
  background-color: rgb(var(--v-theme-surface-variant));
}
</style>