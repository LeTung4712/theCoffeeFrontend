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

    <v-card class="delivery-dialog-card rounded-lg">
      <v-card-title class="delivery-dialog-title">
        <div class="d-flex align-center">
          <v-icon size="24" class="mr-2">mdi-map-marker</v-icon>
          <span class="text-h6">Địa chỉ giao hàng</span>
        </div>
        <v-btn icon variant="text" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="delivery-dialog-content pa-6">
        <!-- Thanh tìm kiếm -->
        <div class="search-container">
          <v-text-field v-model="searchQuery" placeholder="Nhập địa chỉ giao hàng" variant="outlined"
            density="comfortable" hide-details class="search-input" prepend-inner-icon="mdi-magnify" clearable
            @click:clear="clearSearch" @input="handleSearch" :loading="addressStore.isSearching" bg-color="surface"
            color="primary">

          </v-text-field>
        </div>

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

        <!-- Địa chỉ đã lưu -->
        <div v-if="savedAddresses.length > 0" class="saved-addresses-section">
          <div class="d-flex align-center mb-3">
            <v-icon size="20" color="primary" class="mr-2">mdi-bookmark</v-icon>
            <div class="text-subtitle-1 font-weight-bold">Địa chỉ đã lưu</div>
          </div>
          <v-list class="saved-addresses-list">
            <v-list-item v-for="(address, index) in savedAddresses" :key="index" @click="selectAddress(address)"
              class="saved-address-item">
              <template v-slot:prepend>
                <v-icon color="primary" class="mr-2">
                  {{
                    address.address_type === 'home' ? 'mdi-home' :
                      address.address_type === 'office' ? 'mdi-office-building' : 'mdi-map-marker'
                  }}
                </v-icon>
              </template>
              <v-list-item-title class="saved-address-text">
                <div class="address-main">{{ address.address }}</div>
                <div v-if="address.user_name" class="address-details">
                  {{ address.user_name }} - {{ address.mobile_no }}
                </div>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </div>

        <!-- Không có kết quả -->
        <v-alert v-if="searchQuery && !addressStore.isSearching && !addressStore.currentSearchResults.length"
          type="info" variant="tonal" class="mt-4" density="comfortable">
          Không tìm thấy địa chỉ phù hợp
        </v-alert>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { useAddressStore } from "@/stores/address";
import { useAuthStore } from "@/stores/auth";

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
    const authStore = useAuthStore();
    return { addressStore, authStore };
  },

  data() {
    return {
      showDialog: false,
      searchQuery: "",
    };
  },

  computed: {
    addressDisplay() {
      return this.addressStore.address.address || 'Chưa có địa chỉ giao hàng';
    },

    savedAddresses() {
      return this.addressStore.addressNote.slice(0, 4);
    }
  },

  methods: {
    handleSearch() {
      this.addressStore.searchAddress(this.searchQuery);
    },

    clearSearch() {
      this.searchQuery = "";
      this.addressStore.clearSearchCache();
    },

    selectAddress(address) {
      this.addressStore.updateAddress({
        address: address.address,
        place_id: address.place_id,
        user_name: address.user_name,
        mobile_no: address.mobile_no,
        address_type: address.address_type,
        is_default: address.is_default
      });
      this.$emit("update:modelValue", address.address);
      this.closeDialog();
    },

    selectSearchResult(result) {
      const defaultAddress = this.addressStore.addressNote.find(address => address.is_default);
      const userInfo = this.authStore.userInfo
      const addressObj = {
        address: result.description,
        place_id: result.place_id,
        address_type: 'other',
        user_name: defaultAddress?.user_name || userInfo?.last_name + ' ' + userInfo?.first_name || '',
        mobile_no: defaultAddress?.mobile_no || userInfo?.mobile_no || '',
        is_default: false
      };

      this.addressStore.updateAddress(addressObj);
      this.$emit("update:modelValue", addressObj.address);
      this.closeDialog();
    },

    closeDialog() {
      this.showDialog = false;
      this.searchQuery = "";
      this.addressStore.clearSearchCache();
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
  overflow: hidden;
}

.delivery-dialog-card {
  border-radius: 12px;
  overflow: hidden;
}

.delivery-dialog-title {
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(var(--v-theme-surface));
}

.delivery-dialog-content {
  background-color: rgb(var(--v-theme-surface));
}

.search-container {
  position: relative;
  margin-bottom: 16px;
}

.search-input {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.search-input :deep(.v-field) {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.search-input :deep(.v-field:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-input :deep(.v-field--focused) {
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.15);
}

.search-input :deep(.v-field__input) {
  padding-top: 12px;
  padding-bottom: 12px;
  font-size: 0.9375rem;
}

.search-input :deep(.v-field__prepend-inner) {
  padding-inline-start: 16px;
  opacity: 0.7;
}

.search-input :deep(.v-field__append-inner) {
  padding-inline-end: 16px;
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
  /* Firefox */
  -ms-overflow-style: none;
  /* IE 10+ */
}

.search-results-list::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari */
}

.search-results-list::-webkit-scrollbar-track {
  background: transparent;
  margin: 4px;
}

.search-results-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.search-results-list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
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

.saved-addresses-section {
  margin-top: 24px;
}

.saved-addresses-list {
  background: transparent;
  max-height: 300px;
  overflow-y: auto;
  margin: 0 4px;
}

.saved-addresses-list::-webkit-scrollbar {
  width: 8px;
}

.saved-addresses-list::-webkit-scrollbar-track {
  background: transparent;
  margin: 4px;
}

.saved-addresses-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.saved-addresses-list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

.saved-address-item {
  border-radius: 8px;
  margin-bottom: 8px;
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid rgba(0, 0, 0, 0.12);
  transition: all 0.2s ease;
}

.saved-address-item:hover {
  background-color: rgb(var(--v-theme-surface-variant));
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.saved-address-text .address-main {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 4px;
}

.saved-address-text .address-details {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.6);
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

  .delivery-dialog-content {
    padding: 16px;
  }

  .search-results-list {
    max-height: 250px;
  }
}
</style>