<template>
    <v-dialog v-model="dialog" max-width="500px" @click:outside="closeDialog">
        <v-card>
            <v-card-title class="text-h5">
                {{ editCategory ? 'Sửa danh mục' : 'Thêm danh mục mới' }}
            </v-card-title>

            <v-card-text class="pt-4">
                <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
                    <v-text-field v-model="category.name" label="Tên danh mục" :rules="nameRules" required
                        variant="outlined" density="comfortable"></v-text-field>

                    <v-select v-model="category.parent_id" :items="parentCategories" item-title="name" item-value="id"
                        label="Danh mục cha" :rules="parentRules" clearable
                        :hint="!category.parent_id ? 'Không chọn sẽ tạo danh mục gốc' : ''" persistent-hint
                        variant="outlined" density="comfortable">
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

                    <v-text-field class="mt-4" v-model="category.image_url" label="URL hình ảnh" required
                        variant="outlined" density="comfortable"></v-text-field>

                    <!-- Preview hình ảnh -->
                    <v-img v-if="category.image_url" :src="category.image_url" height="120" width="120"
                        class="mt-4 rounded-circle mx-auto border-primary"
                        :class="{ 'elevation-2': category.image_url }"
                        style="border: 3px solid rgb(var(--v-theme-primary))">
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
                <v-btn v-if="editCategory" color="error" variant="text" @click="confirmDeleteCategory">
                    Xóa danh mục
                </v-btn>
                <v-btn color="grey-darken-1" variant="text" @click="closeDialog">
                    Hủy
                </v-btn>
                <v-btn color="primary" :disabled="!valid" :loading="loading" @click="handleSubmit">
                    {{ editCategory ? 'Cập nhật' : 'Thêm mới' }}
                </v-btn>
            </v-card-actions>
        </v-card>

        <!-- Dialog xác nhận xóa -->
        <v-dialog v-model="confirmDeleteDialog" max-width="400px">
            <v-card>
                <v-card-title class="text-h5">Xác nhận xóa</v-card-title>
                <v-card-text>
                    Bạn có chắc chắn muốn xóa danh mục "{{ editCategory ? editCategory.name : '' }}" không?
                    <div class="text-subtitle-2 mt-2 text-red">Hành động này không thể hoàn tác.</div>
                    <div class="text-subtitle-2 mt-2 text-red">Tất cả sản phẩm trong danh mục này sẽ bị ảnh hưởng.</div>

                    <v-text-field v-model="deleteConfirmation" label="Nhập DELETE để xác nhận" variant="outlined"
                        class="mt-4" density="comfortable"
                        :rules="[v => v === 'DELETE' || 'Vui lòng nhập DELETE để xác nhận']"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="text" @click="cancelDelete">Hủy</v-btn>
                    <v-btn color="error" @click="handleDelete" :loading="deleting"
                        :disabled="deleteConfirmation !== 'DELETE'">
                        Xóa
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-dialog>
</template>

<script>
import { adminAPI } from '@/api/admin'
import { useCategoryStore } from '@/stores/category'
import { useNotificationStore } from '@/stores/notification'
import { storeToRefs } from 'pinia'

export default {
    name: 'CategoryDialog',

    props: {
        modelValue: {
            type: Boolean,
            required: true
        },
        editCategory: {
            type: Object,
            default: null
        }
    },

    emits: ['update:modelValue', 'refresh', 'update:edit-category'],

    data() {
        return {
            dialog: false,
            valid: false,
            loading: false,
            category: {
                name: '',
                parent_id: null,
                image_url: ''
            },
            parentCategories: [],
            nameRules: [
                v => !!v || 'Tên danh mục là bắt buộc',
                v => v.length >= 2 || 'Tên danh mục phải có ít nhất 2 ký tự'
            ],
            parentRules: [
                v => v !== undefined || 'Vui lòng chọn danh mục cha'
            ],
            confirmDeleteDialog: false,
            deleteConfirmation: '',
            deleting: false
        }
    },

    setup() {
        const categoryStore = useCategoryStore()
        const notificationStore = useNotificationStore()
        const { categories } = storeToRefs(categoryStore)
        return { categories, notificationStore, categoryStore }
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
            this.category = {
                name: '',
                parent_id: null,
                image_url: ''
            }
            if (this.$refs.form) {
                this.$refs.form.reset()
            }
            this.$emit('update:edit-category', null)
        },

        async handleSubmit() {
            if (!this.$refs.form.validate()) return

            this.loading = true
            try {
                if (this.editCategory) {
                    await adminAPI.category.update(this.editCategory.id, this.category)
                    this.notificationStore.success('Cập nhật danh mục thành công', 3000)
                } else {
                    await adminAPI.category.create(this.category)
                    this.notificationStore.success('Thêm danh mục mới thành công', 3000)
                }
                this.closeDialog()
                this.$emit('refresh')
                this.categoryStore.fetchCategories()
                this.categoryStore.buildMenuItems()
            } catch (error) {
                console.error('Error saving category:', error)
                this.notificationStore.error('Không thể lưu danh mục', 3000)
            } finally {
                this.loading = false
            }
        },

        async initializeForm() {
            try {
                const { data } = await adminAPI.category.getAll()
                this.parentCategories = [
                    { id: null, name: 'Không có danh mục cha' },
                    ...data.categories.filter(cat => !cat.parent_id)
                ]
            } catch (error) {
                console.error('Error fetching categories:', error)
                this.notificationStore.error('Không thể tải danh sách danh mục', 3000)
            }
        },

        confirmDeleteCategory() {
            this.confirmDeleteDialog = true;
            this.deleteConfirmation = '';
        },

        cancelDelete() {
            this.confirmDeleteDialog = false;
            this.deleteConfirmation = '';
        },

        async handleDelete() {
            if (!this.editCategory) return;
            if (this.deleteConfirmation !== 'DELETE') return;

            this.deleting = true;
            try {
                await adminAPI.category.delete(this.editCategory.id);
                this.notificationStore.success('Xóa danh mục thành công', 3000);
                this.closeDialog();
                this.$emit('refresh');
                this.categoryStore.fetchCategories();
                this.categoryStore.buildMenuItems();
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Có lỗi xảy ra khi thanh toán';
                this.notificationStore.error(errorMessage, 3000);
            } finally {
                this.deleting = false;
                this.confirmDeleteDialog = false;
                this.deleteConfirmation = '';
            }
        }
    },

    watch: {
        modelValue(val) {
            this.dialog = val
            if (val) {
                this.initializeForm()
            }
        },
        dialog(val) {
            if (!val) {
                this.$emit('update:modelValue', false)
                this.resetForm()
            }
        },
        editCategory: {
            handler(val) {
                if (val) {
                    this.category = { ...val }
                }
            },
            immediate: true
        }
    }
}
</script>

<style scoped>
.v-card-text {
    padding-top: 20px;
}
</style>