<template>
    <div>
        <v-app-bar 
            app 
            color="primary" 
            dark
            elevation="4"
            class="fixed-header"
        >
            <v-app-bar-nav-icon @click="toggleDrawer" />
            <v-toolbar-title>Admin Dashboard</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
                <v-icon>mdi-bell</v-icon>
            </v-btn>
            <v-btn icon>
                <v-icon>mdi-account-circle</v-icon>
            </v-btn>
        </v-app-bar>

        <v-navigation-drawer 
            :model-value="drawer" 
            app
            class="navigation-drawer"
        >
            <div class="drawer-content">
                <v-list>
                    <v-list-item v-for="item in menuItems" :key="item.title" :to="item.to" link>
                        <template v-slot:prepend>
                            <v-icon>{{ item.icon }}</v-icon>
                        </template>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </div>
            
            <v-btn
                block
                color="error"
                class="logout-btn"
                @click="logout"
                prepend-icon="mdi-logout"
            >
                Logout
            </v-btn>
        </v-navigation-drawer>
    </div>
</template>

<script>
import { adminAPI } from "@/api/admin";
export default {
    name: 'AdminHeader',

    data() {
        return {
            drawer: true,
            menuItems: [
                { title: "Profile", icon: "mdi-account", to: "/admin/pages/profile" },
                { title: "Dashboard", icon: "mdi-view-dashboard", to: "/admin/pages/dashboard" },
                { title: "Analyze", icon: "mdi-chart-bar", to: "/admin/pages/analyze" },
                { title: "Manage Products", icon: "mdi-package-variant", to: "/admin/pages/manage-products" },
                { title: "New Orders", icon: "mdi-cart", to: "/admin/pages/new-orders" },
                { title: "Delivery Orders", icon: "mdi-truck", to: "/admin/pages/delivery" },
                { title: "Payment History", icon: "mdi-history", to: "/admin/pages/payment-history" },
                
            ],
        }
    },
    methods: {
        toggleDrawer() {
            this.drawer = !this.drawer;
        },
        async logout() {
            const response = await adminAPI.logout();
            console.log(response)
        }
    }
}
</script>

<style scoped>
.v-app-bar {
    background-color: #1976D2 !important;
    /* Màu xanh dương */
}

.fixed-header {
    position: fixed !important;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
}

.navigation-drawer {
    height: calc(100vh - 64px) !important;
    margin-top: 14px !important;
    display: flex !important;
    flex-direction: column !important;
    position: fixed !important;
}

.drawer-content {
    flex: 1;
    overflow-y: auto;
}

.logout-btn {
    margin: 16px auto;
    width: 80%;
    max-width: 200px;
}
</style>
