<template>
    <div class="tch-box" v-if = "products.length > 0">
      <div class="cover-listing">
        <div class="container">
          <div class="container-lg container-fluid">
            <div style="margin-bottom: 1.875rem">
              <!-- header -->
              <div class="product-listing-title" >
                <div style="display: flex">
                  <!-- icon + text title -->
                  <v-icon style="margin-right: 12px"> mdi-beer-outline </v-icon>
                  <span data-v-5abbf04c="" class="text">Gợi ý hôm nay</span>
                  
                </div>
              </div>
            </div>

            <!-- List of product recommend -->
            <div>
              <!-- table of item -->
              <div class="row">
                <div
                  v-for="product in products"
                  :key="product.product_id"
                  @click="handleProduct(product.id, product.name)"
                  class="product"
                >
                  <div class="productDetail">
                    <!-- image -->
                    <div class="productImage">
                      <img
                        :src="product.image_url"
                        style="width: 155px; height: 155px"
                      />
                    </div>
                    <!-- block price and title -->
                    <div style="padding-top: 0.75rem">
                      <!-- title -->
                      <div class="productTitleBlock">
                        <h4 class="productTitle">{{ product.name }}</h4>
                      </div>
                      <!-- block price and + -->
                      <div class="blockPriceAdd">
                        <!-- price -->
                        <p class="mb-0">
                          <span class="d-block"
                            >{{ separator(product.price) }}đ</span
                          >
                          <!---->
                        </p>
                        <!-- Nut + -->
  
                        <Card_User_Order
                          style="z-index: 998"
                          :currentID="currentID"
                          :dialog="dialog"
                          :id="product.id"
                          :image_url="product.image_url.toString()"
                          :name="product.name.toString()"
                          :description="product.description.toString()"
                          :price="product.price.toString()"
                          :isInProductListing="1"
                        >
                        </Card_User_Order>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
</template>
  

<script>
import { removeVietnameseTones } from "@/utils/format";
import {createRecommend} from "@/api/recommend";

