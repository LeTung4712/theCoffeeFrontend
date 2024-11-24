<template>
    <div>
        <v-row justify="center">
            <v-dialog v-model="dialog" open-on-click width="400px" height="100px">
                <template v-slot:activator="{ on, attrs }">
                    <div class="tch-order-card__left d-flex">
                        <p class="tch-order-card__text mb-0" style="color: #fa8c16" v-bind="attrs" v-on="on">
                            Khuyến mãi
                        </p>
                    </div>
                </template>
                <v-card>
                    <div style="
                                      display: flex;
                                      padding: 16px;
                                      align-items: center;
                                      justify-content: flex-start;
                                      border-bottom: 1px solid #dee2e6;
                                    ">
                        <div>
                            <v-icon large color=" darken-1" style="
                                          padding: 1px 15px;
                                          line-height: 1.5rem;
                                        " @click="dialog = false">
                                mdi-close
                            </v-icon>
                        </div>
                        <div style="margin: 0 auto">
                            <span style="
                                          font-size: 0.8375rem;
                                          font-weight: 500;
                                          line-height: 24px;
                                          color: #262626;
                                        ">
                                Chọn khuyến mãi</span>
                        </div>
                    </div>
                    <!--              thân của dialog-->
                    <div class="modal_body">
                        <div class="card_product">
                            <!----------------Ghi chú -->
                            <div class="card-product-note-item">
                                <img style="
                                            width: 18px;
                                            height: 20px;
                                            margin: 12px 11px;
                                          "
                                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAxOCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE3IDIwSDFDMC43MzQ3ODQgMjAgMC40ODA0MyAxOS44OTQ2IDAuMjkyODkzIDE5LjcwNzFDMC4xMDUzNTcgMTkuNTE5NiAwIDE5LjI2NTIgMCAxOVYxQzAgMC43MzQ3ODQgMC4xMDUzNTcgMC40ODA0MyAwLjI5Mjg5MyAwLjI5Mjg5M0MwLjQ4MDQzIDAuMTA1MzU3IDAuNzM0Nzg0IDAgMSAwSDE3QzE3LjI2NTIgMCAxNy41MTk2IDAuMTA1MzU3IDE3LjcwNzEgMC4yOTI4OTNDMTcuODk0NiAwLjQ4MDQzIDE4IDAuNzM0Nzg0IDE4IDFWMTlDMTggMTkuMjY1MiAxNy44OTQ2IDE5LjUxOTYgMTcuNzA3MSAxOS43MDcxQzE3LjUxOTYgMTkuODk0NiAxNy4yNjUyIDIwIDE3IDIwWk01IDVWN0gxM1Y1SDVaTTUgOVYxMUgxM1Y5SDVaTTUgMTNWMTVIMTBWMTNINVoiIGZpbGw9IiNFNEU0RTQiLz4KPC9zdmc+Cg=="
                                    alt="" />
                                <input type="text" placeholder="Nhập mã khuyến mãi" class="card-product-text"
                                    v-model="voucher_code" />
                                <v-btn class="btn-add-item" @click="handleChooseVoucherCode">Áp dụng</v-btn>
                            </div>
                            <div>
                                <div class="card-product-option">
                                    <span class="card-product-option-text">SẴN SÀNG SỬ DỤNG</span>
                                </div>
                                <div>
                                    <div v-for="item in voucherList" :key="item.id" class="card_product_infor">
                                        <v-row class="ma-0">
                                            <v-col cols="12" md="5" lg="5" sm="5">
                                                <div style="border-radius: 0.5rem">
                                                    <img style="
                                                      height: 8.75rem;
                                                      width: 8.75rem;
                                                    " :src="item.image_url" alt="" />
                                                </div>
                                            </v-col>

                                            <v-col cols="12" md="7" lg="7" sm="7">
                                                <div style="
                                                    display: flex;
                                                    flex-direction: column;
                                                  ">
                                                    <span class="card-product-name">{{ item.description }}</span>
                                                    <span class="card_product_description" style="color: #fa8c16">hết
                                                        hạn
                                                        {{ item.expire_at }}</span><br />

                                                    <v-btn @click="handleChooseVoucher(item)">SỬ DỤNG NGAY</v-btn>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>

