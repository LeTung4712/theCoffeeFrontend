<template>
    <v-container>
        <user_Header />
        <div class="productStore_Infor">
            <div class="prodcutStore_Wrap" style="margin-top: 3rem;">
                <v-row>
                    <v-col md="12" lg="6" sm="12" class="col-12 ">
                        <div class="product_carousel">
                            <div class="product_image">
                                <img :src=product.image_url alt="">
                            </div>
                            <div class="thumb_carousel">
                                <div class="thumb">
                                    <img :src=product.image_url alt="" style="margin-top: 10px;">
                                </div>
                            </div>
                        </div>
                    </v-col>
                    <v-col md="6" lg="6" sm="12">
                        <div>
                            <div class="inforr_product">
                                <div>
                                    <p class="infor_pro__title">{{ product.name }}</p>
                                </div>
                                <div class="infor_pro_price">
                                    <span class="price">{{ get_total_price() }} đ</span>
                                </div>
                            </div>

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
                            <div class="option_size" v-if="topping_items.length > 1">
                                <p class="option_title">Chọn size (bắt buộc)</p>
                                <div class="product_option">
                                    <div class="opt_size" @click="small = true; medium = false; big = false;"
                                        :class="{ active: small }">
                                        <div class="opt_img">
                                            <img src="" alt="">
                                        </div>
                                        <div class="circle">
                                            Nhỏ + 0 đ
                                        </div>
                                    </div>
                                    <div class="opt_size" @click="small = false; medium = true; big = false"
                                        :class="{ active: medium }">
                                        <div class="opt_img">
                                            <img src="" alt="">
                                        </div>
                                        <div class="circle">
                                            Vừa + 6000 đ
                                        </div>
                                    </div>
                                    <div class="opt_size" @click="small = false; medium = false; big = true"
                                        :class="{ active: big }">
                                        <div class="opt_img">
                                            <img src="" alt="">
                                        </div>
                                        <div class="circle">
                                            Lớn + 10000 đ
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="option_topping" v-if="topping_items.length > 1">
                                <p class="option_title">Topping</p>
                                <div style="display: flex;flex-wrap: wrap">
                                    <div class="product_option"  v-for="topping_item in topping_items" :key=topping_item.id>
                                        
                                        <div class="option_item" type="checkbox">
                                            <input type="checkbox" class="checkbox" name="topping_tch" :id="topping_item.id"
                                                :title=topping_item.name v-model="checked_topping"
                                                :value=topping_item>
                                            <label class="top_detail active_normal"  :for="topping_item.id">
                                                <div class="name">{{ topping_item.name }} + {{ separator(topping_item.price) }} đ</div>
                                
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <v-row>
                                <v-col md="12" lg="6" sm="12">
                                    <div class="product_tocard">
                                        <a @click="handleAddCart()" class="order__btn">
                                            <div class="order__btn1">
                                                <img src="https://file.hstatic.net/1000075078/file/vector_c337310f409d440f890b370ff9cefe44.png"
                                                    alt="" style="">
                                                <span class="order_name">Thêm vào giỏ hàng </span>
                                            </div>
                                        </a>
                                    </div>
                                </v-col>
                                <v-col md="12" lg="6" sm="12">
                                    <div class="product_tocard">
                                        <a @click="handleBuyNow()" class="order__btn">
                                            <div class="order__btn1">
                                                <img src="https://file.hstatic.net/1000075078/file/vector_c337310f409d440f890b370ff9cefe44.png"
                                                    alt="" style="">
                                                    <svg width="21" height="21" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M14 0C14.5523 0 15 0.447715 15 1V1.999L20 2V8L17.98 7.999L20.7467 15.5953C20.9105 16.032 21 16.5051 21 16.999C21 19.2082 19.2091 20.999 17 20.999C15.1368 20.999 13.5711 19.7251 13.1265 18.0008L8.87379 18.0008C8.42948 19.7256 6.86357 21 5 21C3.05513 21 1.43445 19.612 1.07453 17.7725C0.435576 17.439 0 16.7704 0 16V3C0 2.44772 0.447715 2 1 2H8C8.55228 2 9 2.44772 9 3V11C9 11.5128 9.38604 11.9355 9.88338 11.9933L10 12H12C12.5128 12 12.9355 11.614 12.9933 11.1166L13 11V2H10V0H14ZM5 15C3.89543 15 3 15.8954 3 17C3 18.1046 3.89543 19 5 19C6.10457 19 7 18.1046 7 17C7 15.8954 6.10457 15 5 15ZM17 14.999C15.8954 14.999 15 15.8944 15 16.999C15 18.1036 15.8954 18.999 17 18.999C18.1046 18.999 19 18.1036 19 16.999C19 15.8944 18.1046 14.999 17 14.999ZM15.852 7.999H15V11C15 12.6569 13.6569 14 12 14H10C8.69412 14 7.58312 13.1656 7.17102 12.0009L1.99994 12V14.3542C2.73289 13.5238 3.80528 13 5 13C6.86393 13 8.43009 14.2749 8.87405 16.0003H13.1257C13.5693 14.2744 15.1357 12.999 17 12.999C17.2373 12.999 17.4697 13.0197 17.6957 13.0593L15.852 7.999ZM7 7H2V10H7V7ZM18 4H15V6H18V4ZM7 4H2V5H7V4Z" fill="white" fill-opacity="0.6">
                                                        </path>
                                                    </svg>
                                                <span class="order_name">Đặt giao tận nơi </span>
                                            </div>
                                        </a>
                                    </div>
                                </v-col>
                            </v-row>

                        </div>
                    </v-col>
                </v-row>
            </div>
        </div>

        <div class="product_describe">
            <div class="product_des_wrap">
                <v-row>
                    <v-col cols="12" sm="12" lg="12" md="12">
                        <hr>
                        <div>
                            <h4 class="product_des_title">Mô tả sản phẩm</h4>
                            <p class="des_detail"> {{ product.description }}</p>
                        </div>
                        <hr>
                    </v-col>
                </v-row>
                <div id="product_des_title">
                    <h4 class="product_des_title">Sản phẩm liên quan</h4>
                    <v-row>
                        <v-col cols="12" md="2" lg="2" sm="6" class="list_product"
                            v-for="product_relation in product_relations" :key=product_relation.id >
                            <div class="menu__item_related">
                                <div class="menu__item_img">
                                    <a :href="'/products/' + productrelation_name_convert(product_relation.name)">
                                        <img :src=product_relation.image_url alt="">
                                    </a>
                                </div>
                                <div class="menu__item_infor">
                                    <h3>
                                        <a :href="'/products/' + productrelation_name_convert(product_relation.name)">
                                        {{ product_relation.name }}
                                        </a>
                                    </h3>
                                    <div class="item__price">{{ separator(product_relation.price) }} đ</div>
                                </div>
                            </div>
                        </v-col>

                    </v-row>
                </div>

            </div>

        </div>
    </v-container>
