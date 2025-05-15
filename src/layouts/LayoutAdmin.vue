<template>
    <v-app>
        <admin-header @update:drawer="drawerOpen = $event" />
        <notification-list class="notification-container" />
        <v-main :class="{ 'drawer-open': drawerOpen, 'drawer-closed': !drawerOpen }">
            <router-view />
        </v-main>
    </v-app>
</template>

<script>
import AdminHeader from '@/components/Header/AdminHeader.vue'
import NotificationList from '@/components/Notifications/NotificationList.vue'
import Footer from '@/components/Footer/Footer.vue'

export default {
    name: 'LayoutAdmin',
    components: {
        AdminHeader,
        NotificationList,
        Footer,
    },
    data() {
        return {
            drawerOpen: true
        }
    },
}
</script>

<style scoped>
.v-application {
    background-color: white !important;
}

.v-main {
    background-color: white !important;
    transition: padding-left 0.3s ease;
    padding-top: calc(42px + 18px) !important;
}

.drawer-open {
    padding-left: 256px !important;
}

.drawer-closed {
    padding-left: 0 !important;
}

/* Thêm padding bottom cho main content trên mobile */
@media (max-width: 599px) {
    .v-main {
        padding-left: 0 !important;
        padding-bottom: 56px !important;
    }
}

/* Thêm style mới cho notification-list */
:deep(.notification-list) {
    position: fixed;
    top: calc(42px + 80px);
    right: 20px;
    z-index: 99;
    transition: margin-left 0.3s ease;
}

.drawer-open :deep(.notification-list) {
    margin-left: 256px;
    /* Thêm margin để tránh bị đè bởi drawer */
}

.drawer-closed :deep(.notification-list) {
    margin-left: 0;
    /* Không cần margin khi drawer đóng */
}
</style>