<template>
  <v-navigation-drawer
    v-model="Sidebar_drawer"
    :dark="SidebarColor !== 'white'"
    :color="SidebarColor"
    mobile-break-point="960"
    clipped
    :right="$vuetify.rtl"
    mini-variant-width="70"
    :expand-on-hover="expandOnHover"
    app
    id="main-sidebar"
  >
    <v-list dense nav>
      <!---USer Area -->
      <v-list-item two-line class="px-0">
        <v-list-item-avatar>
          <img 
            :src = "require('@/assets/logo.jpg')" 
          />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>The Xinhlounge</v-list-item-title>
          <v-list-item-subtitle class="caption">Admin</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <!---USer Area -->
      <!---Sidebar Items -->
      <v-list-item
        v-for="item in items"
        :key="item.title"
        :to="item.to"
        :active-class="`success white--text`"
        link
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!---Sidebar Items -->
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";

export default { 
  name: "Sidebar",
  props: {
    expandOnHover: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    items: [

      {
        title: "Profile",
        icon: "mdi-account-circle",
        to: "/admin/pages/profile"
      },

      {
        title: "Analyze",
        icon: "mdi mdi-chart-bar",
        to: "/admin/pages/dashboard"
      },

      {
        title: "Products",
        icon: "mdi-emoticon",
        to: "/admin/pages/icons"
      },

      {
        title: "Payment History",
        icon: "mdi-table-column-width",
        to: "/admin/pages/payment-history"
      },

      {
        title: "New Orders",
        icon: "mdi-order-bool-ascending-variant",
        to: "/admin/pages/new-orders"
      },
    ]
  }),
  computed: {
    ...mapState(["SidebarColor", "SidebarBg"]),
    Sidebar_drawer: {
      get() {
        return this.$store.state.Sidebar_drawer;
      },
      set(val) {
        this.$store.commit("SET_SIDEBAR_DRAWER", val);
      }
    }
  },
  watch: {
    "$vuetify.breakpoint.smAndDown"(val) { //tại đây chúng ta sẽ xem xét breakpoint của vuetify
      this.$emit("update:expandOnHover", !val);
    }
  },

  methods: {}
};
</script>

<style lang="scss">
#main-sidebar{
  box-shadow:1px 0 20px rgba(0,0,0,.08);
  -webkit-box-shadow:1px 0 20px rgba(0,0,0,.08);
  .v-navigation-drawer__border{
    display: none;
  }
  .v-list{
    padding: 8px 15px;
  }
  .v-list-item{
      &__icon--text,
      &__icon:first-child{
        justify-content: center;
        text-align: center;
        width: 20px;
        
      }
      
  }
}
</style>