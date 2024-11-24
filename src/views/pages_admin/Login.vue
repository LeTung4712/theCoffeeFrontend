<template>
    <div id="app" style="max-width: 1000px !important">
        <v-app id="inspire">
            <div class="pa-0" style="max-height: 100vh; overflow: hidden">
                <v-img
                    src="https://file.hstatic.net/1000075078/file/combo89_desktop_fb9f6ae2a13a4068a4a2a84d50f21fe3.jpg"
                    height="200px" width="90vw"></v-img>
                <v-card class="mx-auto elevation-5  pa-5" max-width="350"
                    style="border-radius: 20px; position: relative; top: -50px;align-items: center">
                    <v-card-subtitle class="title black--text pa-1 text-center">
                        Coffee House Bách Khoa
                    </v-card-subtitle>

                    <v-card-subtitle class="pa-1 text-center"> Login for admin </v-card-subtitle>
                    <v-card-subtitle class="pa-1 text-center"> email: admin@gmail.com </v-card-subtitle>
                    <v-card-subtitle class="pa-1 text-center"> pass: 123456 </v-card-subtitle>
                    <div style="left: 0!important;">
                        <h4 class="black--text text--darken-2 font-weight-medium text-subtitle-1 "
                            style="font-size: 1rem;">Email </h4>
                    </div>
                    <v-text-field dense color="red" v-model="admin.email"></v-text-field>
                    <div style="left: 0!important;">
                        <h4 class="black--text text--darken-2 font-weight-medium text-subtitle-1 "
                            style="font-size: 1rem;">Mật khẩu </h4>
                    </div>
                    <v-text-field dense color="red" v-model="admin.password" type="password"></v-text-field>
                    <v-card-actions>
                        <v-btn color="red" dark block rounded @click="handleLogin"> Login </v-btn>
                    </v-card-actions>
                </v-card>
            </div>
        </v-app>
    </div>
</template>

<script>
import { login } from "@/api/admin";
export default {
    name: "Login",
    components: {

    },

    data: () => ({
        show: false,
        admin: {
            email: "",
            password: "",
        }
    }),

    methods: {
        async handleLogin() {
            try {
                const response = await login(
                    {
                        username: this.admin.email,
                        password: this.admin.password
                    }
                )
                if (response.data.error == false) {
                    localStorage.setItem("AdminLoggedIn", "true")
                    this.admin.email = ""
                    this.admin.password = ""
                    window.dispatchEvent(new CustomEvent('admin-logged-in', {
                        detail: {
                            logged_in: true
                        }
                    }));
                    this.$router.push('/admin/pages/profile')
                } else {
                    localStorage.setItem("AdminLoggedIn", "false")
                    this.admin.email = ""
                    this.admin.password = ""
                    alert("Sai email hoặc mật khẩu")
                }
            } catch (error) {
                console.log(error.response);
            }
        }
    },
};
</script>