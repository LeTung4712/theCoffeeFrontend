<template>
    <v-app class="bg-white">
        <admin-header />
        <notification-list class="notification-container" />
        <v-main class="bg-white main-content">
            <router-view />
        </v-main>
        <Footer />
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

}
</script>

<style scoped>
.v-application {
    background-color: white !important;
}

.v-main {
    background-color: white !important;
    padding-top: calc(42px + 80px) !important;
}

/* Thêm padding bottom cho main content trên mobile */
@media (max-width: 599px) {
  .v-main {
    padding-bottom: 56px !important;
  }
}

/* Thêm style mới cho notification-list */
:deep(.notification-list) {
    position: fixed;
    top: calc(42px + 80px); /* 42px từ header-intro + 80px từ user-header */
    right: 20px;
    z-index: 99;
}
</style>