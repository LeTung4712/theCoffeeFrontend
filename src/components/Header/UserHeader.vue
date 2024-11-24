<template>
  <v-app-bar id="myHeader" class="header-user" :elevation="0">
    <v-container class="pa-0 d-flex align-center" style="height: 100%">
      <v-row align="center" justify="space-between" no-gutters style="height: 100%">
        <!-- Logo - Chỉ hiện trên desktop -->
        <v-col cols="auto" class="pl-4 d-none d-sm-flex">
          <v-btn variant="text" href="/" class="pa-0">
            <v-img :src="logo" width="180" height="60" />
          </v-btn>
        </v-col>

        <!-- Delivery Button -->
        <v-col cols="auto" class="ml-2 ml-sm-4 py-2">
          <delivery-address-button v-model="oldAddress" />
        </v-col>

        <!-- Navigation Menu - Chỉ hiện trên desktop -->
        <v-col class="d-none d-sm-flex">
          <v-row justify="center" align="center" class="fill-height">
            <v-col cols="auto" v-for="item in menuItems" :key="item.title">
              <v-btn 
                variant="text"
                :to="item.to"
                class="text-none font-weight-medium px-4"
                color="text-primary"
                height="48"
              >
                {{ item.title }}
              </v-btn>
            </v-col>
          </v-row>
        </v-col>

        <!-- User Menu & Cart -->
        <v-col cols="auto" class="pr-4">
          <v-row no-gutters align="center">
            <!-- User Menu -->
            <v-col cols="auto">
              <v-menu v-model="displayClick" location="bottom" :close-on-content-click="false">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" icon variant="text" height="48">
                    <v-avatar size="40">
                      <v-img :src="userAvatar" />
                    </v-avatar>
                    <!-- Tên user chỉ hiện trên desktop -->
                    <span v-if="logged" class="ml-2 text-body-1 d-none d-sm-flex">
                      {{ user.last_name }}
                    </span>
                  </v-btn>
                </template>

                <v-list>
                  <template v-if="logged">
                    <v-list-item
                      v-for="(item, index) in userMenuItems"
                      :key="index"
                      :prepend-icon="item.icon"
                      :title="item.title"
                      @click="handelClickInfo(item.route)"
                    />
                    <v-divider />
                    <v-list-item
                      prepend-icon="mdi-logout"
                      title="Thoát"
                      @click="logout"
                    />
                  </template>
                  <template v-else>
                    <v-list-item>
                      <!-- <authentication-user /> -->
                    </v-list-item>
                  </template>
                </v-list>
              </v-menu>
            </v-col>

            <!-- Cart Button -->
            <v-col cols="auto" class="ml-2 ml-sm-6">
              <v-btn icon variant="text" @click="handelClickCart" height="48">
                <v-badge
                  :content="itemCount"
                  color="error"
                  location="bottom start"
                  :dot="false"
                  offset-x="0"
                  offset-y="0"
                  v-if="itemCount > 0"
                >
                  <v-icon color="primary" size="32">mdi-cart</v-icon>
                </v-badge>
                <v-icon v-else color="primary" size="32">mdi-cart</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
import { ROUTES } from '@/constants/routes'
import logoImage from '@/assets/logo.png'
import DeliveryAddressButton from './DeliveryAddressButton.vue'

export default {
  name: "UserHeader",
  
  components: {
    DeliveryAddressButton
  },

  data() {
    return {
      oldAddress: "...",
      logged: false,
      user: {},
      itemCount: 0,
      displayClick: false,
      menuItems: [
        { title: 'Menu', to: '/collections/menu' },
        { title: 'Tin tức', to: '/blogs' },
        { title: 'Cửa hàng', to: '/store' },
        { title: 'Khuyến mãi', to: '/promotion' },
        { title: 'Tuyển dụng', to: '/job' },
      ],
      userMenuItems: [
        { title: 'Thông tin tài khoản', icon: 'mdi-account', route: 'user-info' },
        { title: 'Sổ địa chỉ', icon: 'mdi-book', route: 'so-dia-chi' },
        { title: 'Lịch sử mua hàng', icon: 'mdi-history', route: 'lich-su' },
      ],
      logo: logoImage
    }
  },

  computed: {
    userAvatar() {
      return this.logged
        ? 'https://th.bing.com/th/id/OIP.4bP4PqQqYnMYbub5PNgXeQHaEK?w=311&h=180&c=7&r=0&o=5&pid=1.7'
        : 'https://order.thecoffeehouse.com/_nuxt/img/Login.70dc3d8.png'
    }
  },

  created() {
    this.initializeData()
  },

  mounted() {
    this.setupEventListeners()
  },

  methods: {
    initializeData() {
      const order = localStorage.getItem("order")
      this.itemCount = order ? JSON.parse(order).length : 0

      const user = localStorage.getItem("user") 
      if (user) {
        this.user = JSON.parse(user)
        this.logged = true
      }
    },

    setupEventListeners() {
      window.addEventListener("order-localstorage-changed", this.handleOrderChange)
      window.addEventListener("scroll", this.handleScroll)
    },

    handleOrderChange(event) {
      const storage = event.detail.storage
      this.itemCount = storage ? JSON.parse(storage).length : 0
    },

    handleScroll() {
      const header = document.getElementById("myHeader")
      if (header) {
        const sticky = header.offsetTop
        header.classList.toggle("sticky", window.scrollY > sticky)
      }
    },

    handelClickInfo(route) {
      // Xử lý khi click vào menu item
    },

    logout() {
      // Xử lý khi click vào menu item "Thoát"
    },

    handelClickCart() {
      this.$router.push(ROUTES.CHECKOUT)
    }
  },

  beforeUnmount() {
    window.removeEventListener("order-localstorage-changed", this.handleOrderChange)
    window.removeEventListener("scroll", this.handleScroll) 
  }
}
</script>

<style scoped>
.header-user {
  background-color: var(--tch-primary);
  height: 75px;
  border-bottom: 1px solid var(--tch-border-color);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
}

/* Điều chỉnh chiều cao header trên mobile */
@media (max-width: 599px) {
  .header-user {
    height: 64px;
  }
}

.v-btn {
  text-transform: none !important;
  letter-spacing: 0;
  color: var(--tch-text-primary) !important;
  transition: var(--tch-transition);
  height: auto !important;
  display: flex;
  align-items: center;
}

.v-btn:hover {
  opacity: 0.8;
}

.v-menu {
  background-color: var(--tch-background);
  border-radius: var(--tch-border-radius);
  box-shadow: var(--tch-shadow);
}

.v-badge__badge {
  font-size: 12px;
  padding: var(--tch-spacing-xs);
}

.v-avatar, .v-icon {
  margin: auto 0;
}
</style>