</template>

<script>
import { removeVietnameseTones } from "@/utils/format";
import { getProductInfo,getAllProducts } from "@/api/product";
export default {
    name: "productInStore",
    components: {
        user_Header: () => import("@/layouts/header/userHeader"),
    },
    data() {
        return {
            count: 1, // so luong san pham
            product_id: "-1",
            product_name_convert: "",
            checked_topping: [], // topping da chon
            size: 'S',
            small: true,
            medium: false,
            big: false,
            checked_size: 0,
            items: [],
            product: {
                id: 0,
                name: "",
                description: "",
                price: 0,
                image_url: "",
            },
            product_relations: [], // san pham lien quan
            topping_counts: [0, 0, 0, 0, 0],
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
                }
            ],
            
        }
    },
    created() {
        // 
        this.$watch(
            () => this.$route.params,
            (toParams, previousParams) => {
                console.log("before:", toParams);
                console.log("after:", previousParams);
                this.product_name_convert = this.$route.params.product_name_convert;
                // react to route changes...
            }
        ),
        this.product_name_convert = this.$route.params.product_name_convert
        this.getAllProduct()
    },
  
    methods: {
        //
        getIDByPath(path) {
            console.log("input path: ", path)
            for (let index in this.items) {
                const item = this.items[index]
                if (removeVietnameseTones(item.name).replaceAll(' ', '-').toLowerCase() == path) {
                    return item.id
                }
            }
            return 0
        },
        async getAllProduct() {
            try {
                const response = await getAllProducts();
                this.items = response.data.products;
                this.product_id = this.getIDByPath(this.product_name_convert)
                console.log("product_id: ", this.product_id)
                    // call api get product_details
                    // call api get topping_items
                    // call api get product_relations
                this.getProductInfo()
            } catch (error) {
                console.log("CAN NOT");
                console.log(error.response);
            }
        },
        async getProductInfo() {
            try {
                const response = await getProductInfo(
                    {
                        params: {
                            product_id: this.product_id
                        }
                    }
                );
                this.product = response.data.product;
                this.topping_items = response.data.toppings;
                this.product_relations = response.data.same_products;
                for (let index in this.topping_items) {
                    let topping_item = this.topping_items[index];
                    topping_item.count = 0;
                }
            } catch (error) {
                console.log("CAN NOT");
                console.log(error.response);
            }
        },
        
        handleAddCart() {
            if (this.small == true) {
                this.size = 'S'
            } else if (this.medium == true) {
                this.size = 'M'
            } else if (this.big == true) {
                this.size = 'L'
            }
            let topping_counts = []
            //console.log("topping_checked: ", this.checked_topping)
            for (let i in this.topping_items) {
                let topping_item = this.topping_items[i]
                //check trong mảng checked_topping có phần tử nào trùng với topping_item không
                for (let j in this.checked_topping) {
                    if (topping_item.id == this.checked_topping[j].id) {
                        topping_item.count = 1
                    }
                }
                if (topping_item.count == true) {
                    topping_counts.push(1)
                } else {
                    topping_counts.push(0)
                }
            }
            //console.log("topping_counts: ", topping_counts)
            this.product_items[0].id = this.product.id
            this.product_items[0].image_url = this.product.image_url
            this.product_items[0].name = this.product.name
            this.product_items[0].description = this.product.description
            this.product_items[0].price = this.product.price
            
            var order = JSON.parse(localStorage.getItem("order")); 
            //console.log("order: ", order)

            if (order == null) order = [];
            var entry = {
                id: this.product.id,
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
            this.reset()
        },

        reset() {
            this.size = 'S'
            this.small= true
            this.medium= false
            this.big= false
            this.count = 1
            this.checked_topping = []
            for (let index in this.topping_items) {
                this.topping_items[index].count = 0
            }
            this.topping_counts = [0, 0, 0, 0, 0]
            localStorage.setItem('info_size', 'S')
            localStorage.setItem('topping_counts', JSON.stringify([0, 0, 0, 0, 0]))
            //console.log("NEW localStorage: ", localStorage)
        },

        handleBuyNow() {
            this.handleAddCart()
            this.$router.push({
                path: "/thanh-toan",
                name: "ThanhToan",
            });
            
        },

        separator(numb) {
            var str = numb.toString().split(".");
            str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return str.join(".");
        },

        countProductsIncrea() {
            if (this.count < 100){
                this.count += 1;
            }else if (this.count >= 100){
                this.count = 100;
                //thông báo số lượng sản phẩm tối đa 
                alert("Số lượng sản phẩm tối đa là 100")
            }
        },
        countProductsDecrea() {
            if (this.count > 1) {
                this.count -= 1;
            } else if (this.count <= 1) {
                this.count = 1;
            }
        },

        get_total_price() {
            //console.log("checked_topping: ", this.checked_topping)
            let topping_price = 0;
            for (let i in this.checked_topping) {
                topping_price += parseInt(this.checked_topping[i].price);
            }
            let total_price = (parseInt(this.product.price)+ topping_price) * this.count;
            
            if (this.big === true && this.small === false && this.medium === false) {
                total_price += 10000 * this.count;
            } else if (this.big === false && this.small === false && this.medium === true) {
                total_price += 6000 * this.count;
            }
            //console.log("total_price: ", total_price)
            return this.separator(total_price);
        },

        productrelation_name_convert(product_relation) {
            return removeVietnameseTones(product_relation).replaceAll(' ', '-').toLowerCase()
        },
    },
    computed: { 
        product_name_convert_computed() {
            return removeVietnameseTones(this.product_name).replaceAll(' ', '-').toLowerCase()
        },
    },
}
</script>

