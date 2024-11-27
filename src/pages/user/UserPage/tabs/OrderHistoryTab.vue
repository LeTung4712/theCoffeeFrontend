<template>
  <div class="order-history-tab">
    <v-text-field
      v-model="searchLocal"
      label="Tìm kiếm đơn hàng"
      @input="$emit('update:search', searchLocal)"
    />
    <v-list>
      <v-list-item v-for="order in orders" :key="order.order_id">
        <v-list-item-title>Đơn hàng: {{ order.order_id }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'OrderHistoryTab',
  props: {
    orders: {
      type: Array,
      default: () => []
    },
    search: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      searchLocal: this.search
    }
  }
}
</script> 