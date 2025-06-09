<template>
    <v-dialog v-model="dialog" max-width="600px">
        <v-card>
            <v-card-title class="text-h5 bg-primary py-3 text-white">
                <span class="text-h5">{{ isEditing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới' }}</span>
            </v-card-title>

            <v-card-text>
                <v-form ref="form" v-model="valid">
                    <v-container>
                        <v-row class="mb-4">
                            <v-col cols="7">
                                <v-text-field v-model="productData.image_url" label="URL hình ảnh" required
                                    variant="outlined" density="comfortable"
                                    :rules="[v => !!v || 'Vui lòng nhập URL hình ảnh']"></v-text-field>
                            </v-col>
                            <v-col cols="5" class="d-flex justify-center align-center">
                                <div class="image-preview-container">
                                    <v-img v-if="productData.image_url" :src="productData.image_url" :width="200"
                                        :height="200" cover class="rounded-lg">
                                        <template v-slot:placeholder>
                                            <v-row class="fill-height ma-0" align="center" justify="center">
                                                <v-progress-circular indeterminate
                                                    color="primary"></v-progress-circular>
                                            </v-row>
                                        </template>
                                    </v-img>
                                    <v-sheet v-else :width="200" :height="200"
                                        class="d-flex align-center justify-center rounded-lg bg-grey-lighten-2">
                                        <v-icon size="80" color="grey-darken-2">mdi-image</v-icon>
                                    </v-sheet>
                                </div>
                            </v-col>
                        </v-row>

                        <v-text-field v-model="productData.name" label="Tên sản phẩm" required variant="outlined"
                            density="comfortable" :rules="[v => !!v || 'Vui lòng nhập tên sản phẩm']"></v-text-field>

                        <v-select class="mt-4" v-model="productData.category_id" :items="subCategories"
                            item-title="name" item-value="id" label="Danh mục" required variant="outlined"
                            density="comfortable" :rules="[v => !!v || 'Vui lòng chọn danh mục']"></v-select>

                        <v-textarea class="mt-4" v-model="productData.description" label="Mô tả" rows="3"
                            variant="outlined" density="comfortable"></v-textarea>

                        <v-text-field class="mt-4" v-model.number="productData.price" label="Giá" type="number" required
                            variant="outlined" density="comfortable"
                            :rules="[v => !!v || 'Vui lòng nhập giá']"></v-text-field>

                        <v-text-field class="mt-4" v-model.number="productData.price_sale" label="Giá khuyến mãi"
                            type="number" variant="outlined" density="comfortable"></v-text-field>

                        <v-switch v-model="productData.active" label="Kích hoạt" color="primary" :true-value="1"
                            :false-value="0" variant="outlined" density="comfortable"></v-switch>

                        <v-select v-model="productData.toppings" :items="toppings" item-title="name" item-value="id"
                            label="Toppings" multiple chips variant="outlined" density="comfortable"></v-select>
                    </v-container>
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" variant="text" @click="closeDialog">Hủy</v-btn>
                <v-btn color="primary" @click="saveProduct" :loading="loading">
                    {{ isEditing ? 'Cập nhật' : 'Lưu' }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { adminAPI } from '@/api/admin'
import { useCategoryStore } from '@/stores/category'
import { useNotificationStore } from '@/stores/notification'
import { storeToRefs } from 'pinia'

export default {
    name: 'ProductDialog',

    props: {
        modelValue: Boolean,
        editProduct: {
            type: Object,
            default: null
        }
    },

    emits: ['update:modelValue', 'update:editProduct', 'refresh', 'close'],

    data() {
        return {
            dialog: false,
            valid: false,
            loading: false,
            toppings: [],
            productData: {
                name: '',
                category_id: null,
                description: '',
                image_url: '',
                price: null,
                price_sale: null,
                active: 1,
                toppings: []
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
        subCategories() {
            return this.categories.filter(cat => cat.parent_id !== null)
        },
        isEditing() {
            return !!this.editProduct;
        }
    },

    watch: {
        modelValue: {
            immediate: true,
            handler(val) {
                this.dialog = val;
                if (val) {
                    if (this.editProduct) {
                        this.initEditMode();
                    } else {
                        this.resetForm();
                    }
                }
            }
        },
        dialog(val) {
            if (!val) {
                this.$emit('update:modelValue', false);
                this.$emit('update:editProduct', null);
                this.$emit('close');
                this.resetForm();
            }
        }
    },

    created() {
        this.fetchToppings()
    },

    methods: {
        async fetchToppings() {
            try {
                const response = await adminAPI.topping.getAll()
                this.toppings = response.data.toppings
            } catch (error) {
                console.error('Lỗi khi lấy danh sách topping:', error)
            }
        },

        initEditMode() {
            if (this.editProduct) {
                console.log(this.editProduct)
                this.productData = {
                    id: this.editProduct.id,
                    name: this.editProduct.name,
                    category_id: this.editProduct.category_id,
                    description: this.editProduct.description || '',
                    image_url: this.editProduct.image_url,
                    price: this.editProduct.price,
                    price_sale: this.editProduct.price_sale || 0,
                    active: this.editProduct.active === true ? 1 : 0,
                    toppings: Array.isArray(this.editProduct.toppings)
                        ? this.editProduct.toppings.map(t => typeof t === 'object' ? t.id : t)
                        : []
                }
            }
        },

        resetForm() {
            this.productData = {
                name: '',
                category_id: null,
                description: '',
                image_url: '',
                price: null,
                price_sale: null,
                active: 1,
                toppings: []
            };
            if (this.$refs.form) {
                this.$refs.form.reset();
            }
        },

        closeDialog() {
            this.dialog = false;
            this.$emit('update:modelValue', false);
            this.$emit('update:editProduct', null);
            this.$emit('close');
            this.resetForm();
        },

        async saveProduct() {
            if (!this.$refs.form.validate()) return;
            this.loading = true;

            try {
                if (this.editProduct) {
                    await adminAPI.product.update(this.productData.id, this.productData);
                    this.notificationStore.success('Cập nhật sản phẩm thành công!', 3000);
                } else {
                    await adminAPI.product.create(this.productData);
                    this.notificationStore.success('Thêm sản phẩm thành công!', 3000);
                }
                this.$emit('refresh');
                this.closeDialog();
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    this.notificationStore.error('Đã có sản phẩm này!', 3000);
                } else {
                    console.error('Error creating/updating product:', error);
                    this.notificationStore.error('Có lỗi xảy ra khi lưu sản phẩm', 3000);
                }
            } finally {
                this.loading = false;
            }
        }
    }
}
</script>

<style scoped>
.image-preview-container {
    width: 200px;
    height: 200px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e0e0e0;
}
</style>
