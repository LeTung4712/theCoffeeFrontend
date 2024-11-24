<template>
  <div>
    <v-card-title class="text-h6 font-weight-bold">
      Phương thức thanh toán
    </v-card-title>

    <v-radio-group v-model="selectedPayment" class="pa-4">
      <v-radio
        v-for="method in paymentMethods"
        :key="method.value"
        :value="method.value"
        :label="method.label"
      >
        <template #label>
          <div class="d-flex align-center">
            <v-img :src="method.image" width="24" height="24" class="mr-2"/>
            <span>{{ method.label }}</span>
          </div>
        </template>
      </v-radio>
    </v-radio-group>

    <v-checkbox
      checked
      disabled
      label="Đồng ý với các điều khoản và điều kiện mua hàng của The Coffee House"
      class="pa-4"
    >
      <template #label>
        <span>
          Đồng ý với các 
          <a href="#" class="text-orange">điều khoản và điều kiện</a>
          mua hàng của The Coffee House
        </span>
      </template>
    </v-checkbox>
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
          image: 'https://minio.thecoffeehouse.com/image/tchmobileapp/1120_1119_ShopeePay-Horizontal2_O.png',
          enabled: true
        },
        {
          value: 'atm',
          label: 'Thẻ ngân hàng',
          image: 'https://minio.thecoffeehouse.com/image/tchmobileapp/385_ic_atm@3x.png',
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