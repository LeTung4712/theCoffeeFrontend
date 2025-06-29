<template>
  <v-app-bar id="myHeader" class="header-user" :elevation="0" color="primary">
    <v-container class="pa-0 d-flex align-center" style="height: 100%">
      <v-row align="center" justify="space-between" no-gutters style="height: 100%">
        <!-- Logo - Chỉ hiện trên desktop -->
        <v-col cols="auto" class="pl-0 d-none d-sm-flex">
          <v-btn variant="text" to="/mainpage" class="pa-0">
            <v-img :src="logo" alt="Logo" width="180" height="60" />
          </v-btn>
        </v-col>

        <!-- Delivery Button -->
        <v-col cols="auto" class="ml-2 ml-sm-4 py-2">
          <delivery-address-button v-model="oldAddress" @update:modelValue="handleAddressChange" />
        </v-col>

        <!-- Navigation Menu - Chỉ hiện trên desktop -->
        <v-col class="d-none d-sm-flex">
          <v-row justify="center" align="center" class="fill-height">
            <v-col cols="auto" v-for="item in menuItems" :key="item.title">
              <v-btn variant="text" :to="item.to" class="text-none font-weight-medium px-2" color="text-primary"
                height="48">
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
              <template v-if="logged">
                <v-menu v-model="displayClick" location="bottom" :close-on-content-click="false">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon variant="text" height="48" aria-label="Mở menu người dùng"
                      aria-haspopup="true" aria-expanded="false">
                      <v-avatar size="40">
                        <v-img :src="userAvatar" alt="Avatar của người dùng" />
                      </v-avatar>
                      <span class="ml-2 text-body-1 d-none d-sm-flex">
                        {{ user.last_name }}
                      </span>
                    </v-btn>
                  </template>

                  <v-list role="menu" aria-label="Menu người dùng">
                    <v-list-item v-for="(item, index) in userMenuItems" :key="index" :prepend-icon="item.icon"
                      :title="item.title" @click="handleClickInfo(item.route)" role="menuitem"
                      :aria-label="`Đi đến ${item.title}`" />
                    <v-divider role="separator" />
                    <v-list-item prepend-icon="mdi-logout" title="Thoát" @click="logout" role="menuitem"
                      aria-label="Đăng xuất khỏi tài khoản" />
                  </v-list>
                </v-menu>
              </template>
              <template v-else>
                <!-- Khi chưa đăng nhập, click avatar sẽ mở dialog -->
                <v-btn icon variant="text" height="48" @click="openLoginDialog" aria-label="Đăng nhập vào tài khoản">
                  <v-avatar size="40">
                    <v-img :src="userAvatar" alt="Avatar mặc định" />
                  </v-avatar>
                </v-btn>
                <!-- Login Popup -->
                <login-popup ref="loginPopup" @login-success="handleLoginSuccess" />
              </template>
            </v-col>

            <!-- Cart Button -->
            <v-col cols="auto" class="ml-2 ml-sm-6">
              <v-btn icon variant="text" @click="handelClickCart" height="48" aria-label="Xem giỏ hàng"
                :aria-describedby="cartStore.itemCount > 0 ? 'cart-count' : ''">
                <v-badge :content="cartStore.itemCount" color="error" location="bottom start" :dot="false" offset-x="0"
                  offset-y="0" v-if="cartStore.itemCount > 0" id="cart-count"
                  aria-label="Số lượng sản phẩm trong giỏ hàng">
                  <v-icon size="32" color="background" aria-hidden="true">mdi-cart</v-icon>
                </v-badge>
                <v-icon v-else size="32" color="white" aria-hidden="true">mdi-cart</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
import logoImage from '@/assets/logo.png'
import DeliveryAddressButton from './DeliveryAddressButton.vue'
import LoginPopup from '@/pages/user/Auth/LoginPopup.vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useNotificationStore } from '@/stores/notification'

export default {
  name: "UserHeader",

  components: {
    DeliveryAddressButton,
    LoginPopup
  },

  setup() {
    const cartStore = useCartStore()
    const authStore = useAuthStore()
    const notificationStore = useNotificationStore()
    return { cartStore, authStore, notificationStore }
  },

  data() {
    return {
      oldAddress: "...",
      drawer: false,
      group: null,
      displayClick: false,
      menuItems: [
        { title: 'Menu', to: '/collections/menu/0' },
        { title: 'Tin tức', to: '/tin-tuc' },
        { title: 'Cửa hàng', to: '/cua-hang' },
        { title: 'Về chúng tôi', to: '/ve-chung-toi' },
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
    logged() {
      return this.authStore.isUserLoggedIn
    },
    user() {
      return this.authStore.userInfo
    },
    userAvatar() {
      return this.logged
        ? 'https://th.bing.com/th/id/OIP.TqNTqcNAcekKylput9ydiwHaHa?w=198&h=198&c=7&r=0&o=5&pid=1.7'
        : 'https://order.thecoffeehouse.com/_nuxt/img/Login.70dc3d8.png'
    }
  },

  mounted() {
    this.setupEventListeners()
  },

  methods: {
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

    handleClickInfo(route) {
      // Chuyển hướng đến trang UserInfo với param name
      this.$router.push({
        name: 'UserInfo',
        params: { name: route }
      });
      this.displayClick = false;
    },

    async logout() {
      try {
        await this.authStore.logoutUser()
        this.displayClick = false
        this.notificationStore.success('Đăng xuất thành công', 3000)
        window.location.reload();
      } catch (error) {
        console.error('Logout error:', error)
        this.notificationStore.error('Đăng xuất thất bại', 3000)
      }
    },

    handelClickCart() {
      this.$router.push('/thanh-toan')
    },

    handleAddressChange(newAddress) {
      this.oldAddress = newAddress
    },

    handleLoginSuccess(userData) {
      this.displayClick = false;
    },

    openLoginDialog() {
      // Gọi method openDialog của component LoginPopup
      this.$refs.loginPopup.openDialog();
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
  height: 75px;
  border-bottom: 1px solid var(--v-border-color-base);
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
  color: var(--v-text-primary-base) !important;
  transition: 0.3s ease-in-out;
  height: auto !important;
  display: flex;
  align-items: center;
}

.v-btn:hover {
  opacity: 0.8;
}

.v-menu {
  background-color: var(--v-background-base);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.v-badge__badge {
  font-size: 12px;
  padding: 4px;
}

.v-avatar,
.v-icon {
  margin: auto 0;
}
</style>
