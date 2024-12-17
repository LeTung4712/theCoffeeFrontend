<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title>
                        <h2>Quản Lý Voucher</h2>
                        <v-spacer></v-spacer>
                        <v-row justify="space-between" align="center" style="width: 100%;">
                            <v-col cols="3">
                                <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog">Thêm Voucher</v-btn>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Tìm kiếm"
                                    single-line hide-details class="mr-4"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-title>

                    <v-data-table :headers="headers" :items="vouchers" :search="search" class="elevation-1">
                        <template v-slot:item.image_url="{ item }">
                            <v-img :src="item.image_url" height="50" width="50" cover></v-img>
                        </template>
                        <template v-slot:item.active="{ item }">
                            <v-chip :color="item.active ? 'success' : 'error'">
                                {{ item.active ? 'Hoạt động' : 'Không hoạt động' }}
                            </v-chip>
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-icon @click="editVoucher(item)" class="mr-2">mdi-pencil</v-icon>
                            <v-icon @click="openDeleteDialog(item.id)" color="error">mdi-delete</v-icon>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>

        <!-- Dialog thêm/sửa voucher -->
        <v-dialog v-model="dialog" max-width="800px">
            <v-card>
                <v-card-title class="text-h5 bg-primary py-3 text-white">
                    <span class="text-h5">{{ isEdit ? 'Sửa Voucher' : 'Thêm Voucher' }}</span>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="voucherForm.code" label="Mã Voucher" required></v-text-field>

                            <div class="image-upload-container">
                                <v-text-field v-model="voucherForm.image_url" label="URL Hình ảnh"
                                    @input="previewImage"></v-text-field>

                                <div class="preview-container mt-2">
                                    <v-img v-if="imagePreview" :src="imagePreview" width="120" height="120" contain
                                        class="rounded-lg bg-grey-lighten-2">
                                        <template v-slot:placeholder>
                                            <v-row class="fill-height ma-0" align="center" justify="center">
                                                <v-progress-circular indeterminate
                                                    color="primary"></v-progress-circular>
                                            </v-row>
                                        </template>
                                    </v-img>
                                    <v-sheet v-else width="120" height="100"
                                        class="d-flex align-center justify-center rounded-lg bg-grey-lighten-2">
                                        <v-icon size="40" color="grey-darken-2">mdi-image</v-icon>
                                    </v-sheet>
                                </div>
                            </div>

                            <v-textarea v-model="voucherForm.description" label="Mô tả"></v-textarea>
                            <v-select v-model="voucherForm.discount_type" :items="[
                                { text: 'Giảm theo số tiền', value: 'amount' },
                                { text: 'Giảm theo phần trăm', value: 'percent' }
                            ]" item-title="text" item-value="value" label="Loại giảm giá"></v-select>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-if="voucherForm.discount_type === 'percent'"
                                v-model="voucherForm.discount_percent" label="Phần trăm giảm" type="number" min="0"
                                max="100" suffix="%"></v-text-field>
                            <v-text-field v-model="voucherForm.max_discount_amount" label="Số tiền giảm tối đa"
                                type="number" min="0" suffix="đ"></v-text-field>
                            <v-text-field v-model="voucherForm.min_order_amount" label="Đơn hàng tối thiểu"
                                type="number" min="0" suffix="đ"></v-text-field>
                            <v-text-field v-model="voucherForm.total_quantity" label="Tổng số lượng" type="number"
                                min="0"></v-text-field>
                            <v-text-field v-model="voucherForm.limit_per_user" label="Giới hạn mỗi người dùng"
                                type="number" max="10" min="1"></v-text-field>
                            <v-text-field v-model="voucherForm.expire_at" label="Ngày hết hạn"
                                type="date"></v-text-field>
                            <v-switch v-model="voucherForm.active" label="Kích hoạt" color="success"
                                hide-details></v-switch>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" variant="text" @click="closeDialog">Hủy</v-btn>
                    <v-btn color="primary" @click="saveVoucher" :loading="isLoading">
                        {{ isEdit ? 'Cập nhật' : 'Tạo mới' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Dialog xác nhận xóa voucher -->
        <v-dialog v-model="dialogDelete" max-width="400px">
            <v-card>
                <v-card-title class="text-h5">Xác nhận xóa voucher</v-card-title>
                <v-card-text>Bạn có chắc chắn muốn xóa voucher này?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" variant="text" @click="closeDeleteDialog">Hủy</v-btn>
                    <v-btn color="success" @click="deleteVoucherConfirm" :loading="isLoading">Xóa</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { voucherAPI } from "@/api/voucher";
import { useNotificationStore } from "@/stores/notification";

export default {
    name: "ManageVoucherPage",
    data() {
        return {
            search: '',
            dialog: false,
            isEdit: false,
            headers: [
                { title: 'Mã', key: 'code' },
                { title: 'Hình ảnh', key: 'image_url' },
                { title: 'Mô tả', key: 'description' },
                { title: 'Giảm tối đa', key: 'max_discount_amount' },
                { title: 'Đơn hàng tối thiểu', key: 'min_order_amount' },
                { title: 'Tổng số lượng', key: 'total_quantity' },
                { title: 'Giới hạn mỗi người dùng', key: 'limit_per_user' },
                { title: 'Ngày hết hạn', key: 'expire_at' },
                { title: 'Trạng thái', key: 'active' },
                { title: 'Hành động', key: 'actions', sortable: false },
            ],
            voucherForm: {
                code: '',
                image_url: '',
                description: '',
                discount_type: 'amount',
                discount_percent: 0,
                max_discount_amount: 0,
                min_order_amount: 0,
                expire_at: '',
                total_quantity: 0,
                used_quantity: 0,
                active: true,
                limit_per_user: 1
            },
            vouchers: [],
            imagePreview: null,
            isLoading: false,
            dialogDelete: false,
            voucherToDelete: null,
        };
    },

    setup() {
        const notificationStore = useNotificationStore();
        return { notificationStore };
    },

    created() {
        this.fetchVouchers();
    },

    methods: {
        async fetchVouchers() {
            try {
                const { data } = await voucherAPI.getAllVouchers();
                this.vouchers = data.vouchers;
                console.log(this.vouchers);
            } catch (error) {
                console.error('Error fetching vouchers:', error);
            }
        },

        openDialog() {
            this.isEdit = false;
            this.imagePreview = null;
            this.voucherForm = {
                code: '',
                image_url: '',
                description: '',
                discount_type: 'amount',
                discount_percent: 0,
                max_discount_amount: 0,
                min_order_amount: 0,
                expire_at: '',
                total_quantity: 0,
                used_quantity: 0,
                active: true,
                limit_per_user: 1
            };
            this.dialog = true;
        },

        editVoucher(voucher) {
            this.voucherForm = {
                ...voucher,
                active: voucher.active ? true : false
            };
            this.imagePreview = voucher.image_url;
            this.isEdit = true;
            this.dialog = true;
        },

        async saveVoucher() {
            this.isLoading = true;
            try {
                if (this.isEdit) {
                    await voucherAPI.updateVoucher(this.voucherForm);
                } else {
                    await voucherAPI.createVoucher(this.voucherForm);
                }
                this.closeDialog();
                this.fetchVouchers();
                this.notificationStore.success('Voucher đã được lưu', 3000);
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    this.notificationStore.error('Đã có voucher này!', 3000);
                } else {
                    console.error('Error creating voucher:', error)
                }
            } finally {
                this.isLoading = false;
            }
        },

        openDeleteDialog(id) {
            this.voucherToDelete = id;
            this.dialogDelete = true;
        },

        async deleteVoucherConfirm() {
            this.isLoading = true;
            try {
                await voucherAPI.deleteVoucher({ id: this.voucherToDelete });
                this.fetchVouchers();
                this.closeDeleteDialog();
                this.notificationStore.success('Voucher đã được xóa', 3000);
            } catch (error) {
                console.error('Error deleting voucher:', error);
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
            this.imagePreview = this.voucherForm.image_url;
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