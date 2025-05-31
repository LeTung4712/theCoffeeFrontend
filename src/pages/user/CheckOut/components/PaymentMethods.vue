<template>
  <div>
    <v-card-title class="text-h6 font-weight-bold mb-4">
      Phương thức thanh toán
    </v-card-title>

    <v-radio-group v-model="selectedPayment" class="payment-methods-group">
      <div v-for="method in paymentMethods" :key="method.value"
        :class="['payment-method', { 'selected': selectedPayment === method.value }]"
        @click="selectedPayment = method.value">
        <v-radio :value="method.value" hide-details class="pa-0 payment-radio">
          <template #label>
            <div class="d-flex align-center py-3 px-4">
              <v-img :src="method.image" width="32" height="32" class="mr-4 payment-icon"
                :class="{ 'selected-icon': selectedPayment === method.value }" />
              <span class="font-weight-medium payment-label">{{ method.label }}</span>
            </div>
          </template>
        </v-radio>
      </div>
    </v-radio-group>
  </div>
</template>

<script>
export default {
  name: 'PaymentMethods',

  data() {
    return {
      selectedPayment: 'cod',
      paymentMethods: [
        {
          value: 'cod',
          label: 'Tiền mặt',
          image: 'https://minio.thecoffeehouse.com/image/tchmobileapp/1000_photo_2021-04-06_11-17-08.jpg',
          enabled: true
        },
        {
          value: 'momo',
          label: 'Momo',
          image: 'https://minio.thecoffeehouse.com/image/tchmobileapp/386_ic_momo@3x.png',
          enabled: true
        },
        {
          value: 'vnpay',
          label: 'VNPAY',
          image: 'https://minio.thecoffeehouse.com/image/admin/1690094645_362961302-6516710751684191-4996740142959914656-n.png',
          enabled: true
        },
        {
          value: 'zalopay',
          label: 'ZaloPay',
          image: 'https://minio.thecoffeehouse.com/image/tchmobileapp/388_ic_zalo@3x.png',
          enabled: true
        }
      ].filter(method => method.enabled)
    }
  },

  watch: {
    selectedPayment(newValue) {
      this.$emit('payment-method-changed', newValue)
    }
  }
}
</script>

<style scoped>
.payment-methods-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 16px;
}

.payment-method {
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
}

.payment-method:hover {
  transform: translateY(-2px);
  background-color: #f5f5f5;
  border-color: #bdbdbd;
}

.payment-method.selected {
  background-color: #e3f2fd;
  border-color: #1976d2;
}

.payment-radio {
  opacity: 1 !important;
}

.payment-icon {
  opacity: 1;
  object-fit: contain;
  display: block;
  background-color: #fff;
  padding: 4px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.payment-method:not(.selected) .payment-icon {
  opacity: 1;
}

.selected-icon {
  opacity: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.payment-label {
  color: #1a1a1a;
  font-weight: 500;
}

.payment-method.selected .payment-label {
  color: #1976d2;
  font-weight: 600;
}

:deep(.v-radio) {
  opacity: 1 !important;
}

:deep(.v-radio__label) {
  opacity: 1 !important;
}
</style>