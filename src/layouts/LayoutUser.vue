<template>
    <v-app class="bg-white">
        <div class="headers-wrapper">
            <HeaderIntro class="header-intro" :class="{ 'hide-intro': isScrolled }" />
            <UserHeader class="user-header" :class="{ 'header-scrolled': isScrolled }" />
        </div>

        <v-main class="bg-white main-content">
            <router-view />
        </v-main>
        <Footer class="d-none d-sm-block" />
        <MobileNavBar />
    </v-app>
</template>

<script>
import HeaderIntro from '@/components/Header/HeaderIntro.vue'
import UserHeader from '@/components/Header/UserHeader.vue'
import Footer from '@/components/Footer/Footer.vue'
import MobileNavBar from '@/components/Navigation/MobileNavBar.vue'

export default {
    name: 'LayoutUser',
    components: {
        HeaderIntro,
        UserHeader,
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

.v-main {
    background-color: white !important;
    padding-top: calc(42px + 80px) !important;
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
  .v-main {
    padding-bottom: 56px !important;
  }
}
</style>