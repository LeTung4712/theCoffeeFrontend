<template>
  <v-container class="pa-0" fluid>
    <v-row class="ma-0">
      <v-col cols="12" class="px-4 px-md-10">
        <v-sheet
          class="intro-section"
          rounded="lg"
        >
          <v-container class="h-100">
            <v-row
              class="h-100"
              align="center"
              justify="end"
            >
              <v-col 
                cols="12"
                sm="6"
                md="6"
                lg="6"
                class="text-start pe-md-16"
                offset-sm="6"
                offset-md="6"
                offset-lg="6"
              >
                <v-img
                  :src="desImage"
                  max-width="300"
                  class="mb-8"
                  alt="Tagline"
                />
                
                <h2 class="text-h3 font-weight-bold text-grey-darken-4 mb-6">
                  Khám Phá Hương Vị Cà Phê Đích Thực
                </h2>
                <p class="text-body-1 text-grey-darken-2 mb-8">
                  Từ những hạt cà phê được chọn lọc kỹ lưỡng và rang xay theo công thức độc quyền, 
                  chúng tôi tự hào mang đến cho bạn những tách cà phê thơm ngon đậm vị
                </p>
                <v-btn
                  color="primary"
                  size="large"
                  rounded="pill"
                  class="px-8 text-none"
                >
                  Khám phá ngay
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import desImage from '@/assets/introdutionSection/introdutiondes.png'
export default {
  name: 'IntroductionSection',
  data() {
    return {
      desImage
    }
  }
}
</script>

<style scoped>
.intro-section {
  background-image: url('@/assets/introdutionSection/introdutionSectionBg.png');
  background-size: 100% auto;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 600px;
  overflow: hidden;
  position: relative;
}

.intro-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 100%);
  display: none;
}

@media (max-width: 600px) {
  .intro-section {
    background-size: cover;
    min-height: 400px;
  }
  
  .intro-section::before {
    display: block;
    background: rgba(0,0,0,0.4);
  }
  
  :deep(.text-h3) {
    font-size: 1.8rem !important;
    line-height: 2.2rem;
  }
  
  :deep(.text-body-1) {
    font-size: 1rem !important;
  }
  
  :deep(.v-img) {
    max-width: 200px !important;
  }
}
</style> 