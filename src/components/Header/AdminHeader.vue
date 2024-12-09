<template>
    <div>
        <v-app-bar app color="primary" dark>
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

        <v-navigation-drawer :model-value="drawer" app>
            <v-list>
                <v-list-item v-for="item in menuItems" :key="item.title" :to="item.to" link>
                    <template v-slot:prepend>
                        <v-icon>{{ item.icon }}</v-icon>
                    </template>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
            
            <!-- Nút Logout -->
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
export default {
    name: 'AdminHeader',

    data() {
        return {
            drawer: true,
            menuItems: [
                { title: "Profile", icon: "mdi-account-circle", to: "/admin/profile" },
                { title: "Analyze", icon: "mdi mdi-chart-bar", to: "/admin/dashboard" },
                { title: "Products", icon: "mdi-emoticon", to: "/admin/icons" },
                { title: "Payment History", icon: "mdi-table-column-width", to: "/admin/payment-history" },
                { title: "New Orders", icon: "mdi-order-bool-ascending-variant", to: "/admin/new-orders" },
            ],
        }
    },
    methods: {
        toggleDrawer() {
            this.drawer = !this.drawer;
        },
        logout() {
            console.log("User logged out");
        }
    }
}
</script>

<style scoped>
.v-app-bar {
    background-color: #1976D2 !important;
    /* Màu xanh dương */
}

.logout-btn {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    width: 30%;
}
</style>
