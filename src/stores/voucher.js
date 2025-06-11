import { defineStore } from "pinia";
import { userAPI } from "@/api/user";
import { useAuthStore } from "@/stores/auth";

export const useVoucherStore = defineStore("voucher", {
  state: () => ({
    selectedVoucher: null,
    voucherList: [],
    publicVoucherList: [], // Danh sách voucher công khai cho user chưa đăng nhập
    loading: false,
    error: null,
  }),

  actions: {
    async fetchVouchers() {
      this.loading = true;
      try {
        const authStore = useAuthStore();

        // Nếu đã đăng nhập user
        if (authStore.isUserLoggedIn) {
          const response = await userAPI.voucher.getActive();
          this.voucherList = response.data.vouchers;
        } else {
          // Nếu chưa đăng nhập, lấy danh sách voucher công khai
          const response = await userAPI.voucher.getAll();
          this.publicVoucherList = response.data.vouchers;
          this.voucherList = []; // Reset voucher list của user đã đăng nhập
        }
      } catch (error) {
        this.error = error.message;
        // Nếu có lỗi, reset danh sách voucher về mảng rỗng
        this.voucherList = [];
        this.publicVoucherList = [];
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
        this.clearVoucher(); // Clear nếu có lỗi khi parse
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
    // Lấy danh sách voucher dựa vào trạng thái đăng nhập
    availableVouchers: (state) => {
      const authStore = useAuthStore();

      // Nếu đã đăng nhập, lọc voucher từ voucherList
      if (authStore.isUserLoggedIn) {
        return state.voucherList.filter(
          (voucher) => new Date(voucher.expire_at) > new Date()
        );
      }

      // Nếu chưa đăng nhập, lọc voucher từ publicVoucherList
      return state.publicVoucherList.filter(
        (voucher) => new Date(voucher.expire_at) > new Date()
      );
    },

    // Getter để kiểm tra có voucher nào khả dụng không
    hasAvailableVouchers: (state) => {
      const authStore = useAuthStore();
      const vouchers = authStore.isUserLoggedIn
        ? state.voucherList
        : state.publicVoucherList;

      return vouchers.some(
        (voucher) => new Date(voucher.expire_at) > new Date()
      );
    },
  },
});
