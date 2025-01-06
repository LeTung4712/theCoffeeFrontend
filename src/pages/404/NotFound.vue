<template>
  <v-container fluid class="not-found fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" class="text-center">
        <v-card class="pa-6" elevation="0">
          <h1 class="error-text mb-4">
            404
          </h1>

          <h2 class="error-message mb-4">
            Oops! Trang bạn đang tìm kiếm không tồn tại.
          </h2>

          <p class="text-body-1 text-grey-darken-1 mb-6">
            Có vẻ như trang này đã bị xóa hoặc không tồn tại.
          </p>

          <v-btn class="gradient-btn" size="large" to="/">
            Quay về trang chủ
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f5f5f5, #ffffff);
}

.error-text {
  font-size: 120px;
  font-weight: 700;
  background: linear-gradient(to right, rgb(var(--v-theme-primary)) 0%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  line-height: 1;
}

.error-message {
  font-size: 28px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
  line-height: 1.4;
}

@media (max-width: 600px) {
  .error-text {
    font-size: 80px;
  }

  .error-message {
    font-size: 22px;
  }
}

.gradient-btn {
  background: linear-gradient(to right, rgb(var(--v-theme-primary)) 0%, #60a5fa 100%) !important;
  color: white !important;
  transition: all 0.3s ease;
}

.gradient-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>