<template>
<div>
    <v-row justify="center">
        <v-dialog v-model="dialog" open-on-click width="530px" height="100px">
            <template v-slot:activator="{ on, attrs }">
                <div style="width: 36px;height: 24px">
                    <v-icon color="#d9afff" large style="cursor: pointer" title="thêm vào giỏ hàng" class="fix_icon" v-bind="attrs" v-on="on">
                        mdi-plus-circle
                        <v-btn class="card-product-decrease
                             quantity-product add-to-cart ">
                        </v-btn>
                    </v-icon>
                </div>

            </template>
            <v-card>
                <div style="display: flex;padding: 16px;align-items: center;justify-content: flex-start;border-bottom: 1px solid #dee2e6">
                    <div>
                        <v-icon large color=" darken-1" style="padding: 1px 15px; line-height: 1.5rem" @click="dialog = false">
                            mdi-close
                        </v-icon>
                    </div>
                    <div style="margin: 0 auto">
                        <span style="font-size: 0.8375rem;font-weight: 500 ;line-height: 24px;color: #262626;">Thêm món mới</span>
                    </div>
                </div>
                <!--              thân của dialog-->
                <div class="modal_body">
                    <div class="card_product">
                        <div class="card_product_infor">
                            <v-row class="ma-0">
                                <v-col cols="12" md="5" lg="5" sm="5">
                                    <div style="border-radius: 0.5rem">
                                        <img style="height: 12.75rem;width: 12.75rem;" :src="image_url" alt="">
                                    </div>
                                </v-col>

                                <v-col cols="12" md="7" lg="7" sm="7">
                                    <div style="display: flex; flex-direction: column">
                                        <span class="card_product_name">{{ name}}</span>
                                        <span class="card-product-description">{{description }}
                                        </span>
                                        <div class="card-product-footer" style="display: flex;justify-content: space-between;align-items: center;margin-top: 1.25rem">
                                            <span class="card-product-price">{{ separator(price) }}đ</span>
                                            <div class="card-product-quantity-config " style="display: flex">
                                                <v-icon color="#fa8c16" large style="cursor: pointer" @click="countProductsDecrea">
                                                    mdi-minus-circle
                                                    <v-btn class="card-product-decrease
                             quantity-product add-to-cart  ">
                                                    </v-btn>
                                                </v-icon>
                                                <span class="card-product-quantity">{{ count }}</span>
                                                <v-icon color="#fa8c16" large style="cursor: pointer" @click="countProductsIncrea">
                                                    mdi-plus-circle
                                                    <v-btn class="card-product-decrease
                             quantity-product add-to-cart ">
                                                    </v-btn>
                                                </v-icon>
                                            </div>
                                        </div>
                                    </div>
                                </v-col>
                            </v-row>
                        </div>
                        <!----------------Ghi chú -->
                        <div class="card-product-note-item">
                            <img style="    width: 18px;height: 20px;margin: 12px 11px;" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAxOCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE3IDIwSDFDMC43MzQ3ODQgMjAgMC40ODA0MyAxOS44OTQ2IDAuMjkyODkzIDE5LjcwNzFDMC4xMDUzNTcgMTkuNTE5NiAwIDE5LjI2NTIgMCAxOVYxQzAgMC43MzQ3ODQgMC4xMDUzNTcgMC40ODA0MyAwLjI5Mjg5MyAwLjI5Mjg5M0MwLjQ4MDQzIDAuMTA1MzU3IDAuNzM0Nzg0IDAgMSAwSDE3QzE3LjI2NTIgMCAxNy41MTk2IDAuMTA1MzU3IDE3LjcwNzEgMC4yOTI4OTNDMTcuODk0NiAwLjQ4MDQzIDE4IDAuNzM0Nzg0IDE4IDFWMTlDMTggMTkuMjY1MiAxNy44OTQ2IDE5LjUxOTYgMTcuNzA3MSAxOS43MDcxQzE3LjUxOTYgMTkuODk0NiAxNy4yNjUyIDIwIDE3IDIwWk01IDVWN0gxM1Y1SDVaTTUgOVYxMUgxM1Y5SDVaTTUgMTNWMTVIMTBWMTNINVoiIGZpbGw9IiNFNEU0RTQiLz4KPC9zdmc+Cg==" alt="">
                            <input type="text" placeholder="Ghi chú thêm cho món này" class="card-product-text" v-model="note">  
                        </div>
                        <!--              chọn size -->
                        <div v-if="topping_items.length > 1">
                            <div class="card-product-option" >
                                <span class="card-product-option-text">CHỌN SIZE (BẮT BUỘC)</span>
                            </div>
                            <div class="card-product-option-size-item" style="display: flex;justify-content: space-between;align-items: center">
                                <div class="custom-control card-product-option-item mb-0">
                                    <input type="radio" name="size-product" id="L" class="custom-control-input" value="L" v-model="size">
                                    <label for="L" class="custom-control-label card-product-option-label  tch-custom-radio">
                                        <div class="card-product-option-value">
                                            <span class="text card-product-option-size">Lớn</span>
                                            <span>+ 10.000đ</span>
                                        </div>
                                    </label>
                                </div>

                                <div class="custom-control card-product-option-item mb-0">
                                    <input type="radio" name="size-product" id="M" class="custom-control-input" value="M" v-model="size">
                                    <label for="M" class="custom-control-label card-product-option-label  tch-custom-radio">
                                        <div class="card-product-option-value">
                                            <span class="text card-product-option-size">Vừa</span>
                                            <span>+ 6.000đ</span>
                                        </div>
                                    </label>
                                </div>

                                <div class=" custom-control card-product-option-item mb-0">
                                    <input type="radio" name="size-product" id='S' class="custom-control-input" value='S' v-model="size">
                                    <label for='S' class="custom-control-label card-product-option-label  tch-custom-radio">
                                        <div class="card-product-option-value">
                                            <span class="text card-product-option-size">Nhỏ</span>
                                            <span>+ 0đ</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!--               Chọn topping -->
                        <div class="card-product-topping" v-if="topping_items.length > 1">
                            <div class="card-product-option">
                                <span class="card-product-option-text">CHỌN topping (TÙY CHỌN)</span>
                            </div>

                            <div class="card-product-option-topping-item" style="margin: 0 16px;" v-for="(topping_item) in topping_items" :key=topping_item.id>
                                <div class="card-product-option-topping" style="display: flex">
                                    <div class="left-col">
                                        <span class="card-product-option-topping-name">{{topping_item.name}}</span>
                                        <span class="card-product-option-topping-price">+ {{ separator(topping_item.price)}}đ</span>
                                    </div>
                                    <v-checkbox v-model="checked_topping" 
                                        :value="topping_item"
                                    ></v-checkbox>
                                    
                                </div>

                            </div>
                        </div>

                    </div>

                    <div class="modal-footer">
                        <button class="btn-add-item" @click="handleChoseItem">{{ check_price() }}đ - Thêm vào giỏ hàng</button>
                    </div>

                </div>

            </v-card>
        </v-dialog>
    </v-row>
