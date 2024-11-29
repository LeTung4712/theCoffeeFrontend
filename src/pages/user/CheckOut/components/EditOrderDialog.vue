<template>
  <v-dialog v-model="dialogVisible" :width="$vuetify.display.mobile ? '100%' : '530'" :persistent="false">
    <v-card class="rounded-lg dialog-card d-flex flex-column" style="max-height: 90vh;">
      <!-- Header -->
      <v-card-title class="d-flex align-center py-3 px-4 bg-white border-bottom sticky-header">
        <v-btn
          icon="mdi-close"
          variant="text"
          density="comfortable"
          @click="closeDialog"
          class="mr-2"
        />
        <span class="mx-auto text-subtitle-1 font-weight-bold text-warning-darken-2">Chỉnh sửa món</span>
      </v-card-title>

      <!-- Body -->
      <v-card-text class="pa-4 bg-white mobile-card-content flex-grow-1 overflow-y-auto">
        <!-- Product Info -->
        <v-row no-gutters class="rounded-lg pa-3 border">
          <v-col cols="5" sm="5">
            <v-img
              :src="(product && product.image_url) || (order && order.product_item && order.product_item.image_url)"
              :height="$vuetify.display.mobile ? '150' : '204'"
              :width="$vuetify.display.mobile ? '150' : '204'"
              cover
              class="rounded-lg bg-grey-lighten-3 mx-auto"
            />
          </v-col>

          <v-col cols="7" sm="7" class="pl-4">
            <div class="d-flex flex-column h-100">
              <div class="text-subtitle-1 font-weight-bold mb-1">
                {{ (product && product.name) || (order && order.product_item && order.product_item.name) }}
              </div>
              <div class="text-body-2 text-grey-darken-1 mb-auto description-container">
                <div :class="{'truncated': !showFullDescription}" ref="descriptionText">
                  {{ (product && product.description) || (order && order.product_item && order.product_item.description) }}
                </div>
                <div v-if="isDescriptionLong" @click="toggleDescription" class="read-more-btn">
                  {{ showFullDescription ? 'Thu gọn' : 'Xem thêm' }}
                </div>
              </div>
              
              <div class="d-flex justify-space-between align-center mt-2">
                <span class="text-subtitle-1 font-weight-bold">
                  {{ formatPrice((product && product.price) || (order && order.product_item && order.product_item.price)) }}đ
                </span>
                <v-btn-group variant="outlined" color="warning" rounded="lg" class="quantity-group">
                  <v-btn
                    icon="mdi-minus"
                    variant="text"
                    @click="decreaseQuantity"
                    :disabled="quantity <= 1"
                    density="comfortable"
                  />
                  <v-card-text class="quantity-text">
                    {{ quantity }}
                  </v-card-text>
                  <v-btn
                    icon="mdi-plus"
                    variant="text"
                    @click="increaseQuantity"
                    density="comfortable"
                  />
                </v-btn-group>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Note -->
        <v-text-field
          v-model="note"
          placeholder="Ghi chú thêm cho món này"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-note-text"
          class="mt-6"
          hide-details
          bg-color="grey-lighten-4"
        />

        <!-- Size Selection -->
        <template v-if="hasToppings">
          <div class="text-overline mt-6 mb-2 font-weight-medium">
            CHỌN SIZE (BẮT BUỘC)
          </div>
          <v-radio-group
            v-model="size"
            inline
            mandatory
            class="mt-0 size-radio-group" 
            density="comfortable"
          >
            <v-radio
              v-for="option in sizeOptions"
              :key="option.value"
              :value="option.value"
              color="primary"
              class="flex-grow-1 mx-4"
            >
              <template v-slot:label>
                <div class="d-flex flex-column">
                  <span class="font-weight-medium">{{ option.label }}</span>
                  <span class="text-caption text-grey-darken-1">
                    + {{ formatPrice(option.price) }}đ
                  </span>
                </div>
              </template>
            </v-radio>
          </v-radio-group>
        </template>

        <!-- Toppings -->
        <template v-if="hasToppings">
          <div class="text-overline mt-6 mb-2 font-weight-medium">
            CHỌN TOPPING (TÙY CHỌN)
          </div>
          <v-checkbox
            v-for="topping in topping_items"
            :key="topping.id"
            v-model="checked_topping"
            :value="topping"
            color="primary"
            density="comfortable"
            hide-details
            class="mb-2"
          >
            <template v-slot:label>
              <div class="d-flex flex-column">
                <span class="font-weight-medium">{{ topping.name }}</span>
                <span class="text-caption text-grey-darken-1">
                  + {{ formatPrice(topping.price) }}đ
                </span>
              </div>
            </template>
          </v-checkbox>
        </template>
      </v-card-text>

      <!-- Footer -->
      <v-card-actions class="pa-4 bg-white border-top sticky-footer">
        <v-btn
          block
          color="primary"
          variant="flat"
          :height="$vuetify.display.mobile ? '48' : '52'"
          rounded="pill"
          class="text-capitalize font-weight-bold text-white update-btn"
          @click="saveChanges"
          :loading="isLoading"
          :disabled="isLoading"
        >
          <template v-if="!isLoading">
            {{ formatPrice(calculateTotalPrice()) }}đ - Cập nhật
          </template>
          <template v-else>
            Đang tải...
          </template>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { productAPI } from "@/api/product";
