<template>
  <div class="row">
    <div class="col-sm-12 col-md-12 col-lg-12">
      <div class="header_metaintro  ">
        <div class=" ">
          <a href="/" aria-label="Xem thông tin về 154 cửa hàng khắp cả nước" class="d-flex align-center">
            <v-icon size="24" color="primary" style="margin-right: 5px;">mdi-store</v-icon>
            <span class="fix_color">154 Cửa hàng khắp cả nước</span>
          </a>
        </div>

        <div class="distance ">
          <a href="/" aria-label="Đặt hàng qua hotline 1800.6936" class="d-flex align-center">
            <v-icon size="24" color="primary" style="margin-right: 5px;">mdi-phone</v-icon>
            <span class="fix_color">Đặt hàng: 1800.6936</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeaderIntro"
}
</script>

<style scoped>
.header_metaintro {
  display: flex;
  justify-content: center;
  padding: 10px 4.2%;

}

.header_metaintro a {
  text-decoration: none;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.42;
}

.distance {
  padding: 0 4.2%;
}

.fix_color {
  color: #00000099;
  font-size: 12px;
  font-weight: 400;
  font-family: 'SF Pro Text', sans-serif;
  line-height: 1.42;
}
</style>