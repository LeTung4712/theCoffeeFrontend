<template>
  <v-container rounded-0 fluid style="margin-top: 42px">
    

    <div>
      <template style="board">
        <v-carousel cycle hide-delimiter-background show-arrows>
          <v-carousel-item v-for="(url_header, i) in urls_header" :key="i">
            <div>
              <a href="#">
                <img class = "banner" :src="url_header" alt="" />
              </a>
            </div>
          </v-carousel-item>
        </v-carousel>
      </template>
    </div>
    
    <div></div>
    <!-- <mainHeader/> -->
  </v-container>
</template>

<script>
export default {
  name: "Mainpage",

  data() {
    return {
      openAddress: false,
      currentID: "0",
      urls_header: [
        "https://file.hstatic.net/1000075078/file/web_moi_-_desktop_ca5e7b4cc0ab4292998610bdab2caab6.jpg",
        "https://file.hstatic.net/1000075078/file/web_moi_-_desktop_7f410066fea94545b59667a4063a1e09.jpg",
        "https://file.hstatic.net/1000075078/file/banner_web_moi_-_desktop_4c05cc897a634650b7dc685dd5e0d7f7.jpg",
        "https://file.hstatic.net/1000075078/file/desktop_b924413014a1448eb0a38024cd8bc270.jpg",
        "https://file.hstatic.net/1000075078/file/web_desktop_aeb6f5acca5d46adad94c262dcd9ac72.jpg",
      ],
    };
  },

  components: {
    //userHeader: () => import("@/layouts/header/userHeader"),
    //productListing: () => import("@/components/userComponents/productListing"),
  },

};
</script>

<style scoped>
.board {
  background-color: orange;
  margin-top: -70px;
  margin-left: -24px;
  margin-right: -24px;
  padding-top: 20px;
  padding-left: 160px;
  padding-bottom: 0px;
  padding-right: 160px;
  margin-bottom: 0px;
}

.banner {
  width: 100%;
}
.fill-height {
  align-items: start !important;
  margin-top: 42px;
}
</style>
