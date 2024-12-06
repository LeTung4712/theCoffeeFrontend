<template>
  <div class="address-tab pa-4">
    
    <h2 class="text-h5 font-weight-bold mb-2">Địa chỉ giao hàng</h2>
    
    <v-list v-if="addresses.length" class="bg-grey-lighten-4 rounded-lg pa-3">
      <v-list-item
        v-for="address in addresses"
        :key="address.id"
        class="mb-3"
      >
        <template v-slot:prepend>
          <v-icon color="primary" class="mr-3">mdi-map-marker</v-icon>
        </template>
        
        <v-list-item-content>
          <v-list-item-title class="font-weight-medium mb-1">
            {{ address.address }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-grey">
            {{ address.mobile_no || 'Chưa có số điện thoại' }}
          </v-list-item-subtitle>
          <v-list-item-subtitle class="text-grey-darker">
            {{ address.address_type }} - {{ address.is_default ? 'Mặc định' : '' }}
          </v-list-item-subtitle>
        </v-list-item-content>

      </v-list-item>
    </v-list>

    <v-alert
      v-else
      type="info"
      text="Bạn chưa có địa chỉ giao hàng nào"
      class="mt-4"
    ></v-alert>
  </div>
</template>

<script>
export default {
  name: 'AddressTab',
  props: {
    addresses: {
      type: Array,
      default: () => []
    }
  }
}
</script> 