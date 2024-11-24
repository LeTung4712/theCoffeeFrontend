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
              color="warning"
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
            color="warning"
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
          color="warning-darken-2"
          :height="$vuetify.display.mobile ? '48' : '52'"
          rounded="pill"
          class="text-capitalize font-weight-bold text-white"
          :style="{ backgroundColor: '#d46b08' }"
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
      return this.topping_items?.length > 0;
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
      const basePrice = parseInt((this.product && this.product.price) || (this.order && this.order.product_item && this.order.product_item.price) || 0);
      const toppingPrice = this.checked_topping.reduce((sum, topping) => 
        sum + parseInt(topping.price), 0);
      const sizePrice = this.sizeOptions.find(opt => opt.value === this.size)?.price || 0;
      
      return (basePrice + toppingPrice + sizePrice) * this.quantity;
    },

    formatPrice(price) {
      return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    async saveChanges() {
      this.isLoading = true;

      try {
        const updatedOrder = {
          ...this.order,
          product_item: this.product || this.order.product_item,
          count: this.quantity,
          size: this.size,
          note: this.note,
          topping_items: this.topping_items.map(topping => ({
            ...topping,
            count: this.checked_topping.some(t => t.id === topping.id) ? 1 : 0
          }))
        };

        this.$emit('save', updatedOrder);
        this.closeDialog();
      } catch (error) {
        console.error("Lỗi khi cập nhật:", error);
      } finally {
        this.isLoading = false;
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
.dialog-card {
  position: relative;
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

.mobile-card-content {
  padding-bottom: 80px !important; /* Để tránh nội dung bị footer che khuất */
}

.v-btn--loading {
  opacity: 0.7;
  cursor: not-allowed;
}
</style> 