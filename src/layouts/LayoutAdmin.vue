<template>
<v-app id="inspire">
    <v-content>
        <v-container rounded-0 class="fill-height" fluid>
            <router-view />
        </v-container>
    </v-content>
</v-app>
</template>

<script>
import {
    mapState,
    mapMutations
} from "vuex";
export default {
    name: "LayoutAdmin",

    components: {
       
    },

    props: {
        source: String
    },
    data: () => ({
        expandOnHover: false,
        loggin: false,
    }),
    computed: {
        ...mapState(["Customizer_drawer"]),

    },

    mounted() {
        window.addEventListener('admin-logged-in', (event) => {
            console.log("here: ", event.detail.logged_in)
            if (event.detail.logged_in == false) {
                this.loggin = false
            } else {
                this.loggin = true
            }
            // console.log("item count in mounted: ", this.itemCount)
        });

        console.log(localStorage.getItem("AdminLoggedIn"))
        if (localStorage.getItem("AdminLoggedIn") == "true") {
            console.log("Thanh cong")
            this.loggin = true
        } else {
          console.log("That bai")
            this.loggin = false
        }
    },
    created() {
        if (localStorage.getItem("AdminLoggedIn") == true) {
            console.log("Thanh cong")
            this.loggin = true
        } else {
            this.loggin = false
        }
    },

    methods: {
        ...mapMutations({
            setCustomizerDrawer: "SET_CUSTOMIZER_DRAWER"
        })
    }
};
</script>

<style>

.notActiveLogged {
  display: none;
}
.fill-height {
    align-items: start !important;
    margin-top: 42px;
}
</style>
