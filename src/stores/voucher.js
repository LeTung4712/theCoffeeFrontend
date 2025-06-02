import { defineStore } from "pinia";
import { voucherAPI } from "@/api/voucher";
import { useAuthStore } from "@/stores/auth";

export const useVoucherStore = defineStore("voucher", {
  state: () => ({
    selectedVoucher: null,
    voucherList: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchVouchers() {
      this.loading = true;
      try {
        const response = await voucherAPI.getVoucherActive({
          user_id: useAuthStore().user.id,
        });
        this.voucherList = response.data.vouchers;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    setSelectedVoucher(voucher) {
      this.selectedVoucher = voucher;
      if (voucher) {
        localStorage.setItem("voucher", JSON.stringify(voucher));
      } else {
        localStorage.removeItem("voucher");
      }
    },

    loadVoucherFromStorage() {
      try {
        const stored = localStorage.getItem("voucher");
        if (stored) {
          this.selectedVoucher = JSON.parse(stored);
        }
      } catch (error) {
        console.error("Lỗi khi load voucher từ storage:", error);
      }
    },

    clearVoucher() {
      this.selectedVoucher = null;
      localStorage.removeItem("voucher");
    },

    // Alias cho clearVoucher để làm rõ ngữ cảnh sử dụng
    removeSelectedVoucher() {
      this.clearVoucher();
    },
  },

  getters: {
    availableVouchers: (state) => {
      return state.voucherList.filter(
        (voucher) => new Date(voucher.expire_at) > new Date()
      );
    },
  },
});
