<template>
  <v-bottom-navigation class="mobile-nav d-sm-none" fixed grow color="primary" height="56">
    <v-btn v-for="item in navItems" :key="item.title" :to="item.to" class="nav-btn">
      <v-icon size="24">{{ item.icon }}</v-icon>
      <span class="nav-text">{{ item.title }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  name: 'MobileNavBar',
  data() {
    return {
      navItems: [
        { title: 'Trang chủ', icon: 'mdi-home', to: '/mainpage' },
        { title: 'Đặt hàng', icon: 'mdi-coffee', to: '/collections/menu/0' },
        { title: 'Tin tức', icon: 'mdi-newspaper', to: '/blog' },
        { title: 'Cửa hàng', icon: 'mdi-store', to: '/store' },
      ]
    }
  }
}
</script>

<style scoped>
.mobile-nav {
  z-index: 999;
  position: fixed !important;
  bottom: 0 !important;
  left: 0;
  right: 0;
  width: 100%;
  height: 56px !important;
}

.nav-btn {
  flex-direction: column !important;
  height: 100% !important;
  padding: 6px 0 !important;
}

.nav-text {
  font-size: 0.75rem !important;
  line-height: 1.2 !important;
  margin-top: 4px !important;
  white-space: nowrap;
  display: block !important;
}

.v-icon {
  margin-bottom: 2px;
}
</style>