<template>
    <v-dialog v-model="dialog" max-width="500px" @click:outside="closeDialog">
        <v-card>
            <v-card-title class="text-h5 bg-success py-3 text-white">
                Thêm danh mục mới
            </v-card-title>

            <v-card-text class="pt-4">
                <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
                    <v-text-field
                        v-model="formData.name"
                        label="Tên danh mục"
                        :rules="[v => !!v || 'Vui lòng nhập tên danh mục']"
                        required
                    ></v-text-field>

                    <v-select
                        v-model="formData.parent_id"
                        :items="categoryOptions"
                        item-title="name"
                        item-value="id"
                        label="Danh mục cha"
                        clearable
                        :hint="!formData.parent_id ? 'Không chọn sẽ tạo danh mục gốc' : ''"
                        persistent-hint
                    >
                        <template v-slot:item="{ item, props }">
                            <v-list-item v-bind="props">
                                <template v-slot:prepend>
                                    <v-avatar size="32" class="me-3">
                                        <v-img :src="item.raw.image_url" cover></v-img>
                                    </v-avatar>
                                </template>
                            </v-list-item>
                        </template>
                    </v-select>

                    <v-text-field
                        v-model="formData.image_url"
                        label="URL hình ảnh"
                        required
                    ></v-text-field>

                    <!-- Preview hình ảnh -->
                    <v-img
                        v-if="formData.image_url"
                        :src="formData.image_url"
                        height="120"
                        width="120"
                        class="mt-4 rounded-circle mx-auto border-primary"
                        :class="{'elevation-2': formData.image_url}"
                        style="border: 3px solid rgb(var(--v-theme-primary))"
                    >
                        <template v-slot:placeholder>
                            <v-row class="fill-height ma-0" align="center" justify="center">
                                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                            </v-row>
                        </template>
                    </v-img>
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
                    :disabled="!valid"
                    :loading="loading"
                    @click="handleSubmit"
                >
                    Lưu
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { categoryAPI } from '@/api/category'
import { useCategoryStore } from '@/stores/category'
import { useNotificationStore } from '@/stores/notification'
import { storeToRefs } from 'pinia'

export default {
    name: 'CategoryDialog',
    
    props: {
        modelValue: {
            type: Boolean,
            default: false
        }
    },

    emits: ['update:modelValue', 'refresh'],

    data() {
        return {
            valid: false,
            loading: false,
            formData: {
                name: '',
                parent_id: null,
                image_url: ''
            }
        }
    },

    setup() {
        const categoryStore = useCategoryStore()
        const notificationStore = useNotificationStore()
        const { categories } = storeToRefs(categoryStore)
        return { categories, notificationStore }
    },

    computed: {
        dialog: {
            get() {
                return this.modelValue
            },
            set(value) {
                this.$emit('update:modelValue', value)
            }
        },
        categoryOptions() {
            return this.categories
                .filter(cat => cat.parent_id === null)
                .map(cat => ({
                    id: cat.id,
                    name: cat.name,
                    image_url: cat.image_url
                }))
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
                parent_id: null,
                image_url: ''
            }
            if (this.$refs.form) {
                this.$refs.form.reset()
            }
        },

        async handleSubmit() {
            if (!this.$refs.form.validate()) return

            this.loading = true
            try {
                await categoryAPI.create(this.formData)
                //await this.categoryStore.fetchCategories()
                this.$emit('refresh')
                this.closeDialog()
                this.notificationStore.success('Thêm danh mục thành công!', 3000);
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    this.notificationStore.error('Đã có category này!', 3000);
                } else {
                    console.error('Error creating category:', error)
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