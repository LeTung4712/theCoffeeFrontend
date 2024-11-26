<template>
  <v-dialog v-model="dialog" max-width="400">
    <template v-slot:activator="{ props }">
      <v-sheet v-bind="props" class="d-flex align-center cursor-pointer">
        <v-icon icon="mdi-ticket-percent" color="primary" class="mr-2"/>
        <span class="text-orange">
          {{ selectedVoucher ? selectedVoucher.description : "Chọn khuyến mãi" }}
        </span>
      </v-sheet>
    </template>

    <v-card>
      <v-card-title class="d-flex align-center pa-2 border-b header-fixed">
        <v-btn 
          icon="mdi-close" 
          variant="text" 
          @click="dialog = false" 
          class="ml-n1" 
          density="comfortable"
          size="small"
        />
        <span class="mx-auto text-subtitle-1 font-weight-bold">Chọn khuyến mãi</span>
      </v-card-title>

      <v-card-text class="pa-4">
        <v-sheet class="d-flex align-center pa-3 bg-grey-lighten-4 rounded-lg border">
          <v-text-field
            v-model="voucher_code"
            placeholder="Nhập mã khuyến mãi"
            variant="plain"
            hide-details
            density="comfortable"
            class="flex-grow-1 font-weight-medium center-input"
            bg-color="transparent"
            :style="{ minWidth: 0 }"
          />
          <v-btn
            color="primary"
            @click="handleChooseVoucherCode"
            :loading="isApplying"
            :disabled="isApplying"
            class="px-6 text-uppercase font-weight-bold ml-2"
            rounded="lg"
            :style="{ flex: '0 0 auto' }"
          >
            Áp dụng
          </v-btn>
        </v-sheet>

        <v-sheet class="mt-4">
          <div class="text-caption font-weight-bold text-grey pa-2 bg-grey-lighten-3">
            SẴN SÀNG SỬ DỤNG
          </div>

          <v-list v-if="availableVouchers.length" class="voucher-list">
            <v-list-item 
              v-for="item in availableVouchers" 
              :key="item.id" 
              class="mb-3 rounded-lg border"
            >
              <div class="d-flex align-stretch voucher-container">
                <!-- Phần bên trái với hình ảnh và đường cắt nét đứt -->
                <div class="voucher-left">
                  <v-img 
                    :src="item.image_url" 
                    width="140"
                    height="140"
                    cover 
                    class="rounded-l-lg"
                  />
                  <div class="dotted-border"></div>
                </div>
                
                <!-- Phần thông tin bên phải -->
                <div class="voucher-content pa-3 flex-grow-1">
                  <div>
                    <div class="text-subtitle-1 font-weight-bold mb-1">
                      {{ item.description }}
                    </div>
                    <div class="d-flex align-center text-grey-darken-1 text-caption">
                      <v-icon size="14" class="mr-1">mdi-clock-outline</v-icon>
                      HSD: {{ formatDate(item.expire_at) }}
                    </div>
                  </div>
                  
                  <div class="d-flex justify-space-between align-center mt-2">
                    <div class="text-primary text-caption font-weight-medium">
                      Mã: {{ item.code }}
                    </div>
                    <v-btn 
                      color="primary" 
                      @click="handleChooseVoucher(item)"
                      variant="tonal"
                      density="comfortable"
                      class="text-caption px-3"
                    >
                      Áp dụng
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-list-item>
          </v-list>
          
          <v-sheet v-else class="pa-4 text-center">
            <v-icon icon="mdi-ticket-off" size="40" color="grey" class="mb-2"/>
            <div class="text-body-1 text-grey">Hiện không có voucher khả dụng</div>
          </v-sheet>
        </v-sheet>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { useVoucherStore } from '@/stores/voucher'
import { useNotificationStore } from '@/stores/notification'

export default {
  name: "EditVoucherDialog",

  props: {
    totalPrice: {
      type: Number,
      required: true
    },
    modelValue: {
      type: Object,
      default: null
    }
  },

  setup() {
    const voucherStore = useVoucherStore()
    const notificationStore = useNotificationStore()
    return { voucherStore, notificationStore }
  },

  data() {
    return {
      dialog: false,
      voucher_code: "",
      selectedVoucher: null,
      isApplying: false
    }
  },

  watch: {
    modelValue: {
      immediate: true,
      handler(newValue) {
        this.selectedVoucher = newValue
      }
    }
  },

  created() {
    this.voucherStore.fetchVouchers()
  },

  computed: {
    availableVouchers() {
      return this.voucherStore.availableVouchers
    }
  },

  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN').format(price)
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('vi-VN')
    },

    handleChooseVoucherCode() {
      if (!this.voucher_code.trim()) {
        return this.notificationStore.error('Vui lòng nhập mã khuyến mãi', 3000)
      }
      const voucher = this.availableVouchers.find(
        v => v.code.toLowerCase() === this.voucher_code.trim().toLowerCase()
      )
      if (!voucher) {
        return this.notificationStore.error('Không tìm thấy mã khuyến mãi', 3000)
      }

      this.applyVoucher(voucher)
    },

    handleChooseVoucher(voucher) {
      if (this.totalPrice < voucher.min_order_amount) {
        const remaining = voucher.min_order_amount - this.totalPrice
        return this.notificationStore.info(
          `Mua thêm ${this.formatPrice(remaining)}đ để sử dụng voucher`,
          3000
        )
      }

      this.applyVoucher(voucher)
    },

    applyVoucher(voucher) {
      const voucherData = {
        id: voucher.id,
        description: voucher.description,
        price: this.calculateDiscountAmount(voucher),
        discount_percent: voucher.discount_percent,
        discount_type: voucher.discount_type,
        code: voucher.code,
        min_order_amount: voucher.min_order_amount,
        max_discount_amount: voucher.max_discount_amount
      }

      this.voucherStore.setSelectedVoucher(voucherData)
      this.$emit('voucher-selected', voucherData)
      this.dialog = false
      this.notificationStore.success('Áp dụng voucher thành công', 3000)
    },

    calculateDiscountAmount(voucher) {
      if (voucher.discount_type === 'PERCENT') {
        const discountAmount = (this.totalPrice * voucher.discount_percent) / 100
        return Math.min(discountAmount, voucher.max_discount_amount)
      }
      return voucher.max_discount_amount
    }
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.voucher-list :deep(.v-list-item) {
  min-height: unset;
  padding: 0;
  background-color: rgb(250, 250, 250);
  transition: all 0.2s ease;
}

.voucher-list :deep(.v-list-item:hover) {
  transform: translateY(-2px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.center-input :deep(input) {
  text-align: left;
}

.center-input :deep(.v-field__input) {
  min-height: unset;
  padding-top: 0;
  padding-bottom: 0;
  display: flex;
  align-items: center;
}

.voucher-container {
  height: 140px;
  background: white;
}

.voucher-left {
  position: relative;
  width: 140px;
  flex-shrink: 0;
}

.dotted-border {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  border-right: 2px dashed #e0e0e0;
}

.voucher-content {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px !important;
}

.header-fixed {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  min-height: 48px;
}
</style>