<template>
  <v-container fluid class="down-top-padding">
    <adminHeader></adminHeader>
    <v-row style="background-color: white">
      <v-col cols="12" lg="4">
        <v-card>
          <v-card-text class="text-center pa-7">
            <img
              :src="require('@/assets/logo.jpg')"
              alt="user"
              width="300px"
              class="img-fluid  shadow-sm"
            />
            <h4 class="mt-2 title black--text text--darken-2 font-weight-regular">The XinhLounge</h4>
            <h6 class="subtitle-2 font-weight-medium">Bách Khoa</h6>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="8" style="margin: 0 -30px 0 30px">

          <v-card-title>
            <h1 class="title black--text text--darken-2 font-weight-medium text-md-h4 store_infor ">Thông tin cửa hàng </h1>
          </v-card-title>

          <v-row   >
            <v-col cols="12" md="8" lg="8" style="margin-left: 16px;">
              <h4 class="black--text text--darken-2 font-weight-medium text-subtitle-1 mb-1" style="margin-bottom: 0.5rem;font-size: 1rem" > Tên cửa hàng </h4>
            <div >
              <v-text-field filled readonly dense  type="text" value="The Coffee Bách Khoa " class="v-text-field" >
                </v-text-field>
            </div>

              <div >
                <h4 class="black--text text--darken-2 font-weight-medium text-subtitle-1 mb-1" style="margin-bottom: 0.5rem"> Số điện thoại  </h4>
                <v-text-field filled readonly dense type="text" value="0828035636" class="v-text-field" style="cursor: pointer" >
                  </v-text-field>

              </div>

              <div >
                <h4 class="black--text text--darken-2 font-weight-medium text-subtitle-1 mb-1" style="margin-bottom: 0.5rem"> Email  </h4>
                <v-text-field filled readonly dense type="text" value="iamrobordiy@gmail.com" class="v-text-field" >
                  </v-text-field>
              </div>

              <div >
                <h4 class="black--text text--darken-2 font-weight-medium text-subtitle-1 mb-1" style="margin-bottom: 0.5rem"> Địa chỉ  </h4>
                <v-text-field filled readonly dense type="text" value="Số 1 Đại Cồ Việt, Bách Khoa, Hai Bà Trưng, Hà Nội " class="v-text-field" >
                  </v-text-field>
              </div>
            </v-col>
          </v-row>

      </v-col>
    </v-row>
    <Footer></Footer>
  </v-container>
</template>

<script>
export default {
  name: "Profile",
  components: {
    adminHeader: () => import('@/layouts/header/adminHeader'),
    Footer: () => import('@/layouts/footer/Footer'),
  },
  created(){
    if(localStorage.getItem("AdminLoggedIn") == "false"){
            this.$router.push("/pages/login")
        }
  }

};
</script>

<style scoped>
.store_infor{
  text-align: left;
  position: relative;
}

.store_infor::before{
  content: "";
  position: absolute;
  width: 60%;
  bottom: -5px;
  left: 0;
  border-bottom: 2px solid #fa8c16;
}

.v-text-field{
   width: 500px;
 }

</style>