<script>
import { getAllVouchers } from "@/api/voucher";
export default {
    name: "Card_Fix",
    props: {
        total_price: String
    },
    data: () => {
        return {
            dialog: false,
            voucher_code: "",
            voucherList: [],
            voucher_des: "",
            voucher_price: "",
            voucher_discount_percent: "",
            voucher_discount_type: ""
        }
    },
    created() {
        this.getVoucher()
    },
    mounted() {
        window.addEventListener('order-total-changed', (event) => {
            this.total_price = event.detail.total_price
        })
    },
    methods: {
        separator(numb) {
            var str = numb.toString().split(".");
            str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return str.join(".");
        },
        //chọn voucher theo mã code
        handleChooseVoucherCode() {
            //tìm voucher theo mã code
            var voucher = this.voucherList.find(voucher => voucher.code === this.voucher_code)
            if (voucher) {
                this.voucher_des = voucher.description
                this.voucher_price = voucher.max_discount_amount
                this.voucher_discount_percent = voucher.discount_percent
                this.voucher_discount_type = voucher.discount_type
                var entry = {
                    description: this.voucher_des,
                    price: this.voucher_price,
                    discount_percent: this.voucher_discount_percent,
                    discount_type: this.voucher_discount_type
                }
                localStorage.setItem("voucher", JSON.stringify(entry))
                window.dispatchEvent(new CustomEvent("voucher-localstorage-changed", {
                    detail: {
                        storage: localStorage.getItem("voucher")
                    }
                }));
                this.dialog = false
            } else {
                alert("Không tìm thấy mã khuyến mãi")
            }
        },

        //chọn voucher theo danh sách
        handleChooseVoucher(voucherList) {
            //check xem voucher có thỏa mãn total_price >= min_order_amount thì mới sử dụng được và đưa ra thông báo cần mua thêm bao nhiêu $$$ để sử dụng voucher
            if (this.total_price < voucherList.min_order_amount) {
                alert("Mua thêm " + this.separator(voucherList.min_order_amount - this.total_price ) + " đ để sử dụng voucher")
            } else {
                this.voucher_des = voucherList.description
                this.voucher_price = voucherList.max_discount_amount
                this.voucher_discount_percent = voucherList.discount_percent
                this.voucher_discount_type = voucherList.discount_type

                var entry = {
                    description: this.voucher_des,
                    price: this.voucher_price,
                    discount_percent: this.voucher_discount_percent,
                    discount_type: this.voucher_discount_type
                }
                localStorage.setItem("voucher", JSON.stringify(entry))
                window.dispatchEvent(new CustomEvent("voucher-localstorage-changed", {
                    detail: {
                        storage: localStorage.getItem("voucher")
                    }
                }));
                this.dialog = false
            }
        },

        async getVoucher() {
            try {
                const response = await getAllVouchers()
                //chỉ lấy những voucher còn hạn 
                //console.log("total_price: ", this.total_price)
                this.voucherList = response.data.vouchers.filter(voucher => voucher.expire_at > new Date().toISOString())
                //console.log("voucherListprop: ", this.voucherList)
            } catch (error) {
                console.log(error)
            }
        },
    }
}
</script>

<style scoped>
.fix_icon::after {
    background-color: #ededee !important;
}

.tch-order-card__icon {
    font-size: 0.8375rem;
    line-height: 1;
    color: #fa8c16;
}

.card_product_name {
    font-weight: 600;
    font-size: 1.125rem;
    line-height: 1.5rem;
    color: #262626;
}

.card-product-description {
    font-weight: 400;
    font-size: 0.8375rem;
    line-height: 1.375rem;
    color: #666;
}

.card-product-quantity-config {
    display: flex;
    align-items: center;
}

.quantity-product .add-to-cart {
    cursor: pointer;
    background-color: #e4e4e4;
}

.add-to-cart {
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card-product-quantity {
    font-size: 18px;
    margin: auto 18px;
}

.modal_body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

.card-product-text {
    background-color: white;
    flex: 1;
    border: none;
    width: 12.5rem;
    height: 100%;
    font-size: 0.875rem;
    outline: none;
    padding: 0 0.875rem;
}

.card-product-note-item {
    background: #f5f5f5;
    border: 1px solid #ededee;
    border-radius: 0.25rem;
    height: 2.75rem;
    display: flex;
    margin: 20px 12px 0;
}

.card-product-option {
    margin-top: 0.875rem;
    background-color: hsla(0, 0%, 76.9%, 0.3);
    padding: 8px 6px 6px 8px;
}

.card-product-option-text {
    font-weight: 600;
    font-size: 0.75rem;
    line-height: 1.5rem;
    color: #666;
    margin: 6px 0.875rem;
    text-transform: uppercase;
}

.card-product-option-size-item {
    min-height: 3.5rem;
    display: flex;
    flex-wrap: wrap;
}

.card-product-option-item {
    margin: 5px 22px;
    padding: 13px auto;
    display: flex;

}

.custom-control {
    position: relative;
    z-index: 1;
    display: block;
    min-height: 1.5rem;
    padding-left: 1.5rem;
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
    line-height: 1rem;
}

.custom-control-input {
    position: absolute;
    left: -10px;
    width: 1.5rem;
    height: 1.5rem;
    opacity: 1;
    top: 70%;
    transform: translateY(-50%);
}

.card-product-option-label {
    padding-left: 0.75rem;

}

.custom-control-label {
    position: relative;
    margin-bottom: 0;
    vertical-align: top;
}

.card-product-option-value {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/*.custom-control-label:focus{*/
/*  top: 36px;*/
/*  left: -25px;*/
/*  width: 10px;*/
/*  height: 10px;*/
/*  background: 50%/50% 50% no-repeat;*/
/*  position: absolute;*/
/*  -webkit-box-sizing: border-box;*/
/*  box-sizing: border-box;*/
/*  display: block;*/
/*  content: "";*/
/*  background-image: unset;*/
/*  background-color: orange;*/
/*  border-radius: 100%;*/

/*}*/

.card-product-option-size {
    padding-bottom: 8px;
}

.card-product-option-topping {
    justify-content: space-between;
    align-items: center;
    border-bottom: none;
    padding: 0.9375rem 0;
    height: 4.375rem;
    margin: 0 0.9375rem;
    border-top: 1px solid #c4c4c4;
    display: flex;
}

.card-product-option-topping-name {
    font-size: 0.8375rem;
}

.left-col {
    flex-direction: column;
    display: flex;
}

.card-product-option-topping-price {
    font-weight: 600;
    font-size: 0.875rem;
    color: #262626;
}

.card-product-option-topping:first-child {
    border-top: none;
}

.btn-add-item {
    width: 23.5rem;
    height: 3rem;
    background: radial-gradient(75.9% 488.28% at 24.1% 100%, #e87800 0, #fa8c16 100%);
    box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, .12);
    border-radius: 6.25rem;
    font-size: 0.8375rem;
    line-height: 1.25rem;
    margin-left: 0;
    text-align: center;
    outline: none;
    border: none;
    color: white;
    flex: 1;
}

.modal-footer {
    border-top: none;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    padding: .75rem;
    border-top: 1px solid #dee2e6;
    border-bottom-right-radius: calc(.3rem - 1px);
    border-bottom-left-radius: calc(.3rem - 1px);
}
</style>