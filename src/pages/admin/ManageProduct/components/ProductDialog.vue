<template>
    <v-dialog v-model="dialog" max-width="600px">
        <v-card>
            <v-card-title class="text-h5 bg-primary py-3 text-white">
                <span class="text-h5">Thêm Sản Phẩm Mới</span>
            </v-card-title>

            <v-card-text>
                <div class="d-flex justify-center mb-4">
                    <div class="image-preview-container">
                        <v-img
                            v-if="productData.image_url"
                            :src="productData.image_url"
                            :width="200"
                            :height="200"
                            cover
                            class="rounded-lg"
                        >
                            <template v-slot:placeholder>
                                <v-row class="fill-height ma-0" align="center" justify="center">
                                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                                </v-row>
                            </template>
                        </v-img>
                        <v-sheet
                            v-else
                            :width="200"
                            :height="200"
                            class="d-flex align-center justify-center rounded-lg bg-grey-lighten-2"
                        >
                            <v-icon size="80" color="grey-darken-2">mdi-image</v-icon>
                        </v-sheet>
                    </div>
                </div>

                <v-form ref="form" v-model="valid">
                    <v-container>
                        <v-text-field v-model="productData.name" label="Tên sản phẩm" required
                            :rules="[v => !!v || 'Vui lòng nhập tên sản phẩm']"></v-text-field>

                        <v-select v-model="productData.category_id" :items="subCategories" item-title="name"
                            item-value="id" label="Danh mục" required
                            :rules="[v => !!v || 'Vui lòng chọn danh mục']"></v-select>

                        <v-textarea v-model="productData.description" label="Mô tả" rows="3"></v-textarea>

                        <v-text-field v-model="productData.image_url" label="URL hình ảnh" required
                            :rules="[v => !!v || 'Vui lòng nhập URL hình ảnh']"></v-text-field>

                        <v-text-field v-model.number="productData.price" label="Giá" type="number" required
                            :rules="[v => !!v || 'Vui lòng nhập giá']"></v-text-field>

                        <v-text-field v-model.number="productData.price_sale" label="Giá khuyến mãi"
                            type="number"></v-text-field>

                        <v-switch v-model="productData.active" label="Kích hoạt" color="primary" :true-value="1"
                            :false-value="0"></v-switch>

                        <v-select v-model="productData.toppings" :items="toppings" item-title="name" item-value="id"
                            label="Toppings" multiple chips></v-select>
                    </v-container>
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" variant="text" @click="closeDialog">Hủy</v-btn>
                <v-btn color="primary" @click="saveProduct" :loading="loading">
                    Lưu
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { productAPI } from '@/api/product'
import { toppingAPI } from '@/api/topping'
import { useCategoryStore } from '@/stores/category'
import { useNotificationStore } from '@/stores/notification'
import { storeToRefs } from 'pinia'

export default {
    name: 'ProductDialog',

    props: {
        modelValue: Boolean,
    },

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
                price: 0,
                price_sale: 0,
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
        }
    },

    watch: {
        modelValue(val) {
            this.dialog = val
        },
        dialog(val) {
            if (!val) this.$emit('update:modelValue', val)
        }
    },

    created() {
        this.fetchToppings()
    },

    methods: {
        async fetchToppings() {
            try {
                const response = await toppingAPI.getAll()
                this.toppings = response.data.toppings
            } catch (error) {
                console.error('Lỗi khi lấy danh sách topping:', error)
            }
        },

        async saveProduct() {
            if (!this.$refs.form.validate()) return
            this.loading = true
            console.log(this.productData)
            return
            try {
                await productAPI.create(this.productData)
                this.$emit('refresh')
                this.closeDialog()
                this.notificationStore.success('Thêm sản phẩm thành công!', 3000);
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    this.notificationStore.error('Đã có sản phẩm này!', 3000);
                } else {
                    console.error('Error creating product:', error)
                }
            } finally {
                this.loading = false
            }
        },

        closeDialog() {
            this.dialog = false
            this.$emit('update:modelValue', false)
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
