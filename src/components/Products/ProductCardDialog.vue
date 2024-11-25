<template>
  <div>
    <v-dialog v-model="dialogVisible" :width="$vuetify.display.mobile ? '100%' : '530'" persistent>
      <!-- Activator -->
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          icon="mdi-plus-circle"
          color="primary"
          variant="text"
          size="x-large"
          title="thêm vào giỏ hàng"
          class="scale-button"
        />
      </template>

      <!-- Dialog Content -->
      <v-card class="rounded-lg dialog-card d-flex flex-column">
        <!-- Header -->
        <v-card-title class="d-flex align-center py-3 px-4 bg-white border-bottom dialog-header">
          <v-btn
            icon="mdi-close"
            variant="text"
            density="comfortable"
            @click="closeDialog"
            class="mr-2"
          />
          <span class="mx-auto text-subtitle-1 font-weight-bold text-primary">Thêm món mới</span>
        </v-card-title>

        <!-- Body -->
        <v-card-text class="pa-4 bg-white dialog-content flex-grow-1">
          <!-- Product Info -->
          <v-row no-gutters class="rounded-lg pa-3 border">
            <v-col cols="5" sm="5">
              <v-img
                :src="image_url"
                :height="$vuetify.display.mobile ? '150' : '204'"
                :width="$vuetify.display.mobile ? '150' : '204'"
                cover
                class="rounded-lg bg-grey-lighten-3 mx-auto"
              />
            </v-col>

            <v-col cols="7" sm="7" class="pl-4">
              <div class="d-flex flex-column h-100">
                <div class="text-subtitle-1 font-weight-bold mb-1">{{ name }}</div>
                <div class="text-body-2 text-grey-darken-1 mb-auto description-container">
                  <div :class="{'truncated': !showFullDescription}" ref="descriptionText">{{ description }}</div>
                  <div v-if="isDescriptionLong" @click="toggleDescription" class="read-more-btn">
                    {{ showFullDescription ? 'Thu gọn' : 'Xem thêm' }}
                  </div>
                </div>
                
                <div class="d-flex justify-space-between align-center mt-2">
                  <span class="text-subtitle-1 font-weight-bold">{{ formatPrice(price) }}đ</span>
                  <v-btn-group variant="outlined" color="primary" rounded="lg" class="quantity-group">
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
        <v-card-actions class="pa-4 bg-white border-top dialog-footer">
          <v-btn
            block
            color="primary"
            variant="flat"
            :height="$vuetify.display.mobile ? '48' : '52'"
            rounded="pill"
            class="text-capitalize font-weight-bold text-white"
            @click="addToCart"
            :loading="isLoading"
            :disabled="isLoading"
          >
            <template v-if="!isLoading">
              {{ formatPrice(calculateTotalPrice()) }}đ - Thêm vào giỏ hàng
            </template>
            <template v-else>
              Đang tải...
            </template>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { productAPI } from "@/api/product";

