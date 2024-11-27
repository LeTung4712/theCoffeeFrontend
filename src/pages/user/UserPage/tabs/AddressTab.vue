<template>
  <div class="address-tab">
    <v-list>
      <v-list-item v-for="address in addresses" :key="address.id">
        <v-list-item-title>{{ address.address }}</v-list-item-title>
      </v-list-item>
    </v-list>
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