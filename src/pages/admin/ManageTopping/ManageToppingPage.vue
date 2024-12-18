<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title>
                        <h2>Quản Lý Topping</h2>
                        <v-spacer></v-spacer>
                        <v-row justify="space-between" align="center" style="width: 100%;">
                            <v-col cols="6">
                                <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog">Thêm Topping</v-btn>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Tìm kiếm"
                                    single-line hide-details variant="outlined" density="comfortable"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-title>

                    <v-data-table :headers="headers" :items="toppings" :search="search" class="elevation-1">
                        <template v-slot:item.index="{ item, index }">
                            {{ index + 1 }}
                        </template>
                        <template v-slot:item.image="{ item }">
                            <v-img :src="item.image" height="50" width="50" cover></v-img>
                        </template>
                        <template v-slot:item.price="{ item }">
                            {{ formattedPrice(item.price) }}
                        </template>
                        <template v-slot:item.active="{ item }">
                            <v-chip :color="item.active ? 'success' : 'error'">
                                {{ item.active ? 'Hoạt động' : 'Không hoạt động' }}
                            </v-chip>
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-icon @click="editTopping(item)" class="mr-2">mdi-pencil</v-icon>
                            <v-icon @click="openDeleteDialog(item.id)" color="error">mdi-delete</v-icon>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>

        <!-- Dialog thêm/sửa topping -->
        <v-dialog v-model="dialog" max-width="600px">
            <v-card>
                <v-card-title class="text-h5 bg-primary py-3 text-white">
                    <span class="text-h5">{{ isEdit ? 'Sửa Topping' : 'Thêm Topping' }}</span>
                </v-card-title>
                <v-card-text>
                    <v-form ref="form" v-model="valid" @submit.prevent="saveTopping">
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="toppingForm.name" label="Tên Topping"
                                    :rules="[v => !!v || 'Vui lòng nhập tên topping']" required variant="outlined"
                                    density="comfortable"></v-text-field>

                                <!-- <div class="image-upload-container">
                                <v-text-field v-model="toppingForm.image" label="URL Hình ảnh"
                                    @input="previewImage"></v-text-field>

                                <div class="preview-container mt-2">
                                    <v-img v-if="imagePreview" :src="imagePreview" width="120" height="120" contain
                                        class="rounded-lg bg-grey-lighten-2">
                                        <template v-slot:placeholder>
                                            <v-row class="fill-height ma-0" align="center" justify="center">
                                                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                                            </v-row>
                                        </template>
                                    </v-img>
                                    <v-sheet v-else width="120" height="100"
                                        class="d-flex align-center justify-center rounded-lg bg-grey-lighten-2">
                                        <v-icon size="40" color="grey-darken-2">mdi-image</v-icon>
                                    </v-sheet>
                                </div>
                            </div> -->

                                <v-text-field class="mt-4" v-model="toppingForm.price" label="Giá" type="number" min="0"
                                    suffix="đ" :rules="[v => !!v || 'Vui lòng nhập giá']" variant="outlined"
                                    density="comfortable"></v-text-field>
                                <v-switch v-model="toppingForm.active" label="Kích hoạt" color="success" hide-details
                                    variant="outlined" density="comfortable"></v-switch>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" variant="text" @click="closeDialog">Hủy</v-btn>
                    <v-btn color="success" @click="saveTopping" :disabled="!valid" :loading="isLoading">
                        {{ isEdit ? 'Cập nhật' : 'Tạo mới' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Dialog xác nhận xóa topping -->
        <v-dialog v-model="dialogDelete" max-width="400px">
            <v-card>
                <v-card-title class="text-h5">Xác nhận xóa topping</v-card-title>
                <v-card-text>Bạn có chắc chắn muốn xóa topping này?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" variant="text" @click="closeDeleteDialog">Hủy</v-btn>
                    <v-btn color="success" @click="deleteToppingConfirm" :loading="isLoading">Xóa</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { toppingAPI } from "@/api/topping";
import { formatPrice } from "@/utils/format";
import { useNotificationStore } from "@/stores/notification";

export default {
    name: "ManageToppingPage",
    data() {
        return {
            search: '',
            valid: false,
            dialog: false,
            isEdit: false,
            headers: [
                { title: 'STT', key: 'index' },
                { title: 'Tên', key: 'name' },
                //{ title: 'Hình ảnh', key: 'image' },
                { title: 'Giá', key: 'price' },
                { title: 'Trạng thái', key: 'active' },
                { title: 'Hành động', key: 'actions', sortable: false },
            ],
            toppingForm: {
                name: '',
                image: '',
                price: 0,
                active: true
            },
            toppings: [],
            imagePreview: null,
            isLoading: false,
            dialogDelete: false,
            toppingToDelete: null,
        };
    },

    setup() {
        const notificationStore = useNotificationStore();
        return { notificationStore };
    },

    created() {
        this.fetchToppings();
    },

    methods: {
        formattedPrice(price) {
            return formatPrice(price);
        },

        async fetchToppings() {
            try {
                const { data } = await toppingAPI.getAllToppings();
                this.toppings = data.toppings;
            } catch (error) {
                console.error('Error fetching toppings:', error);
            }
        },

        openDialog() {
            this.isEdit = false;
            this.imagePreview = null;
            this.toppingForm = {
                name: '',
                image: '',
                price: 0,
                active: true
            };
            this.dialog = true;
        },

        editTopping(topping) {
            this.toppingForm = {
                ...topping,
                active: topping.active ? true : false
            };
            this.imagePreview = topping.image;
            this.isEdit = true;
            this.dialog = true;
        },

        async saveTopping() {
            this.isLoading = true;
            try {
                if (this.isEdit) {
                    await toppingAPI.updateTopping(this.toppingForm);
                } else {
                    await toppingAPI.createTopping(this.toppingForm);
                }
                this.closeDialog();
                this.fetchToppings();
                this.notificationStore.success('Topping đã được lưu', 3000);
            } catch (error) {
                console.error('Error saving topping:', error);
                this.notificationStore.error('Có lỗi xảy ra!', 3000);
            } finally {
                this.isLoading = false;
            }
        },

        openDeleteDialog(id) {
            this.toppingToDelete = id;
            this.dialogDelete = true;
        },

        async deleteToppingConfirm() {
            this.isLoading = true;
            try {
                await toppingAPI.deleteTopping({ id: this.toppingToDelete });
                this.fetchToppings();
                this.closeDeleteDialog();
                this.notificationStore.success('Topping đã được xóa', 3000);
            } catch (error) {
                console.error('Error deleting topping:', error);
            } finally {
                this.isLoading = false;
            }
        },

        closeDialog() {
            this.dialog = false;
        },

        closeDeleteDialog() {
            this.dialogDelete = false;
        },

        previewImage() {
            this.imagePreview = this.toppingForm.image;
        },
    },
};
</script>

<style scoped>
.image-upload-container {
    margin-bottom: 16px;
}

.preview-container {
    width: 120px;
    height: 120px;
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 8px;
    display: flex;
    justify-content: center;
}
</style>