export default {
  name: "CardProductDialog",
  
  props: {
    currentID: String,
    id: Number,
    image_url: String,
    name: String,
    description: String, 
    price: String,
    dialog: {
      type: Boolean,
      default: false
    },
    isInProductListing: Number
  },

  data() {
    return {
      dialogVisible: false,
      quantity: 1,
      note: "",
      product: {
        id: 0,
        name: "",
        description: "",
        price: 0,
        image_url: "",
      },
      size: 'S',
      checked_topping: [],
      topping_items: [
        {
          id: 1,
          name: "Topping 1",
          price: 10000
        },
        {
          id: 2,
          name: "Topping 2",
          price: 15000
        }
      ],
      sizeOptions: [
        { label: 'Lớn', value: 'L', price: 10000 },
        { label: 'Vừa', value: 'M', price: 6000 },
        { label: 'Nhỏ', value: 'S', price: 0 }
      ],
      showFullDescription: false,
      isDescriptionLong: false,
      isLoading: false,
    }
  },

  computed: {
    hasToppings() {
      return this.topping_items.length > 1
    }
  },

  watch: {
    dialogVisible: {
      immediate: true,
      handler(val) {
        if (val) {
          this.fetchProductInfo()
        }
      }
    }
  },

  mounted() {
    this.$nextTick(() => {
      if (this.$refs.descriptionText) {
        const lineHeight = parseInt(window.getComputedStyle(this.$refs.descriptionText).lineHeight);
        const height = this.$refs.descriptionText.offsetHeight;
        this.isDescriptionLong = height > (lineHeight * 4);
      }
    });
  },

  methods: {
    async fetchProductInfo() {
      if (!this.id) return;
      
      this.isLoading = true;
      
      try {
        const response = await productAPI.getInfo({
          params: { product_id: this.id }
        });
        const data = response.data;
        this.product = {
          ...data.product,
          price: this.price
        };
        this.topping_items = data.toppings.map(topping => ({
          ...topping,
          count: 0
        }));
      } catch (error) {
        console.error("Failed to fetch product info:", error);
        this.product = {
          id: this.id,
          name: this.name,
          description: this.description,
          price: this.price,
          image_url: this.image_url
        };
      } finally {
        this.isLoading = false;
      }
    },

    increaseQuantity() {
      this.quantity++
    },

    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--
      }
    },

    calculateTotalPrice() {
      const basePrice = parseInt(this.price || 0);
      const toppingPrice = this.checked_topping.reduce((sum, topping) => 
        sum + parseInt(topping.price), 0);
      const sizePrice = this.sizeOptions.find(opt => opt.value === this.size)?.price || 0;
      
      return (basePrice + toppingPrice + sizePrice) * this.quantity;
    },

    formatPrice(price) {
      return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    addToCart() {
      const entry = {
        id: this.id,
        product_item: {
          id: this.id,
          image_url: this.image_url,
          name: this.name,
          description: this.description,
          price: this.price
        },
        size: this.size,
        count: this.quantity,
        topping_items: this.topping_items.map(topping => ({
          ...topping,
          count: this.checked_topping.some(t => t.id === topping.id) ? 1 : 0
        })),
        note: this.note
      };

      // Update localStorage
      const order = JSON.parse(localStorage.getItem("order") || "[]");
      order.push(entry);
      localStorage.setItem("order", JSON.stringify(order));
      localStorage.setItem("entry", JSON.stringify(entry));

      // Dispatch event
      window.dispatchEvent(new CustomEvent('order-localstorage-changed', {
        detail: { storage: localStorage.getItem('order') }
      }));

      this.resetForm();
    },

    resetForm() {
      this.dialogVisible = false;
      this.quantity = 1;
      this.size = 'S';
      this.note = '';
      this.checked_topping = [];
      localStorage.setItem('info_size', 'S');
      localStorage.setItem('topping_counts', JSON.stringify([0, 0, 0, 0, 0]));
    },

    closeDialog() {
      this.dialogVisible = false;
      this.resetForm();
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

/* Thêm hiệu ứng hover cho các nút */
.v-btn:hover {
  opacity: 0.9;
}

/* Animation cho dialog */
.v-dialog-transition-enter-active,
.v-dialog-transition-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-dialog-transition-enter-from,
.v-dialog-transition-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Thêm các styles mới */
.v-dialog {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08) !important;
}

.v-card {
  border: none !important;
  background-color: white !important;
}

.v-btn-group {
  border: 1px solid var(--tch-primary) !important;
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

/* Style cho nút thêm vào giỏ hàng */
.v-btn.v-btn--size-large {
  letter-spacing: 0.5px;
  font-size: 1rem;
}

.v-btn.v-btn--size-large:hover {
  opacity: 0.95;
  transform: translateY(-1px);
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(var(--tch-primary), 0.2);
}

.v-btn.v-btn--size-large:active {
  transform: translateY(0);
}

/* Thêm các style mới cho mobile */
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
  }

  .quantity-group {
    transform: scale(0.9);
  }

  /* Điều chỉnh padding và margin cho mobile */
  .v-card-title {
    font-size: 1.1rem !important;
  }

  .v-card-text {
    padding: 12px !important;
  }

  .border {
    padding: 8px !important;
  }

  /* Tối ưu scrolling trên mobile */
  .v-card-text::-webkit-scrollbar {
    width: 4px;
  }
}

/* Animation cho bottom sheet trên mobile */
@media (max-width: 600px) {
  .v-dialog-transition-enter-active,
  .v-dialog-transition-leave-active {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .v-dialog-transition-enter-from,
  .v-dialog-transition-leave-to {
    transform: translateY(100%);
  }
}

.quantity-group {
  border: 1px solid var(--tch-primary) !important;
  height: 40px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.quantity-group .v-btn {
  color: var(--tch-primary) !important;
}

.quantity-group .v-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  height: 60%;
  width: 1px;
  background-color: var(--tch-primary);
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

@media (max-width: 600px) {
  .quantity-group {
    height: 36px;
  }

  .quantity-text {
    min-width: 36px;
    font-size: 0.95rem;
  }
}

.scale-button {
  transform: scale(1.9);
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
  color: var(--tch-primary);
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  margin-top: 4px;
}

.read-more-btn:hover {
  text-decoration: underline;
}

/* Điều chỉnh style cho radio group trên mobile */
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

/* Thêm style cho trạng thái loading */
.v-btn--loading {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Cập nhật style cho border chung */
.border {
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
}

.border-top {
  border-top: 1px solid rgba(0, 0, 0, 0.08) !important;
}

/* Thêm hiệu ứng hover cho quantity group */
.quantity-group:hover {
  border-color: var(--tch-primary) !important;
  opacity: 0.85;
}

.quantity-group .v-btn:hover {
  background-color: rgba(76, 175, 80, 0.05) !important; /* --tch-primary với opacity */
}

/* Thêm styles mới cho dialog layout */
.dialog-card {
  height: 100%;
  max-height: 100vh;
}

.dialog-header {
  position: sticky;
  top: 0;
  z-index: 1;
  background: white;
}

.dialog-content {
  overflow-y: auto;
  flex: 1;
}

.dialog-footer {
  position: sticky;
  bottom: 0;
  z-index: 1;
  background: white;
}

/* Cập nhật mobile styles */
@media (max-width: 600px) {
  .dialog-card {
    max-height: 90vh;
    height: 90vh;
  }

  .dialog-content {
    padding: 12px !important;
    max-height: none !important; /* Xóa max-height cũ */
  }
}
</style>