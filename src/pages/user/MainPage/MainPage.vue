<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col cols="12">
        <v-carousel
          cycle
          hide-delimiter-background
          show-arrows="hover"
          :height="carouselHeight"
          class="carousel-container"
        >
          <v-carousel-item
            v-for="(url_header, i) in urls_header"
            :key="i"
            cover
          >
            <v-img
              :src="url_header"
              :height="carouselHeight"
              class="align-center"
            />
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
    <ProductList />
    <IntroductionSection />
    <IntroductionSection />
  </v-container>
</template>

<script>
import ProductList from './components/ProductList.vue'
import IntroductionSection from './components/IntroductionSection.vue'

export default {
  name: "MainPage",
  components: {
    ProductList,
    IntroductionSection
  },

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

  computed: {
    carouselHeight() {
      switch (this.$vuetify.display.name) {
        case 'xs': return '200'
        case 'sm': return '300'
        case 'md': return '400'
        case 'lg': return '500'
        case 'xl': return '600'
        default: return '400'
      }
    },
  },
};
</script>

<style scoped>
.carousel-container {
  width: 100%;
}

@media (max-width: 600px) {
  .carousel-container {
    margin: 0;
  }
}

@media (min-width: 601px) {
  .carousel-container {
    padding: 0 16px;
  }
}

@media (min-width: 960px) {
  .carousel-container {
    padding: 0 32px;
  }
}
</style>