import { useCartStore } from '@/stores/cart'
import { useNotificationStore } from '@/stores/notification'
export default {
  name: 'EditOrderDialog',
  
  props: {
    modelValue: Boolean,
    order: Object
  },

  data() {
    return {
      isLoading: false,
      dialogVisible: false,
      quantity: 1,
      note: "",
      size: 'S',
      checked_topping: [],
      topping_items: [],
      sizeOptions: [
        { label: 'Lớn', value: 'L', price: 10000 },
        { label: 'Vừa', value: 'M', price: 6000 },
        { label: 'Nhỏ', value: 'S', price: 0 }
      ],
      showFullDescription: false,
      isDescriptionLong: false,
      product: null,
    }
  },

  watch: {
    modelValue: {
      immediate: true,
      async handler(val) {
        this.dialogVisible = val;
        if (val && this.order) {
          await this.fetchProductInfo();
          this.initializeData();
        }
      }
    },
    dialogVisible(val) {
      this.$emit('update:modelValue', val);
    }
  },

  computed: {
    hasToppings() {
      return this.topping_items?.length > 1;
    }
  },

  methods: {
    initializeData() {
      this.quantity = this.order.count || 1;
      this.size = this.order.size || 'S';
      this.note = this.order.note || '';
      this.topping_items = this.order.topping_items || [];
      this.checked_topping = this.topping_items.filter(t => t.count > 0);
    },

    increaseQuantity() {
      this.quantity++;
    },

    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },

    async fetchProductInfo() {
      if (!this.order?.product_item?.id) return;
      
      this.isLoading = true;
      
      try {
        const response = await productAPI.getInfo({
          params: { product_id: this.order.product_item.id }
        });
        const data = response.data;
        
        this.product = data.product;
        this.topping_items = data.toppings.map(topping => {
          const existingTopping = this.order.topping_items.find(t => t.id === topping.id);
          return {
            ...topping,
            count: existingTopping?.count || 0
          };
        });
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
        this.product = this.order.product_item;
        this.topping_items = this.order.topping_items || [];
      } finally {
        this.isLoading = false;
      }
    },

    calculateTotalPrice() {
      const basePrice = parseInt((this.product && this.product.price) || 
        (this.order && this.order.product_item && this.order.product_item.price) || 0)
      
      const toppingPrice = this.checked_topping.reduce((sum, topping) => 
        sum + parseInt(topping.price), 0)
      
      const sizePrice = this.sizeOptions.find(opt => opt.value === this.size)?.price || 0
      
      return (basePrice + toppingPrice + sizePrice) * this.quantity
    },

    formatPrice(price) {
      return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    async saveChanges() {
      this.isLoading = true
      const cartStore = useCartStore()
      const notificationStore = useNotificationStore()

      try {
        const updatedOrder = {
          ...this.order,
          product_item: this.product || this.order.product_item,
          count: this.quantity,
          total_amount: this.calculateTotalPrice(),
          size: this.size,
          note: this.note,
          topping_items: this.topping_items.map(topping => ({
            ...topping,
            count: this.checked_topping.some(t => t.id === topping.id) ? 1 : 0
          }))
        }

        cartStore.updateItem(updatedOrder)
        notificationStore.success('Cập nhật thành công!', 3000)
        this.closeDialog()
      } catch (error) {
        console.error("Lỗi khi cập nhật:", error)
        notificationStore.error('Có lỗi xảy ra khi cập nhật!', 3000)
      } finally {
        this.isLoading = false
      }
    },

    closeDialog() {
      this.dialogVisible = false;
    },

    toggleDescription() {
      this.showFullDescription = !this.showFullDescription;
    },
  }
}
</script>

