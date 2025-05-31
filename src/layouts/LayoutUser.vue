<template>
    <v-app class="bg-white">
        <div class="headers-wrapper">
            <HeaderIntro class="header-intro" :class="{ 'hide-intro': isScrolled }" />
            <UserHeader class="user-header" :class="{ 'header-scrolled': isScrolled }" />
        </div>

        <notification-list class="notification-container" />

        <div class="content-wrapper">
            <v-main class="bg-white main-content">
                <router-view />
            </v-main>
            <Footer />
        </div>

        <MobileNavBar />
    </v-app>
</template>

<script>
import HeaderIntro from '@/components/Header/HeaderIntro.vue'
import UserHeader from '@/components/Header/UserHeader.vue'
import NotificationList from '@/components/Notifications/NotificationList.vue'
import Footer from '@/components/Footer/Footer.vue'
import MobileNavBar from '@/components/Navigation/MobileNavBar.vue'

export default {
    name: 'LayoutUser',
    components: {
        HeaderIntro,
        UserHeader,
        NotificationList,
        Footer,
        MobileNavBar
    },
    data() {
        return {
            isScrolled: false
        }
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll)
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
        handleScroll() {
            this.isScrolled = window.scrollY > 42
        }
    }
}
</script>

<style scoped>
.v-application {
    background-color: white !important;
}

.content-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.v-main {
    background-color: white !important;
    flex: 1 0 auto;
}

.main-content {
    padding-top: calc(42px + 80px);
    /* Cho desktop */
}

.headers-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background-color: white;
}

.header-intro {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background-color: white;
    transition: all 0.3s ease;
    height: 42px;
}

.user-header {
    margin-top: 42px;
    transition: all 0.3s ease;
}

.hide-intro {
    transform: translateY(-100%);
    opacity: 0;
}

.header-scrolled {
    margin-top: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Thêm padding bottom cho main content trên mobile */
@media (max-width: 599px) {
    .main-content {
        padding-top: 83px;
        /* Chỉ giữ lại chiều cao của user-header trên mobile */
    }
}

/* Thêm style mới cho notification-list */
:deep(.notification-list) {
    position: fixed;
    top: calc(42px + 80px);
    right: 20px;
    z-index: 99;
}
</style>