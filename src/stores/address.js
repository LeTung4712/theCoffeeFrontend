import { defineStore } from "pinia";
import { mapAPI } from "@/api/map";
import debounce from "lodash/debounce";

// Thời gian cache tồn tại (3 tháng)
const CACHE_EXPIRATION = 3 * 30 * 24 * 60 * 60 * 1000;

export const useAddressStore = defineStore("address", {
  state: () => ({
    address: localStorage.getItem("oldAddress")
      ? JSON.parse(localStorage.getItem("oldAddress"))
      : {
          address: "",
          address_type: "",          
          is_default: false,
          mobile_no: "",
          place_id: "",
          user_name: "",
          created_at: "",
          updated_at: "",
        },
    addressNote: localStorage.getItem("addressNote")
      ? JSON.parse(localStorage.getItem("addressNote"))
      : [],
    // Cache kết quả tìm kiếm với timestamp
    searchCache: {},
    // Kết quả tìm kiếm hiện tại
    currentSearchResults: [],
    // Đang tìm kiếm
    isSearching: false,
  }),

  actions: {
    updateAddress(newAddress) {
      this.address = {
        ...this.address,
        ...newAddress,
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem("oldAddress", JSON.stringify(this.address));
    },

    setAddressNote(addresses) {
      this.addressNote = addresses;
      localStorage.setItem("addressNote", JSON.stringify(addresses));
    },

    removeAddressNoteById(id) {
      this.addressNote = this.addressNote.filter(
        (address) => address.id !== id
      );
      localStorage.setItem("addressNote", JSON.stringify(this.addressNote));
    },

    setDefaultAddress(id) {
      this.addressNote = this.addressNote.map((address) => ({
        ...address,
        is_default: address.id === id,
      }));
      localStorage.setItem("addressNote", JSON.stringify(this.addressNote));
    },

    // Tìm kiếm địa chỉ với debounce và cache
    searchAddress: debounce(async function (query) {
      if (!query) {
        this.currentSearchResults = [];
        return;
      }

      // Kiểm tra cache và thời gian hết hạn
      const cachedResult = this.searchCache[query];
      if (
        cachedResult &&
        Date.now() - cachedResult.timestamp < CACHE_EXPIRATION
      ) {
        this.currentSearchResults = cachedResult.data;
        return;
      }

      try {
        this.isSearching = true;
        const response = await mapAPI.getAutoCompleteAddress(query);
        //console.log(response);
        const results = response.data.predictions;

        // Lưu vào cache với timestamp
        this.searchCache[query] = {
          data: results,
          timestamp: Date.now(),
        };
        this.currentSearchResults = results;
      } catch (error) {
        console.error("Lỗi khi tìm kiếm địa chỉ:", error);
        this.currentSearchResults = [];
      } finally {
        this.isSearching = false;
      }
    }, 1000), // Debounce 1000ms

    // Xóa cache
    clearSearchCache() {
      this.searchCache = {};
      this.currentSearchResults = [];
    },

    // Xóa cache hết hạn
    clearExpiredCache() {
      const now = Date.now();
      Object.keys(this.searchCache).forEach((key) => {
        if (now - this.searchCache[key].timestamp > CACHE_EXPIRATION) {
          delete this.searchCache[key];
        }
      });
    },
  },
});