// /* global axios */
export default {
    name: "productListing",
    components: {
        Card_User_Order: () => import("@/components/productComponents/Card_User_Order"),
    },
    props: {
        currentID: String,
        dialog: Boolean,
    },
    data() {
        return {
            dialogSearch: false,
            products: [],
            cartItems: [],
            searchProduct: null,
            product_searchs: [
                {
                    id: 5,
                    image_url: "https://minio.thecoffeehouse.com/image/admin/1672731234_hitea-thom_400x400.jpg",
                    name: "Hi-Tea Thơm",
                    price: "75000",
                },
                {
                    id: 10,
                    image_url: "https://minio.thecoffeehouse.com/image/admin/1672731234_hitea-thom_400x400.jpg",
                    name: "Hi-Tea Đào",
                    price: "72000",
                }
            ]

        };
    },
    created() {
        console.log("Curent id: ", this.currentID)
        this.getCartItems()
        this.getRecommend()
    },
    methods: {
        getCartItems() {
            this.cartItems = JSON.parse(localStorage.getItem('order')) || [];
            //chỉ lấy id các sản phẩm trong giỏ hàng
            this.cartItems = this.cartItems.map(item => {
                return item.id;
            });
            console.log("Cart items: ", this.cartItems)
        },
        // get recommend product ,lấy sản phẩm gợi ý bằng cách gửi thông tin giỏ hàng của user lên server
        async getRecommend() {
            try {
                const response = await createRecommend( 
                    {
                        cartItems: this.cartItems,
                    }
                );
                this.products = response.data.recommend_products;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },


        // khi click vao san pham
        handleProduct(product_id, product_name) {
            this.product_id = product_id;
            this.product_name = product_name;
            //console.log(this.product_name_convert),
            this.$router.push({
                path: `/${this.product_id}`,
                name: "productInfo",
                params: {
                    product_id: `${this.product_id}`,
                    product_name_convert: `${this.product_name_convert_computed}`
                },
            });
        },
        // format number
        separator(numb) {
            var str = numb.toString().split(".");
            str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return str.join(".");
        },


    },

    computed: {
        product_name_convert_computed() {
            return removeVietnameseTones(this.product_name).replaceAll(' ', '-').toLowerCase()
        },
        filteredList() {
            return this.product_searchs.filter(product_search => {
                return product_search.name.match(this.searchProduct)
            })
        },

    },
};
</script>

<style scoped>
.my-custom-dialog {
    margin-top: 110px;
    align-self: flex-start;
}

.modal-header {
    display: flex;
    padding: 16px;
    align-items: center;
}

.modal-body {
    padding: 16px;

}

button.close {
    background-color: transparent;
    border: 0;
}

.card-product-note-item {
    border: 1px solid #ededee;
    border-radius: 4px;
    background-color: #fafafa;
    display: flex;
    margin-top: 20px;
    height: 2.75rem;
}

.card-product-text {
    flex: 1 1 auto;
    padding: 0 14px;
    font-size: 13px;
    font-weight: 300;
}

textarea:focus,
input:focus {
    outline: none;
}

.cover-product {
    padding: 0 10px;
    margin: 0 0 20px 0;
}

.product-search {
    padding: 8px;
    background-color: white;
    display: flex;
}

.product-search-img {
    width: 6.25rem;
    height: 6.25rem;
    position: relative !important;
    flex-shrink: 0;
}

.product-search-img img {
    object-fit: cover;
}

.product-search-right {
    display: flex;
    flex-direction: column;
    padding-left: 14px;
    flex: 1
}

.product-search-name {
    color: #262626;
    font-size: 0.8375rem;
    height: 3rem;
    line-height: 1.5rem;
    font-weight: 600;
    margin-bottom: 8px;
}

.product-search-price {
    font-size: 14px;
}

.tch-box {
    /* padding-top: 3.125rem; */
    padding-bottom: 3.125rem;
}

.cover-listing {
    margin-top: 20px;
}

.container,
.container-fluid,
.container-lg,
.container-md,
.container-sm,
.container-xl {
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
}

.container {
    margin-left: 123px;
    margin-right: 123px;
}

.product-listing-title {
    justify-content: center !important;
    width: 100%;
    display: flex;
}

.text {
    font-size: 1.75rem;
    line-height: 2.25rem;
    font-weight: 600;
    color: black;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif,
        "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

.product-category {
    display: flex;
    overflow-x: auto;
    justify-content: center !important;
    margin-left: -0.5rem;
    list-style: none;
    list-style-position: initial;
    list-style-image: initial;
    list-style-type: none;
    margin-bottom: 1.5rem;
}

.nav-link {
    display: block;
    padding: 0.5rem 1rem;
    padding-top: 0.5rem;
    padding-right: 1rem;
    padding-bottom: 0.5rem;
    padding-left: 1rem;
}

.tch-category-card {
    transition: 0.4s;
    transition-duration: 0.4s;
    transition-timing-function: ease;
    transition-delay: 0s;
    transition-property: all;
    cursor: pointer;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.tch-category-card__image {
    width: 5.375rem;
    height: 5.375rem;
    background-color: #fff7e6;
    background-size: cover;
    flex-shrink: 0;
    overflow: hidden;
    display: flex;
    border-radius: 50%;
}

.align-items-center {
    align-items: center !important;
}

.justify-content-center {
    justify-content: center !important;
}

.tch-category-card__title {
    color: #b2b2b2;
    /*font-weight: 0.75rem;*/
    font-size: 12px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif,
        "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

.text-center {
    text-align: center !important;
}

.row {
    display: flex;
    flex-wrap: wrap;
    margin-right: -15px;
    margin-left: -15px;
}

.product {
    flex: 0 0 16.666667%;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 16.6667%;
    max-width: 16.666667%;
    padding-left: 15px;
    padding-right: 15px;
    margin-top: 16px;
    position: relative;
}

.productDetail {
    padding: 0.625rem;
    background-color: #fff;
    border-radius: 0.5rem;
    cursor: pointer;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
    flex-direction: column !important;
    display: flex;
}

.productImage {
    border-radius: 0.5rem;
    overflow: hidden;
    height: 100%;
    width: 100%;
    object-fit: contain;
    /* -o-object-fit: cover;
  object-fit: cover; */
}

.productTitleBlock {
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0%;
    margin-top: -0.125rem;
    margin-bottom: 1rem !important;
}

.productTitle {
    color: #262626;
    font-size: 0.8375rem;
    height: 3rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-height: 1.5rem;
    overflow: hidden;
    font-weight: 600;
    margin-bottom: 8px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif,
        "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

.grid-container {
    display: grid;
}

.blockPriceAdd {
    align-items: center !important;
    justify-content: space-between !important;
    display: flex !important;
}

.d-block {
    display: block !important;
}

.mb-0,
.my-0 {
    margin-bottom: 0 !important;
}

.btn.btn--orange-1 {
    background: #fa861c;
}

.add-to-cart {
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.p-0 {
    padding: 0 !important;
}

.btn {
    font-weight: 400;
    color: #212529;
    text-align: center;
    vertical-align: middle;
    user-select: none;
    border: 1px solid transparent;
    font-size: 1rem;
    line-height: 1.5;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
        border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
</style>