</div>
</template>

<script>
import {getProductInfo} from "@/api/product";
export default {
    name: "Card_User_Order",
    props: {
        currentID: String,
        id: Number,
        image_url: String,
        name: String,
        description: String,
        price: String,
        dialog: Boolean,
        isInProductListing: Number
    },
    data: () => {
        return {
            dialog: false,
            count: 1,
            note: "",
            product: {
                id: 0,
                name: "",
                description: "",
                price: 0,
                image_url: "",
            },
            count_topping: Array(8).fill(0),
            size: 'S',
            checked_topping: [],
            topping_counts: [],
            product_items: [{
                    id: "",
                    image_url: "https://minio.thecoffeehouse.com/image/admin/1670897221_a_400x400.png",
                    name: "CloudTea Very Berry Mochi",
                    description: "CloudTea Very Berry Mochi với với mochi Phúc Bồn Tử cùng lớp foam cheese beo béo, vụn bánh quy phô mai giòn tan. Đặc biệt, trà sữa Lài thơm ngát hoà quyện cùng dâu tây ngọt ngào *Lưu ý: - Mochi có thể bị chìm do ảnh hưởng trong quá trình vận chuyển. - SẢN PHẨM KHÔNG ÁP DỤNG ĐỂ ĐÁ RIÊNG HOẶC KHÔNG ĐÁ",
                    price: "69000",
                },

            ],
            topping_items: [
                {
                    id: "1",
                    name: "Kem Phô Mai Macchiato",
                    price: "10000",
                    count: 0,
                },
            ],
        }
    },

    created() {
        if (this.isInProductListing == 0) {
            console.log("local: ", localStorage)
            // localStorage.removeItem("order")
            if (localStorage['info_size']) { 
                this.size = localStorage.getItem('info_size')
                console.log("size: ", localStorage.getItem('info_size'))
            }
            if (localStorage['topping_counts']) {
                // console.log("topping_counts: ",localStorage.getItem('topping_counts'))
                this.topping_counts = JSON.parse(localStorage.getItem('topping_counts'))
            }

            for (let i in this.topping_items) {
                this.topping_items[i].count = this.topping_counts[i]
            }
            console.log("size_code: ", this.size)
            console.log("topping_counts: ", this.topping_counts)
        }
        
        this.product_items[0].id = this.id
        this.product_items[0].image_url = this.image_url
        this.product_items[0].name = this.name
        this.product_items[0].description = this.description
        this.product_items[0].price = this.price

        if (this.id == this.currentID) { //nếu id hiện tại bằng id được click thì mở dialog
            console.log("This current id: ", this.currentID)
            // this.dialog = !this.dialog
        } else {
            //console.log("Not this id: ", this.id)
            this.dialog = false
        }
    },
    //theo dõi sự thay đổi của dialog nếu open thì gọi hàm lấy topping
    watch: {
        dialog (val) {
            if (val) {
                this.getProductInfo()
            }
        }
    },
    methods: {
        async getProductInfo() {
            try {
                const response = await getProductInfo(
                    {
                        params: {
                            product_id: this.id
                        }
                    }
                );
                this.product = response.data.product;
                this.topping_items = response.data.toppings;
                
                console.log("topping: ", this.topping_items)
                for (let index in this.topping_items) {
                    let topping_item = this.topping_items[index];
                    topping_item.count = 0;
                }
            } catch (error) {
                console.log("CAN NOT");
                console.log(error.response);
            }
        },
        handleChoseItem() {
            for (let i in this.topping_items) {
                let topping_item = this.topping_items[i]
                //check trong mảng checked_topping có phần tử nào trùng với topping_item không
                for (let j in this.checked_topping) {
                    if (topping_item.id == this.checked_topping[j].id) {
                        topping_item.count = 1
                    }
                }
                if (topping_item.count == true) {
                    this.topping_counts.push(1)
                } else {
                    this.topping_counts.push(0)
                }
            }
            console.log("topping_counts: ", this.topping_counts)
            this.product_items[0].id = this.id
            this.product_items[0].image_url = this.image_url
            this.product_items[0].name = this.name
            this.product_items[0].description = this.description
            this.product_items[0].price = this.price
            // console.log("name: ", this.product_items.name)
            // Parse any JSON previously stored in allEntries
            var order = JSON.parse(localStorage.getItem("order")); 
            if (order == null) order = []; 
            var entry = { 
                id: this.id,
                product_item: this.product_items,
                size: this.size,
                count: this.count,
                topping_items: this.topping_items,
                note: this.note // lấy từ input
            };
            // console.log("entry: ", entry)
            localStorage.setItem("entry", JSON.stringify(entry));
            // Save allEntries back to local storage
            order.push(entry); //t
            // console.log("order: ", order)
            localStorage.setItem("order", JSON.stringify(order));
            window.dispatchEvent(new CustomEvent('order-localstorage-changed', {
                detail: {
                    storage: localStorage.getItem('order')
                }
            }));
            this.dialog = false
            this.reset()
        },
        reset() {
            this.size = 'S';
            this.count = 1;
            for (let index in this.topping_items) {
                this.topping_items[index].count = 0
            }
            this.topping_counts = []
            localStorage.setItem('info_size', 'S')
            localStorage.setItem('topping_counts', JSON.stringify([0, 0, 0, 0, 0]))
            console.log("NEW localStorage: ", localStorage)
        },
        //tăng giảm số lượng sản phẩm
        countProductsIncrea() {
            this.count += 1;
        },
        countProductsDecrea() {
            if (this.count > 1) {
                this.count -= 1;
            } else if (this.count <= 1) {
                this.count = 1;
            }
        },

        check_price() {

            let topping_price = 0;
            for (let i in this.checked_topping) {
                topping_price += parseInt(this.checked_topping[i].price);
            }
            let price = (parseInt(this.product.price)+ topping_price) * this.count;

            if (this.size === 'L') {
                price += 10000 * this.count;
            } else if (this.size === 'M') {
                price += 6000 * this.count;
            }
            return this.separator(price);
        },
        separator(numb) {
            var str = numb.toString().split(".");
            str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return str.join(".");
        },

    },
}
</script>

<style scoped>
.fix_icon::after {
    background-color: #ededee !important;
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
