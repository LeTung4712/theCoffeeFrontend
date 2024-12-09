<template>
    <v-app>
        <admin-header />
        <!-- Xóa navigation drawer khỏi đây -->
        <notification-list class="notification-container" />
        <v-main>
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
    padding-left: 256px !important;
    padding-top: calc(42px + 80px) !important;
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
    margin-left: 256px; /* Thêm margin để tránh bị đè bởi drawer */
}
</style>