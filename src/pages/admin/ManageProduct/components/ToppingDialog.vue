<template>
    <v-dialog v-model="dialog" max-width="500px" @click:outside="closeDialog">
        <v-card>
            <v-card-title class="text-h5 bg-info py-3 text-white">
                Thêm topping mới
            </v-card-title>

            <v-card-text class="pt-4">
                <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
                    <v-text-field
                        v-model="formData.name"
                        label="Tên topping"
                        :rules="[v => !!v || 'Vui lòng nhập tên topping']"
                        required
                    ></v-text-field>

                    <v-text-field
                        v-model="formData.price"
                        label="Giá"
                        :rules="[
                            v => !!v || 'Vui lòng nhập giá',
                            v => v > 0 || 'Giá phải lớn hơn 0'
                        ]"
                        type="number"
                        required
                    ></v-text-field>
                </v-form>
            </v-card-text>

            <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn
                    color="grey-darken-1"
                    variant="text"
                    @click="closeDialog"
                >
                    Hủy
                </v-btn>
                <v-btn
                    color="primary"
                    :loading="loading"
                    :disabled="!valid"
                    @click="handleSubmit"
                >
                    Lưu
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { toppingAPI } from '@/api/topping'
import { useNotificationStore } from '@/stores/notification';
export default {
    name: 'ToppingDialog',
    
    props: {
        modelValue: {
            type: Boolean,
            default: false
        }
    },

    emits: ['update:modelValue', 'refresh'],
    setup() {
        const notificationStore = useNotificationStore();
        return {
            notificationStore
        }
    },

    data() {
        return {
            valid: false,
            loading: false,
            formData: {
                name: '',
                price: 0
            }
        }
    },

    computed: {
        dialog: {
            get() {
                return this.modelValue
            },
            set(value) {
                this.$emit('update:modelValue', value)
            }
        }
    },

    methods: {
        closeDialog() {
            this.dialog = false
            this.resetForm()
        },

        resetForm() {
            this.formData = {
                name: '',
                price: '',
            }
            if (this.$refs.form) {
                this.$refs.form.reset()
            }
        },

        async handleSubmit() {
            if (!this.$refs.form.validate()) return

            this.loading = true
            try {
                await toppingAPI.create(this.formData)
                this.$emit('refresh')
                this.closeDialog()
                this.notificationStore.success('Thêm topping thành công!', 3000);
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    this.notificationStore.error('Đã có topping này!', 3000);
                } else {
                    console.error('Error creating topping:', error)
                }
            } finally {
                this.loading = false
            }
        }
    },

    watch: {
        dialog(val) {
            if (!val) {
                this.resetForm()
            }
        }
    }
}
</script>

<style scoped>
.v-card-text {
    padding-top: 20px;
}
</style> 