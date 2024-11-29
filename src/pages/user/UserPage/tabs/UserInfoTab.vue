<template>
  <div class="user-info-tab">
    <h2 class="text-h5 font-weight-bold mb-6">Thông tin tài khoản</h2>
    <v-form @submit.prevent="handleSubmit">
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.last_name"
            label="Họ"
            variant="outlined"
            density="comfortable"
            bg-color="grey-lighten-4"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.first_name"
            label="Tên khách hàng"
            variant="outlined"
            density="comfortable"
            bg-color="grey-lighten-4"
          />
        </v-col>
      </v-row>
      <v-text-field
        v-model="form.mobile_no"
        label="Số điện thoại"
        variant="outlined"
        density="comfortable"
        bg-color="grey-lighten-4"
        disabled
      />
      <v-text-field
        v-model="form.birth"
        label="Sinh nhật"
        variant="outlined"
        density="comfortable"
        bg-color="grey-lighten-4"
        type="date"
      />
      <v-text-field
        v-model="form.email"
        label="Email"
        type="email"
        variant="outlined"
        density="comfortable"
        bg-color="grey-lighten-4"
      />
      <v-radio-group v-model="form.gender" row class="mt-4">
        <v-radio label="Nam" value="male"></v-radio>
        <v-radio label="Nữ" value="female"></v-radio>
      </v-radio-group>
      <v-btn type="submit" color="primary" class="mt-4" block>Cập nhật</v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
  name: 'UserInfoTab',
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: { ...this.userInfo }
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('update', this.form)
    }
  }
}
</script>

<style scoped>
.user-info-tab {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
</style> 