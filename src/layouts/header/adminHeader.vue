<template>
<div class="fixed_header" style="top: -12px;margin: 12px -12px;display: flex;background-color: white;height: 64px;align-items: center;border-style: ridge;height: 54px">
    <v-spacer></v-spacer>

    <v-alert color="white" dark style=" padding-bottom: 0;display: flex;align-items: center;" height="32" text>
        <span style="color: black;">{{ currentDateTime }} </span>
    </v-alert>
    <v-alert color="white" dark style=" padding-bottom: 0;display: flex;align-items: center" height="32" text>
        <v-icon left color="black">mdi-account</v-icon>
        <span style="color: black;"><strong>Tung</strong>, Welcome </span>
    </v-alert>
    <v-btn height="36" flat color="black">
        <span style="color: white" @click="handleLogout">Log out </span>
        <v-icon right color="white">mdi-exit-to-app</v-icon>
    </v-btn>
</div>
</template>

<script>
export default {
    name: "View_Header",
    data() {
        return {
            currentDateTime: null,
        }
    },
    mounted() {
        setInterval(() => {
            let dt = new Date();
            // ensure date comes as 01, 09 etc
            let DD = ("0" + dt.getDate()).slice(-2);
            // getMonth returns month from 0
            let MM = ("0" + (dt.getMonth() + 1)).slice(-2);
            let YYYY = dt.getFullYear();
            let hh = ("0" + dt.getHours()).slice(-2);
            let mm = ("0" + dt.getMinutes()).slice(-2);
            let ss = ("0" + dt.getSeconds()).slice(-2);
            let date_string = YYYY + "-" + MM + "-" + DD + " " + hh + ":" + mm + ":" + ss;

            this.currentDateTime = date_string;
        }, 1);
    },

    methods: {
        handleLogout() {
            localStorage.setItem("AdminLoggedIn", "false")
            window.dispatchEvent(new CustomEvent('admin-logged-in', {
                detail: {
                    logged_in: false
                }
            }));
            this.$router.push('/pages/login') // đăng xuất xong quay về trang login
        }
    }
}
</script>

<style>
.fixed_header {
    width: calc(100% - 280px);
    position: fixed;
    z-index: 1;
}
</style>
