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
            :rules="rules.last_name"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.first_name"
            label="Tên khách hàng"
            variant="outlined"
            density="comfortable"
            bg-color="grey-lighten-4"
            :rules="rules.first_name"
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
        v-model="form.date_of_birth"
        label="Sinh nhật"
        variant="outlined"
        density="comfortable"
        bg-color="grey-lighten-4"
        type="date"
        :rules="rules.date_of_birth"
      />
      <v-text-field
        v-model="form.email"
        label="Email"
        type="email"
        variant="outlined"
        density="comfortable"
        bg-color="grey-lighten-4"
        :rules="rules.email"
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
      form: { ...this.userInfo },
      rules: {
        email: [
          v => /.+@.+/.test(v) || 'Email không hợp lệ'
        ],
        date_of_birth: [
          v => new Date(v) < new Date() || 'Ngày sinh không hợp lệ'
        ],
        last_name: [
          v => !!v || 'Vui lòng nhập họ',
          v => v.length <= 50 || 'Họ không được vượt quá 50 ký tự'
        ],
        first_name: [
          v => !!v || 'Vui lòng nhập tên',
          v => v.length <= 50 || 'Tên không được vượt quá 50 ký tự'
        ]
      }
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