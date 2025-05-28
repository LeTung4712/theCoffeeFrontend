<template>
    <div>
        <v-app-bar app color="primary" dark elevation="4" class="fixed-header">
            <v-app-bar-nav-icon @click="toggleDrawer" />
            <v-toolbar-title>Admin Dashboard</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu v-model="notificationMenu" :close-on-content-click="false" location="bottom end"
                transition="slide-y-transition">
                <template v-slot:activator="{ props }">
                    <v-btn icon v-bind="props" class="notification-btn">
                        <v-badge :content="unreadNotificationsCount" :model-value="unreadNotificationsCount > 0"
                            color="error" location="top end" offset-x="2" offset-y="2" class="notification-badge">
                            <v-icon :color="unreadNotificationsCount > 0 ? 'warning' : ''"
                                :class="{ 'notification-icon-active': unreadNotificationsCount > 0 }">
                                mdi-bell
                            </v-icon>
                        </v-badge>
                    </v-btn>
                </template>

                <v-card min-width="380" max-width="400" class="notification-dropdown">
                    <v-card-title class="notification-header pa-4">
                        <div class="d-flex justify-space-between align-center w-100">
                            <div class="d-flex align-center">
                                <v-icon color="primary" class="mr-2">mdi-bell-outline</v-icon>
                                <span class="text-h6">Thông báo</span>
                                <v-chip v-if="notifications.length > 0" color="primary" size="small" class="ml-2"
                                    variant="outlined">
                                    {{ notifications.length }}
                                </v-chip>
                            </div>
                            <div class="d-flex">
                                <v-btn v-if="notifications.length > 0" variant="text" size="small"
                                    @click="clearNotifications" prepend-icon="mdi-delete-sweep">
                                    Xóa tất cả
                                </v-btn>
                            </div>
                        </div>
                    </v-card-title>

                    <v-divider></v-divider>

                    <v-list class="notification-list pa-0">
                        <template v-if="notifications.length > 0">
                            <v-list-item v-for="notification in notifications" :key="notification.id"
                                :class="{ 'unread': !notification.read }" @click="handleNotificationClick(notification)"
                                class="notification-item" :ripple="true">
                                <template v-slot:prepend>
                                    <div class="notification-icon-wrapper">
                                        <v-icon :color="notification.type === 'success' ? 'success' : 'error'"
                                            :class="{ 'notification-icon': true, 'notification-icon-unread': !notification.read }">
                                            {{ notification.type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'
                                            }}
                                        </v-icon>
                                    </div>
                                </template>

                                <v-list-item-title class="notification-title">
                                    {{ notification.message }}
                                </v-list-item-title>

                                <template v-slot:append>
                                    <div class="d-flex flex-column align-end">
                                        <span class="text-caption text-medium-emphasis notification-time">
                                            {{ formatTime(notification.timestamp) }}
                                        </span>
                                        <v-btn icon="mdi-close" size="x-small" variant="text"
                                            class="notification-close-btn"
                                            @click.stop="removeNotification(notification.id)"></v-btn>
                                    </div>
                                </template>
                            </v-list-item>
                        </template>

                        <v-list-item v-else class="text-center py-8">
                            <div class="d-flex flex-column align-center">
                                <v-icon color="grey-lighten-1" size="large" class="mb-2">
                                    mdi-bell-off-outline
                                </v-icon>
                                <v-list-item-title class="text-medium-emphasis">
                                    Không có thông báo mới
                                </v-list-item-title>
                            </div>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-menu>
            <v-btn icon>
                <v-icon>mdi-account-circle</v-icon>
            </v-btn>
        </v-app-bar>

        <v-navigation-drawer :model-value="drawer" app class="navigation-drawer">
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

            <v-btn block color="error" class="logout-btn" @click="logout" prepend-icon="mdi-logout">
                Logout
            </v-btn>
        </v-navigation-drawer>
    </div>
</template>