<style scoped>
.v-dialog > .v-card {
  overflow: hidden !important;
}

.v-btn:hover {
  opacity: 0.9;
}

.v-dialog-transition-enter-active,
.v-dialog-transition-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-dialog-transition-enter-from,
.v-dialog-transition-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.v-dialog {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08) !important;
}

.v-card {
  border: none !important;
  background-color: white !important;
}

.v-btn-group {
  border: 1px solid var(--tch-warning) !important;
}

.v-text-field :deep(.v-field__outline) {
  border-radius: 12px !important;
}

.border-bottom {
  border-bottom: 1px solid var(--tch-border-color);
}

.border-top {
  border-top: 1px solid var(--tch-border-color);
}

.border {
  border: 1px solid var(--tch-border-color);
}

.update-btn {
  letter-spacing: 0.5px;
  font-size: 1rem;
}

.update-btn:hover {
  opacity: 0.95;
  transform: translateY(-1px);
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(var(--tch-primary), 0.2);
}

.update-btn:active {
  transform: translateY(0);
}

.dialog-card {
  margin: 0;
  height: 100%;
}

@media (max-width: 600px) {
  .v-dialog {
    margin: 0;
    position: fixed;
    bottom: 0;
    max-height: 90vh !important;
    border-radius: 16px 16px 0 0 !important;
  }

  .mobile-card-content {
    max-height: calc(90vh - 120px);
    overflow-y: auto;
    padding-bottom: 80px !important;
  }

  .quantity-group {
    transform: scale(0.9);
  }

  .v-card-title {
    font-size: 1.1rem !important;
  }

  .v-card-text {
    padding: 12px !important;
  }

  .border {
    padding: 8px !important;
  }
}

.quantity-group {
  border: 1px solid var(--tch-warning) !important;
  height: 40px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.quantity-group .v-btn {
  color: var(--tch-warning) !important;
}

.quantity-group .v-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  height: 60%;
  width: 1px;
  background-color: var(--tch-warning);
  opacity: 0.2;
  transform: translateY(-50%);
}

.quantity-text {
  min-width: 40px;
  padding: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: var(--tch-text-primary) !important;
  font-size: 1rem;
}

.description-container {
  position: relative;
}

.truncated {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.read-more-btn {
  color: var(--tch-warning);
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  margin-top: 4px;
}

.read-more-btn:hover {
  text-decoration: underline;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1;
  background: white;
}

.sticky-footer {
  position: sticky;
  bottom: 0;
  z-index: 1;
  background: white;
}

.v-btn--loading {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .size-radio-group {
    display: flex !important;
    flex-direction: row !important;
    justify-content: space-between !important;
    padding: 0 8px !important;
    margin: 0 -8px !important;
  }

  .size-radio-group :deep(.v-radio) {
    margin: 0 10px !important;
    padding: 0 !important;
    flex: 1;
    min-width: 0;
  }

  .size-radio-group :deep(.v-radio .v-label) {
    font-size: 0.9rem;
    white-space: nowrap;
  }

  .size-radio-group :deep(.v-radio .v-selection-control) {
    margin-inline-end: 4px !important;
  }
}
</style> 