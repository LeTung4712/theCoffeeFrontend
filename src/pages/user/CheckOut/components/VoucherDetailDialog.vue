<template>
  <v-dialog v-model="dialog" :max-width="$vuetify.display.mobile ? '100%' : '500'"
    :max-height="$vuetify.display.mobile ? '80vh' : 'auto'" :class="{ 'mobile-dialog': $vuetify.display.mobile }">
    <v-card>
      <v-card-title class="d-flex align-center pa-2 border-b header-fixed">
        <span class="mx-auto text-subtitle-1 font-weight-bold">Chi tiết khuyến mãi</span>
        <v-btn icon="mdi-close" variant="text" @click="dialog = false" class="ml-n1" density="comfortable"
        size="small" />
      </v-card-title>

      <v-card-text class="pa-4">
        <!-- Header với hình ảnh và thông tin cơ bản -->
        <div class="d-flex align-center mb-4">
          <v-avatar size="64" class="rounded-lg mr-4">
            <v-img :src="voucher.image_url" :alt="voucher.name" cover>
              <template v-slot:placeholder>
                <v-icon icon="mdi-tag" size="large" color="primary"></v-icon>
              </template>
            </v-img>
          </v-avatar>
          <div>
            <div class="text-h6 font-weight-bold mb-1">{{ voucher.name }}</div>
            <div class="text-subtitle-2 text-medium-emphasis">{{ voucher.description }}</div>
          </div>
        </div>

        <!-- Thông tin chi tiết -->
        <v-list class="bg-transparent">
          <v-list-item>
            <template v-slot:prepend>
              <v-icon icon="mdi-tag" color="primary"></v-icon>
            </template>
            <v-list-item-title class="text-subtitle-2">Mã khuyến mãi</v-list-item-title>
            <template v-slot:append>
              <v-chip color="primary" variant="outlined" class="font-weight-bold">
                {{ voucher.code }}
              </v-chip>
            </template>
          </v-list-item>

          <v-list-item>
            <template v-slot:prepend>
              <v-icon icon="mdi-percent" color="primary"></v-icon>
            </template>
            <v-list-item-title class="text-subtitle-2">Giảm giá</v-list-item-title>
            <template v-slot:append>
              <span class="text-primary font-weight-bold">
                <template v-if="voucher.discount_type === 'percent'">
                  {{ voucher.discount_percent }}%
                </template>
                <template v-else>
                  {{ formattedPrice(voucher.max_discount_amount) }}
                </template>
              </span>
            </template>
          </v-list-item>

          <v-list-item>
            <template v-slot:prepend>
              <v-icon icon="mdi-clock-outline" color="primary"></v-icon>
            </template>
            <v-list-item-title class="text-subtitle-2">Thời gian</v-list-item-title>
            <template v-slot:append>
              <span class="text-medium-emphasis">
                {{ formatDate(voucher.expire_at) }}
              </span>
            </template>
          </v-list-item>

          <v-list-item>
            <template v-slot:prepend>
              <v-icon icon="mdi-currency-usd" color="primary"></v-icon>
            </template>
            <v-list-item-title class="text-subtitle-2">Điều kiện áp dụng</v-list-item-title>
            <template v-slot:append>
              <span class="text-medium-emphasis">
                Đơn hàng từ {{ formattedPrice(voucher.min_order_amount) }}
              </span>
            </template>
          </v-list-item>
        </v-list>

        <!-- Điều khoản và điều kiện -->
        <v-expansion-panels class="mt-4">
          <v-expansion-panel>
            <v-expansion-panel-title class="text-subtitle-2 font-weight-bold">
              Điều khoản và điều kiện
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list class="bg-transparent pa-0">
                <v-list-item v-if="voucher.limit_per_user" class="pa-0">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-account-multiple" color="primary" size="small"></v-icon>
                  </template>
                  <v-list-item-title class="text-body-2">
                    Giới hạn {{ voucher.limit_per_user }} lần sử dụng cho mỗi người dùng
                  </v-list-item-title>
                </v-list-item>

                <v-list-item class="pa-0">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-cart" color="primary" size="small"></v-icon>
                  </template>
                  <v-list-item-title class="text-body-2">
                    Không áp dụng cho các sản phẩm đang giảm giá
                  </v-list-item-title>
                </v-list-item>

                <v-list-item class="pa-0">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-cash-multiple" color="primary" size="small"></v-icon>
                  </template>
                  <v-list-item-title class="text-body-2">
                    Không được cộng dồn với các chương trình khuyến mãi khác
                  </v-list-item-title>
                </v-list-item>

                <v-list-item class="pa-0">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-clock-alert" color="primary" size="small"></v-icon>
                  </template>
                  <v-list-item-title class="text-body-2">
                    Voucher có hiệu lực đến hết ngày {{ formatDate(voucher.expire_at) }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>

      <v-card-actions class="pa-4 pt-0">
        <v-btn block color="primary" @click="handleApplyVoucher" :disabled="!canApplyVoucher"
          class="text-uppercase font-weight-bold">
          {{ applyButtonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { formatPrice } from '@/utils/format'
import { useVoucherStore } from '@/stores/voucher'
import { useNotificationStore } from '@/stores/notification'

export default {
  name: 'VoucherDetailDialog',

  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    voucher: {
      type: Object,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    }
  },

  setup() {
    const voucherStore = useVoucherStore()
    const notificationStore = useNotificationStore()
    return { voucherStore, notificationStore }
  },

  computed: {
    dialog: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
    canApplyVoucher() {
      return this.totalPrice >= this.voucher.min_order_amount
    },
    applyButtonText() {
      if (!this.canApplyVoucher) {
        const remaining = this.voucher.min_order_amount - this.totalPrice
        return `Mua thêm ${this.formattedPrice(remaining)}đ để sử dụng`
      }
      return 'Áp dụng voucher'
    }
  },

  methods: {
    formattedPrice(price) {
      return formatPrice(price)
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    handleApplyVoucher() {
      if (!this.canApplyVoucher) {
        const remaining = this.voucher.min_order_amount - this.totalPrice
        return this.notificationStore.info(
          `Mua thêm ${this.formattedPrice(remaining)}đ để sử dụng voucher`,
          3000
        )
      }

      const voucherData = {
        id: this.voucher.id,
        description: this.voucher.description,
        discount_percent: this.voucher.discount_percent,
        discount_type: this.voucher.discount_type,
        code: this.voucher.code,
        min_order_amount: this.voucher.min_order_amount,
        max_discount_amount: this.voucher.max_discount_amount,
        limit_per_user: this.voucher.limit_per_user,
      }

      this.voucherStore.setSelectedVoucher(voucherData)
      this.$emit('voucher-selected', voucherData)
      this.dialog = false
      this.notificationStore.success('Áp dụng voucher thành công', 3000)
    }
  }
}
</script>

<style scoped>
.header-fixed {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  min-height: 48px;
}

@media (max-width: 600px) {
  :deep(.mobile-dialog) {
    position: fixed;
    bottom: 0;
    margin: 0;
    height: 80vh !important;
  }

  :deep(.mobile-dialog .v-card) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  :deep(.mobile-dialog .v-card-text) {
    flex: 1;
    overflow-y: auto;
  }
}
</style>