<script>
import { useOrderStore } from '@/stores/order';
import { storeToRefs } from 'pinia';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export default {
    name: 'AdminHeader',

    data() {
        return {
            drawer: true,
            menuItems: [
                { title: "Profile", icon: "mdi-account", to: "/admin/pages/profile" },
                { title: "Dashboard", icon: "mdi-view-dashboard", to: "/admin/pages/dashboard" },
                { title: "Analyze", icon: "mdi-chart-bar", to: "/admin/pages/analyze" },
                { title: "Shopping Behavior", icon: "mdi-chart-line", to: "/admin/pages/shopping-behavior" },
                { title: "Manage Products", icon: "mdi-package-variant", to: "/admin/pages/manage-products" },
                { title: "Manage Toppings", icon: "mdi-pizza", to: "/admin/pages/manage-toppings" },
                { title: "Manage Vouchers", icon: "mdi-ticket", to: "/admin/pages/manage-vouchers" },
                { title: "New Orders", icon: "mdi-cart", to: "/admin/pages/new-orders" },
                { title: "Delivery Orders", icon: "mdi-truck", to: "/admin/pages/delivery-orders" },
                { title: "Payment History", icon: "mdi-history", to: "/admin/pages/payment-history" },
                { title: "Settings", icon: "mdi-cog", to: "/admin/pages/settings" },
            ],
            notificationMenu: false,
        }
    },
    mounted() {
        this.orderStore.startListening();
        this.$emit('update:drawer', this.drawer);
    },
    beforeUnmount() {
        this.orderStore.stopListening();
    },
    methods: {
        toggleDrawer() {
            this.drawer = !this.drawer;
            this.$emit('update:drawer', this.drawer);
        },
        async logout() {
            localStorage.removeItem("AdminLoggedIn");
            this.$router.push({ name: 'Login' });
        },
        formatTime(timestamp) {
            return formatDistanceToNow(new Date(timestamp), {
                addSuffix: true,
                locale: vi
            });
        },
        handleNotificationClick(notification) {
            if (!notification.read) {
                this.orderStore.markNotificationAsRead(notification.id);
            }

            if (notification.orderCode) {
                this.$router.push(`/admin/pages/order-detail/${notification.orderCode}`);
            }

            this.notificationMenu = false;
        },
        markAllNotificationsAsRead() {
            this.orderStore.markAllNotificationsAsRead();
        },
        removeNotification(id) {
            this.orderStore.removeNotification(id);
        },
        clearNotifications() {
            this.orderStore.clearNotifications();
        }
    },
    setup() {
        const orderStore = useOrderStore();
        const { notifications, unreadNotifications } = storeToRefs(orderStore);
        return {
            orderStore,
            notifications,
            unreadNotifications
        };
    },
    computed: {
        unreadNotificationsCount() {
            return this.unreadNotifications.length;
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

.notification-btn {
    position: relative;
    transition: transform 0.2s;
}

.notification-btn:hover {
    transform: scale(1.1);
}

.notification-badge {
    z-index: 1;
}

.notification-badge :deep(.v-badge__badge) {
    font-size: 12px !important;
    height: 20px !important;
    min-width: 20px !important;
    padding: 0 6px !important;
}

.notification-icon-active {
    animation: bell-shake 0.5s ease-in-out;
}

.notification-dropdown {
    max-height: 500px;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
}

.notification-header {
    background-color: rgb(var(--v-theme-surface));
    border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
}

.notification-list {
    max-height: 400px;
    overflow-y: auto;
    scrollbar-width: thin;
}

.notification-item {
    border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
    transition: all 0.2s ease;
    cursor: pointer;
    padding: 12px 16px;
}

.notification-item:last-child {
    border-bottom: none;
}

.notification-item.unread {
    background-color: rgba(var(--v-theme-primary), 0.05);
    border-left: 3px solid rgb(var(--v-theme-primary));
}

.notification-item:hover {
    background-color: rgba(var(--v-theme-primary), 0.08);
}

.notification-icon-wrapper {
    position: relative;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: rgba(var(--v-theme-primary), 0.1);
    margin-right: 12px;
}

.notification-icon {
    font-size: 20px;
}

.notification-icon-unread {
    animation: icon-pulse 2s infinite;
}

.notification-title {
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.4;
    margin-bottom: 4px;
}

.notification-time {
    font-size: 0.75rem;
    color: rgba(var(--v-theme-on-surface), 0.6);
}

.notification-close-btn {
    opacity: 0;
    transition: opacity 0.2s;
}

.notification-item:hover .notification-close-btn {
    opacity: 1;
}

@keyframes bell-shake {
    0% {
        transform: rotate(0);
    }

    15% {
        transform: rotate(5deg);
    }

    30% {
        transform: rotate(-5deg);
    }

    45% {
        transform: rotate(4deg);
    }

    60% {
        transform: rotate(-4deg);
    }

    75% {
        transform: rotate(2deg);
    }

    85% {
        transform: rotate(-2deg);
    }

    92% {
        transform: rotate(1deg);
    }

    100% {
        transform: rotate(0);
    }
}

@keyframes icon-pulse {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.1);
    }

    100% {
        transform: scale(1);
    }
}

/* Custom scrollbar */
.notification-list::-webkit-scrollbar {
    width: 6px;
}

.notification-list::-webkit-scrollbar-track {
    background: transparent;
}

.notification-list::-webkit-scrollbar-thumb {
    background-color: rgba(var(--v-theme-on-surface), 0.2);
    border-radius: 3px;
}

.notification-list::-webkit-scrollbar-thumb:hover {
    background-color: rgba(var(--v-theme-on-surface), 0.3);
}
</style>
