<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title>
                        <h2>Quản Lý Voucher</h2>
                        <v-spacer></v-spacer>
                        <v-row justify="space-between" align="center" style="width: 100%;">
                            <v-col cols="6">
                                <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog">Thêm Voucher</v-btn>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Tìm kiếm"
                                    single-line hide-details variant="outlined" density="comfortable"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-title>

                    <v-data-table :headers="headers" :items="vouchers" :search="search" class="elevation-1">
                        <template v-slot:item.index="{ item, index }">
                            {{ index + 1 }}
                        </template>
                        <template v-slot:item.image_url="{ item }">
                            <v-img :src="item.image_url" height="50" width="50" cover></v-img>
                        </template>
                        <template v-slot:item.max_discount_amount="{ item }">
                            {{ formattedPrice(item.max_discount_amount) }}
                        </template>
                        <template v-slot:item.min_order_amount="{ item }">
                            {{ formattedPrice(item.min_order_amount) }}
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
                    <v-form ref="form" v-model="valid" @submit.prevent="saveVoucher">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="voucherForm.code" label="Mã Voucher"
                                    :rules="[v => !!v || 'Vui lòng nhập mã voucher']" variant="outlined"
                                    density="comfortable" required></v-text-field>

                                <div class="image-upload-container">
                                    <v-text-field class="mt-4" v-model="voucherForm.image_url" label="URL Hình ảnh"
                                        :rules="[v => !!v || 'Vui lòng nhập URL hình ảnh']" variant="outlined"
                                        density="comfortable" @input="previewImage"></v-text-field>

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

                                <v-textarea v-model="voucherForm.description" label="Mô tả"
                                    :rules="[v => !!v || 'Vui lòng nhập mô tả']" variant="outlined"
                                    density="comfortable">
                                </v-textarea>
                                
                                <v-select class="mt-4" v-model="voucherForm.discount_type" :items="discountTypes"
                                    item-title="title" item-value="value" label="Loại giảm giá" variant="outlined"
                                    density="comfortable">
                                </v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-if="voucherForm.discount_type === 'percent'"
                                    v-model="voucherForm.discount_percent" label="Phần trăm giảm" type="number" min="0"
                                    max="100" suffix="%" :rules="[v => !!v || 'Vui lòng nhập phần trăm giảm']"
                                    variant="outlined" density="comfortable">
                                </v-text-field>

                                <v-text-field v-model="voucherForm.max_discount_amount"
                                    label="Số tiền giảm tối đa" type="number" min="0" suffix="đ"
                                    :rules="[v => !!v || 'Vui lòng nhập số tiền giảm tối đa']" variant="outlined"
                                    density="comfortable">
                                </v-text-field>

                                <v-text-field class="mt-4" v-model="voucherForm.min_order_amount" label="Đơn hàng tối thiểu"
                                    type="number" min="0" suffix="đ"
                                    :rules="[v => !!v || 'Vui lòng nhập đơn hàng tối thiểu']" variant="outlined"
                                    density="comfortable">
                                </v-text-field>

                                <v-text-field class="mt-4" v-model="voucherForm.total_quantity" label="Tổng số lượng"
                                    type="number" min="0" :rules="[v => !!v || 'Vui lòng nhập tổng số lượng']"
                                    variant="outlined" density="comfortable">
                                </v-text-field>

                                <v-text-field class="mt-4" v-model="voucherForm.limit_per_user"
                                    label="Giới hạn mỗi người dùng" type="number" max="10" min="1"
                                    :rules="[v => !!v || 'Vui lòng nhập giới hạn mỗi người dùng']" variant="outlined"
                                    density="comfortable">
                                </v-text-field>

                                <v-text-field class="mt-4" v-model="voucherForm.expire_at" label="Ngày hết hạn" type="date"
                                    :rules="[v => !!v || 'Vui lòng chọn ngày hết hạn']" variant="outlined"
                                    density="comfortable">
                                </v-text-field>

                                <v-switch class="mt-4" v-model="voucherForm.active" label="Kích hoạt" color="success"
                                    hide-details></v-switch>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" variant="text" @click="closeDialog">Hủy</v-btn>
                    <v-btn color="success" @click="saveVoucher" :disabled="!valid" :loading="isLoading">
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
import { adminAPI } from "@/api/admin";
import { useNotificationStore } from "@/stores/notification";
import { formatPrice } from "@/utils/format";

export default {
    name: "ManageVoucherPage",
    data() {
        return {
            search: '',
            valid: false,
            dialog: false,
            isEdit: false,
            discountType: 'amount',
            discountTypes: [
                { title: 'Giảm theo số tiền', value: 'amount' },
                { title: 'Giảm theo phần trăm', value: 'percent' }
            ],
            headers: [
                { title: 'STT', key: 'index' },
                { title: 'Mã', key: 'code' },
                { title: 'Hình ảnh', key: 'image_url' },
                { title: 'Mô tả', key: 'description' },
                { title: 'Giảm tối đa', key: 'max_discount_amount' },
                { title: 'Đơn hàng tối thiểu', key: 'min_order_amount' },
                { title: 'Tổng số lượng', key: 'total_quantity' },
                { title: 'Số lượng đã sử dụng', key: 'used_quantity' },
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
        formattedPrice(price) {
            return formatPrice(price);
        },

        async fetchVouchers() {
            try {
                const { data } = await adminAPI.voucher.getAll();
                this.vouchers = data.vouchers;
                //console.log(this.vouchers);
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Có lỗi xảy ra khi tải danh sách voucher';
                this.notificationStore.error(errorMessage, 3000);
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
                    await adminAPI.voucher.update(this.voucherForm.id, this.voucherForm);
                } else {
                    await adminAPI.voucher.create(this.voucherForm);
                }
                this.closeDialog();
                this.fetchVouchers();
                this.notificationStore.success('Voucher đã được lưu', 3000);
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Có lỗi xảy ra khi lưu voucher';
                this.notificationStore.error(errorMessage, 3000);
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
                await adminAPI.voucher.delete(this.voucherToDelete);
                this.fetchVouchers();
                this.closeDeleteDialog();
                this.notificationStore.success('Voucher đã được xóa', 3000);
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Có lỗi xảy ra khi xóa voucher';
                this.notificationStore.error(errorMessage, 3000);
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