<style scoped>
/* Mobile  < 740px*/


.option_item .checkbox:checked~.active_normal {
    background: #E57905;
    border-color: #E57905;
    color: #fff;
}

.active {
    background: #E57905;
    border-color: #E57905;
    color: #fff !important;
}

.active_normal {
    background: #fff;
    color: #666666;
    border: 1px solid rgba(0, 0, 0, 0.15);
}

.product_carousel {
    max-width: 650px;
    margin: 0 auto;
    background: #fff;
}

.product_image>img {
    width: 35.625rem;
    height: 35.625rem;
}

.thumb>img {
    height: 75px;
    width: 75px;
    border-radius: 8px;
    border: 1px solid #E57905;
}

.infor_pro__title {
    font-size: 26px;
    font-family: "SF Pro Display", sans-serif;
    margin-bottom: 18px;
    color: #000;
    font-weight: 500;
}

.infor_pro_price {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    line-height: 1;
    margin-top: 16px;
}

.price {
    line-height: 0.75;
    font-family: "SF Pro Display", sans-serif;
    font-size: 26px;
    color: #E57905;
    font-weight: 600;
    margin-right: 37px;
}

.option_title {
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    margin-top: 40px;
    margin-bottom: 15px;
    display: inline-block;
}

.product_option {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

.opt_size {
    transition: all 0.3s;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    padding: 0 20px;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    height: 40px;
    line-height: 1;
    font-weight: 400;
    margin-right: 16px;
    font-size: 14px;
    color: #666666;
}

.option_item {
    display: block;
    position: relative;
    margin: 10px 20px 10px 0;
}

.option_size .product_option .opt_size .active {
    border-color: #E57905;
    background: #E57905;
    color: #fff;

}

.checkbox {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    opacity: 0;
}

.card-product-quantity-config {
    margin-top: 20px;
    display: flex;
    align-items: center;
}

.card-product-quantity {
    font-size: 18px;
    margin: auto 18px;
}
.top_detail {

    border-radius: 5px;
    text-align: center;
    cursor: pointer;

    height: 40px;
    padding: 0 15px;
    display: inline-flex;
    align-items: center;

    position: relative;
}

.name {
    font-weight: 400;
    font-size: 14px;
}

.option_topping .option_title {
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    margin-top: 23px;
    margin-bottom: 0;
}

.order__btn {
    padding: 0;
    list-style: none;
    text-decoration: none;
    transition: all 0.3s;

}

.order__btn1 {
    background: #E57905;
    margin-top: 15px;
    border-radius: 8px;
    padding: 12px 0;
    text-align: center;
}

.order_name {
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    color: #FFFFFF;
    margin-left: 11px;
}

.product_des_wrap {
    width: 1200px;
}

.product_des_title {
    font-size: 18px;
    margin-bottom: 8px;
    font-weight: 600;
    font-family: 'SF Pro Display', sans-serif;
}

hr {
    margin: 32px 0;
    border: 0;
    border-top: 1px solid #d6d4d4;
}

.des_detail {
    margin-bottom: 10px;
    line-height: 24px;
    font-family: 'SF Pro Display', sans-serif;
    font-size: 14px;
}


/*.list_product .menu__item_related > a{*/
/*  border-radius: 10px;*/
/*  overflow: hidden;*/
/*  display: block;*/
/*  width: 100%;*/
/*  padding-top: 100%;*/
/*  margin: 0;*/
/*  position: relative;*/
/*  box-shadow: 0 0 13px 0 #00000040;*/
/*}*/
.menu__item_img>a>img {
    top: 0;
    left: 0;
    /*width: 10.625rem;*/
    width: 100%;
    position: absolute;
}

.menu__item_related .menu__item_img a {
    border-radius: 10px;
    overflow: hidden;
    display: block;
    width: 100%;
    padding-top: 100%;
    position: relative;
    box-shadow: 0 0 13px 0 #00000040;
}

a:hover {
    color: #ea8025 !important;
    text-decoration: none;
}

.menu__item_related .menu__item_infor {
    padding: 12px 0 0;
}

.menu__item_related .menu__item_infor h3 {
    margin-top: 0;
    margin-bottom: 4px;
    font-weight: 600;
    color: #191919;
    font-size: 16px;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
}

.menu__item_related .menu__item_infor h3 a {
    color: #000000;
    text-decoration: none;
    font-family: 'SF Pro Display', sans-serif;

}

.menu__item_related .menu__item_infor .item__price {
    font-size: 14px;
    color: #00000099;
    margin-bottom: 10px;
    font-family: 'SF Pro Display', sans-serif;
}

@media only screen and (max-width: 46.1875em) {

    .opt_size .product__info__item__list__item {
        padding: 0 10px;
        margin-right: 10px;
        margin-bottom: 10px !important;
    }

    .product_image>img {
        height: 360px;
        width: 100%;
    }

    prodcutStore_Wrap {
        margin-top: 10rem;
    }

    .thumb>img {
        display: none;
    }

    hr {
        width: 500px;
    }

    .product_option>.opt_size {
        margin-bottom: 10px;
        margin-right: 10px;
    }

}

@media only screen and (max-width: 599.98px) {
    .v-application .hidden-xs-only {
        display: none !important;
    }
}</style>
