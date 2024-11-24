<template>
  <div style="margin-top: 20px; align-items: center" class="fill-weight">
    <v-container style="margin: 40px auto 0; padding: 0" class="fix_font">
      <v-row style="justify-content: center">
        <v-col cols="12" md="10" lg="10" sm="10">
          <div class="tch_checkout_header" style="text-align: center">
            <h1 class="tch_checkout_header-title">
              <v-icon large color="#fad207">mdi-file</v-icon>
              <span>Xác nhận đơn hàng</span>
            </h1>
          </div>
          <v-row>
            <!-- cột bên traÍ-->
            <v-col cols="12" md="6" lg="6">
              <div style="margin-right: 30px">
                <!--phần bên trái trên-->
                <div style="display: flex; flex-direction: column">
                  <!--             nut chọn địa chỉ-->
                  <div class="tch_checkbox_deli fix_position">
                    <div class="tch_checkout_cus_deli">
                      <h4 class="checkout_delivery_text">Giao hàng</h4>
                      <p class="checkout_delivery_btn">Đổi phương thức</p>
                    </div>
                  </div>
                  <!--            địa chỉ -->
                  <div class="tch_deli_address tch_delivery_card fix_position" style="float: left">
                    <div class="tch_delivery_img">
                      <img style="width: 40px" src="https://minio.thecoffeehouse.com/images/tch-web-order/Delivery2.png"
                        alt="" />
                    </div>
                    <div class="tch_delivery_content" style="flex: 1">
                      <div justify="center" style="padding-left: 12px">
                        <div @click.stop="dialog = true">
                          <h5 class="delivery_address mb-0">
                            {{ oldAddress }}
                          </h5>
                          <p class="delivery_address_description mb-0">
                            {{ myInput }}
                          </p>
                        </div>

                        <v-dialog v-model="dialog" width="376" style="z-index: 999" content-class="my-custom-dialog">
                          <v-card class="fix_font" style="border-radius: 0.5rem">
                            <div class="modal-header">
                              <v-icon @click="dialog = false" small color="#262626">mdi-close-thick</v-icon>
                              <h5 id="abc-title" class="modal-title">
                                Giao hàng
                              </h5>
                            </div>
                            <div class="modal-body">
                              <div class="form-group mb-0">
                                <input type="text" v-model.lazy="myInput" placeholder="Vui lòng nhập địa chỉ"
                                  class="form-control tch-delivery__input" />
                                <!-- <bulma-dropdown :options="options" @select="selected = $event" placeholder="Search"/> -->
                              </div>
                            </div>

                            <v-card-actions>
                              <v-spacer></v-spacer>

                              <v-btn color="green darken-1" text @click="dialog = false">
                                Xác nhận
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </div>

                      <span>
                        <v-icon color="black" right x-large>mdi-chevron-right</v-icon>
                      </span>
                    </div>
                  </div>
                  <!--            thời gian giao hàng -->
                  <div class="time_deli fix_position" style="padding-left: 40px; margin-left: 50px">
                    <div class="tch_delivery_img" style="width: 40px"></div>
                    <div class="tch_delivery_content">
                      <div>
                        <h5 class="delivery_address mb-0">
                          Nhận hàng trong ngày 15-30 phút
                        </h5>
                        <p class="delivery_address_description mb-0">
                          Nhận càng sớm càng tốt
                        </p>
                      </div>
                      <span>
                        <v-icon color="black" right x-large>mdi-chevron-right</v-icon>
                      </span>
                    </div>
                  </div>
                  <!--            thẻ input tên-->
                  <div class="form-group fix_position" style="margin-left: 50px" v-if="logged == 0">
                    <input type="text" id="name" :placeholder="name" class="form-control tch-delivery__input" />
                  </div>
                  <div class="form-group fix_position" style="margin-left: 50px" v-else>
                    <input type="text" id="name" v-model="name" class="form-control tch-delivery__input" />
                  </div>
                  <!--            thẻ sdt -->
                  <div class="form-group fix_position" style="margin-left: 50px" v-if="logged == 0">
                    <input type="text" id="phone_number" :placeholder="phone"
                      class="form-control tch-delivery__input" />
                  </div>
                  <div class="form-group fix_position" style="margin-left: 50px" v-else>
                    <input type="text" id="phone_number" v-model="phone" class="form-control tch-delivery__input" />
                  </div>
                  <!--            hướng daanxc giao hàng-->
                  <div class="form-group fix_position" style="margin-left: 50px">
                    <input type="text" id="delivery_detail" placeholder="Thêm hướng dẫn giao hàng"
                      v-model="noteDelivery" class="form-control tch-delivery__input" />
                  </div>
                </div>
                <!-- bên  trái dưới  = thanh toán method-->
                <div style="display: flex; flex-direction: column">
                  <div class="tch_checkbox_deli fix_position">
                    <div class="tch_checkout_cus_deli">
                      <h4 class="checkout_delivery_text">
                        Phương thức thanh toán
                      </h4>
                    </div>
                  </div>
                  <!--              thanh toans method-->
                  <ul class="tch-list-payment-method mb-0 fix_position">
                    <li class="tch-payment-method-item">
                      <div class="custom-control custom-radio mb-0">
                        <input type="radio" name="payment-method" id="COD" class="custom-control-input" value="cod"
                          v-model="paymentOptions" />
                        <label for="COD" class="custom-control-label tch-custom-radio" style="padding-left: 6px">
                          <span class="icon ml-3 mr-2">
                            <img
                              src="https://minio.thecoffeehouse.com/image/tchmobileapp/1000_photo_2021-04-06_11-17-08.jpg"
                              alt="" />
                          </span>
                          <span class="text">Tiền mặt</span>
                        </label>
                      </div>
                    </li>
                    <li class="tch-payment-method-item">
                      <div class="custom-control custom-radio mb-0">
                        <input type="radio" name="payment-method" id="Momo" class="custom-control-input" value="momo"
                          v-model="paymentOptions" />
                        <label for="Momo" class="custom-control-label tch-custom-radio" style="padding-left: 6px">
                          <span class="icon ml-3 mr-2">
                            <img src="https://minio.thecoffeehouse.com/image/tchmobileapp/386_ic_momo@3x.png" alt="" />
                          </span>
                          <span class="text">Momo</span>
                        </label>
                      </div>
                    </li>
                    <li class="tch-payment-method-item">
                      <div class="custom-control custom-radio mb-0">
                        <input type="radio" name="payment-method" id="vnpay" class="custom-control-input" value="vnpay"
                          v-model="paymentOptions" />
                        <label for="Vnpay" class="custom-control-label tch-custom-radio" style="padding-left: 6px">
                          <span class="icon ml-3 mr-2">
                            <img
                              src="https://minio.thecoffeehouse.com/image/tchmobileapp/1120_1119_ShopeePay-Horizontal2_O.png"
                              alt="" />
                          </span>
                          <span class="text">VNPAY</span>
                        </label>
                      </div>
                    </li>
                    <li class="tch-payment-method-item">
                      <div class="custom-control custom-radio mb-0">
                        <input type="radio" name="payment-method" id="123PAY" class="custom-control-input" value="atm"
                          v-model="paymentOptions" />
                        <label for="123PAY" class="custom-control-label tch-custom-radio" style="padding-left: 6px">
                          <span class="icon ml-3 mr-2">
                            <img src="https://minio.thecoffeehouse.com/image/tchmobileapp/385_ic_atm@3x.png" alt="" />
                          </span>
                          <span class="text">Thẻ ngân hàng</span>
                        </label>
                      </div>
                    </li>
                  </ul>

                  <!--              policy -->
                  <div class="policy">
                    <label class="checkbox-button fix_position" style="margin-left: 50px">
                      <input checked="checked" disabled="disabled" type="checkbox" id="choice1-1" name="choice1"
                        class="checkbox-button__input" />
                      <span class="checkbox-button__control"></span>
                      <span class="checkbox-button__label">
                        Đồng ý với các
                        <a href="#" style="color: #fa8c16">điều khoản và điều kiện</a>
                        mua hàng của The Coffee House
                      </span>
                    </label>
                  </div>
                </div>

                <!--            xóa đơn hàng -->
                <div style="
                      display: flex;
                      flex-direction: column;
                      padding: 38px 0 16px 0;
                    ">
                  <p class="tch-checkout-box__text text-center mb-0 fix_position">
                    <span class="icon mr-2">
                      <v-icon color="#fa8c16">mdi-delete</v-icon>
                    </span>
                    <button @click="handleDeleteTotal">Xóa đơn hàng</button>
                  </p>
                </div>
              </div>
            </v-col>

            <!-- cột bên phải-->
            <v-col cols="12" md="6" lg="6">
              <div style="
                    box-shadow: 0 -4px 10px rgb(0 0 0 / 12%);
                    border-radius: 8px;
                  ">
                <div class="px-5">
                  <div class="py-3">
                    <!--              các món đã chọn-->
                    <div class="tch_checkout_cus_deli">
                      <h4 class="checkout_delivery_text">Các món đã chọn</h4>
                      <a @click="handleClickMainpage()" style="text-decoration: none; color: black">
                        <p class="checkout_delivery_btn">Thêm món</p>
                      </a>
                    </div>
                    <!--                  list các món đã chọn-->
                    <div class="tch-order-card product_chose_item" v-for="(order, index) in orders" :key="index"
                      style="display: inherit">
                      <div v-for="product in order.product_item" :key="product.name" class="product_chose_item">
                        <div class="tch-order-card__left" style="display: flex">
                          <Card_Fix_Order style="z-index: 999" :count="order.count" :index="index" :size="order.size"
                            :currentID="product.id" :dialog="false" :id="product.id" :image_url="product.image_url"
                            :name="product.name" :description="product.description" :price="product.price"
                            :isInProductListing="0">
                          </Card_Fix_Order>
                          <div class="tch-order-card__content">
                            <h5 class="tch-order-card__title mb-0">
                              {{ order.count }} x {{ product.name }}
                            </h5>
                            <p class="tch-order-card__description mb-0" v-if="order.topping_items.length > 1">
                              {{ order.size }} , {{ order.count }} x
                              {{ order.size }}
                            </p>
                            <div class="tch-order-card__description mb-0" v-for="topping in order.topping_items"
                              :key="topping.id">
                              <p v-if="topping.count !== 0" style="margin: 0">
                                {{ topping.name }}, x {{ topping.count }}
                              </p>
                            </div>
                            <!---->
                            <v-btn size="x-small" v-on:click="handleDeleteOne(order)">xóa</v-btn>

                            <!--    <p class="tch-order-delete-item" @click="handleDeleteOne(order)">Xóa </p> -->
                          </div>
                        </div>
                        <div class="tch-order-card__right">
                          <p class="tch-order-card__price mb-0">
                            {{ getProductPrice(order) }}đ
                          </p>
                        </div>
                      </div>
                    </div>

                    <!--thanh toán -->
                    <div class="tch-checkout-box tch-checkout-box--list-total tch-checkout-border"
                      style="padding: 14px 0 30px">
                      <div class="tch_checkout_cus_deli">
                        <h4 class="checkout_delivery_text">Tổng cộng</h4>
                      </div>
                      <div class="tch-order-card tch-order-card--border product_chose_item">
                        <div class="tch-order-card__left" style="display: flex">
                          <p class="tch-order-card__text mb-0">Thành tiền</p>
                        </div>
                        <div class="tch-order-card__right">
                          <p class="tch-order-card__price mb-0">
                            {{ get_totalprice() }}đ
                          </p>
                        </div>
                      </div>

                      <div class="tch-order-card product_chose_item">
                        <div class="tch-order-card__left d-flex">
                          <p class="tch-order-card__text mb-0">Phí giao hàng</p>
                        </div>
                        <div class="tch-order-card__right">
                          <p class="tch-order-card__price mb-0">15.000đ</p>
                        </div>
                      </div>
                      <hr />
                      <div class="tch-order-card product_chose_item">
                        <div class="tch-order-card__left d-flex">
                          <Card_User_Voucher style="z-index: 999" :total_price="total_price * 1000">

                          </Card_User_Voucher>
                        </div>
                      </div>
                      <div class="tch-order-card product_chose_item">
                        <div class="tch-order-card__left d-flex">
                          <h3 class="tch-order-card__text mb-0">
                            {{ voucher_des }}
                          </h3>
                        </div>
                        <div class="tch-order-card__right">
                          <p class="tch-order-card__price mb-0">
                            -{{ discount }}đ
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--                  tiến hàng đặt hàng -->
                </div>
                <div class="tch-checkout-box--list-submited position-static"
                  style="display: flex; justify-content: space-between">
                  <div>
                    <p class="tch-order-card__text text-white mb-0">
                      Thành tiền
                    </p>
                    <p class="tch-order-card__text text-white mb-0" style="font-weight: 600">
                      {{ money_pay }}đ
                    </p>
                  </div>
                  <button data-v-ccef1d60="" type="button" class="btn btn--white text-orange btn--radius-100"
                    @click="handleDatHang">
                    Đặt hàng
                  </button>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<script>

import { addOrder } from '@/api/order'
import { paidOrder } from '@/api/order'
import { createPaymentMomo } from '@/api/payment'
export default {
  name: "checkOut",
  components: {
    Card_Fix_Order: () => import("@/components/productComponents/Card_Fix_Order"),
    Card_User_Voucher: () => import("@/components/productComponents/Card_User_Voucher"),
  },
  data() {
    return {
      paymentOptions: "cod",
      order_id: 0,
      logged: 0,
      user: {},
      name: "",
      phone: "",
      oldAddress: " ",
      noteDelivery: "",
      orders: [],
      dialog: false,
      dialog2: false,
      myInput: "",
      total_price: 0,
      money_pay: 0,

      voucherList: [],
      voucher_des: "xem thêm khuyến mãi",
      voucher_price: 0,
      voucher_type: "",
      voucher_percent: 0,
      discount: 0,

      products_info: [],
      orderInfo: {
        user_id: 0,
        user_name: "",
        mobile_no: "",
        order_date: "",
        address: "",
        note: "",
        total_price: "",
        payment_method: "",
        products: []
      },
      selected: null,
      options: {
        apiKey: process.env.VUE_APP_PLACE_API_KEY,
        deepSearch: true,
        cors: true,
        focus: false,
        params: {
          location: '-33.8688,151.2195',
          radius: 1000,
          language: 'en'
        }
      }
    }
  },
  created() {
    if (JSON.parse(localStorage.getItem("order")) != null) {
      this.orders = JSON.parse(localStorage.getItem("order"))
      //console.log("order 2: ", this.orders)
      if (JSON.parse(localStorage.getItem("user")) == null) {
        // this.user = localStorage.getItem("user")
        this.logged = 0
        this.name = "Tên người nhận"
        this.phone = "Số điện thoại"
        this.oldAddress = "Chưa có địa chỉ giao hàng"
      } else {
        this.logged = 1
        this.user = JSON.parse(localStorage.getItem("user"))
        this.name = this.user.last_name + " " + this.user.first_name
        this.phone = this.user.mobile_no
        console.log("name: ", this.name)
        if (localStorage.getItem("oldAddress") == null || localStorage.getItem("oldAddress").length == 0) {
          console.log("here: ", this.user.address)
          this.oldAddress = this.user.address
        } else {
          console.log("here2: ", localStorage.getItem("oldAddress"))
          this.oldAddress = JSON.parse(localStorage.getItem("oldAddress"))
        }
      }
      this.getProductsInfo()
      this.money_pay = this.get_moneypay()
      console.log("money pay: ", this.money_pay)
    } else {
      console.log("NOTTTTTTTTTTTT")
      alert("Ban chua co gi de thanh toan")
      this.$router.push('/')
    }
  },

  mounted() {
    // Lắng nghe sự kiện khi tổng số đơn hàng thay đổi
    window.addEventListener('order-total-changed', (event) => {
      // Kiểm tra nếu storage là null
      if (event.detail.storage == null) {
        this.orders = 0;
      } else {
        // Cập nhật đơn hàng từ storage
        this.orders = JSON.parse(event.detail.storage);
        this.money_pay = this.get_moneypay(); // Cập nhật lại số tiền cần thanh toán
      }
    });

    // Lắng nghe sự kiện khi voucher trong localStorage thay đổi
    window.addEventListener('voucher-localstorage-changed', (event) => {
      // Kiểm tra nếu storage là null
      if (event.detail.storage == null) {
        this.voucherList = 0;
      } else {
        // Cập nhật mô tả và giá của voucher từ storage
        const voucherData = JSON.parse(event.detail.storage);
        this.voucher_des = voucherData.description;
        this.voucher_price = voucherData.price;
        this.voucher_type = voucherData.discount_type;
        this.voucher_percent = voucherData.discount_percent;
        this.money_pay = this.get_moneypay(); // Cập nhật lại số tiền cần thanh toán
      }
    });
  },


  methods: {
    handleClickMainpage() {
      this.$router.push("/");
    },

    handleDeleteOne(order) {
      if (confirm("Bạn muốn xóa item này?")) {
        this.orders = this.orders.filter(function (el) {
          return el != order;
        })
        localStorage.setItem("order", JSON.stringify(this.orders))
        window.dispatchEvent(new CustomEvent('order-total-changed', {
          detail: {
            storage: localStorage.getItem('order')
          }
        }));
        //set lai gia tri cho voucher
        this.voucher_price = 0
        this.voucher_des = "xem thêm khuyến mãi"
        this.voucher_type = ""
        this.voucher_percent = 0
        this.discount = 0
        this.money_pay = this.get_moneypay()
        if (this.orders.length == 0) {
          this.products_info = []
          this.orders = []
          localStorage.removeItem("order")
          window.open("/mainpage", "_self")
        }
      }
    },

    separator(numb) {
      var str = numb.toString().split(".");
      str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return str.join(".");
    },

    handleDeleteTotal() {
      if (confirm("Bạn muốn hủy toàn bộ đơn hàng?")) {
        alert("Xóa thành công")
        this.products_info = []
        this.orders = []
        localStorage.removeItem("order")
        window.open("/mainpage", "_self")
      }
    },

    getProductPrice(order) {

      let topping_price = 0;
      let total_product_price = 0;
      //tính giá của topping = giá của mỗi topping * số lượng topping đó
      order.topping_items.forEach((topping_item) => {
        topping_price += Number(topping_item.price) * topping_item.count
      })
      //tính giá của sản phẩm = (giá của sản phẩm + giá của topping) * số lượng sản phẩm
      total_product_price += (Number(order.product_item[0].price) + topping_price) * order.count
      //nếu size của sản phẩm là M thì cộng thêm 6000 * số lượng sản phẩm
      if (order.size == "M") {
        total_product_price += 6000 * order.count
      } else if (order.size == "L") {
        total_product_price += 10000 * order.count
      }
      return this.separator(total_product_price);
    },

    // Tính tổng giá tiền của tất cả các sản phẩm trong giỏ hàng
    get_totalprice() {
      let price = 0;
      if (this.orders) {
        if (this.orders.length != 0) {
          this.orders.forEach((order) => {
            order.product_item.forEach((product) => {
              price += parseInt(product.price) * order.count;
            });
            order.topping_items.forEach((topping_item) => {
              price += Number(topping_item.price) * topping_item.count
            });

            if (order.size == "M") {
              price += 6000
            } else if (order.size == "L") {
              price += 10000
            }
          });

          this.total_price = this.separator(price)
          return this.separator(price);
        } else {
          return "0"
        }
      }
    },

    // Tính số tiền cần thanh toán sau khi đã trừ giảm giá của voucher (nêu có)
    get_moneypay() {
      // console.log("money pay: ", this.money_pay)
      // console.log("total price: ", this.total_price)
      // console.log("voucher price: ", this.voucher_price)
      let price = Number(this.get_totalprice()) * 1000 + 15000
      if (this.voucher_price > price) {
        this.discount = this.separator(price)
        price = 0
      } else {
        if (this.voucher_type == "percent") { // nếu voucher là giảm theo %
          this.discount = price * this.voucher_percent / 100
          if (this.discount > this.voucher_price) { // nếu giảm giá lớn hơn giá trị voucher thì giảm giá = giá trị voucher
            this.discount = this.separator(this.voucher_price)
            price = price - this.voucher_price
          } else {
            price = price - this.discount
          }
        } else if (this.voucher_type == "amount") { // nếu voucher là giảm theo số tiền cố định
          this.discount = this.separator(this.voucher_price)
          price = price - this.voucher_price
        }

      }
      this.total_price = this.separator(price)
      this.money_pay = this.separator(price)
      // console.log("money pay: ", this.money_pay)
      // console.log("total price: ", this.total_price)
      return this.money_pay
    },


    getProductsInfo() {
      if (this.orders) {
        if (this.orders.length != 0) {
          //console.log("In checkOut, this.orders: ", this.orders)
          for (let product of this.orders) {
            let productInfo = {
              product_id: product.id,
              product_count: product.count,
              size: product.size,
              price: product.product_item[0].price,
              topping_id: [],
              topping_count: [],
            }
            let topping_id = []
            let topping_count = []
            for (let topping_item of product.topping_items) {
              topping_id.push(topping_item.id)
              topping_count.push(topping_item.count)
            }

            productInfo.topping_id = JSON.parse(JSON.stringify(topping_id))
            productInfo.topping_count = JSON.parse(JSON.stringify(topping_count))
            this.products_info.push(JSON.parse(JSON.stringify(productInfo)))
          }
          //console.log("In checkOut, products_info: ", this.products_info)
        }
      }
    },

    async handleDatHang() {
      if (this.logged == 0) {
        alert("Bạn cần đăng nhập để tiếp tục")
      } else {
        // console.log("PaymentOptions: ", this.paymentOptions)
        // console.log("old Address: ", this.oldAddress)

        console.log("total price: ", Number(this.money_pay) * 1000)
        if (this.paymentOptions == 'cod') { // neu chon thanh toan tien mat
          try {
            const response = await addOrder({
              user_id: this.user.id,
              user_name: this.name,
              mobile_no: this.phone,
              address: this.oldAddress,
              note: this.noteDelivery,
              total_price: Number(this.money_pay) * 1000,
              discount_money: Number(this.discount) * 1000,
              payment_method: this.paymentOptions,
              products: JSON.parse(JSON.stringify(this.products_info))
            })
            console.log("RES:\n")
            console.log("respon1: ", response);
            console.log("END RES\n")
            alert("Bạn đã đặt hàng thành công")
            this.products_info = []
            this.orders = []
            localStorage.removeItem("order")
            window.open("/mainpage", "_self")
          } catch (error) {
            console.log("Start\n");
            console.log(error.response)
            console.log("END\n");
          }
        } else { // neu chon thanh toan online
          try {
            const response = await addOrder({
              user_id: this.user.id,
              user_name: this.name,
              mobile_no: this.phone,
              address: this.oldAddress,
              note: this.noteDelivery,
              total_price: Number(this.money_pay) * 1000,
              discount_money: Number(this.discount) * 1000,
              payment_method: this.paymentOptions,
              products: JSON.parse(JSON.stringify(this.products_info))
            })
            if (response) {
              // console.log("RES:\n")
              // console.log("respon1: ", response);
              // console.log("this total price: ", Number(this.money_pay) * 1000)
              // console.log("END RES\n")
              this.order_id = response.data.order_id
              //console.log("orrderid: ", this.order_id)
              try {
                const response2 = await createPaymentMomo({
                  order_id: this.order_id,
                  total_price: Number(this.money_pay) * 1000
                })
                if (response2) {
                  console.log("respon2: ", response2)
                  try {
                    const response3 = await paidOrder({
                      order_id: this.order_id
                    })
                    if (response3) {
                      console.log(response)
                      this.products_info = []
                      this.orders = []
                      localStorage.removeItem("order")
                      window.open(response2.data, "_self")
                      //sau khi thanh toan thanh cong thi chuyen den trang mainpage thi
                    }
                  } catch (error) {
                    console.log("Start3\n");
                    console.log(error)
                    console.log("END3\n");
                  }
                }
              } catch (error) {
                console.log("Start2\n");
                console.log(error)
                console.log("END2\n");
              }
            }
          } catch (error) {
            console.log("Start\n");
            console.log(error)
            console.log("END\n");
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.my-custom-dialog {
  align-self: flex-start;
  margin-top: 125px
}

.fix_font {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

.fill-weight {
  /* width: auto !important; */
  min-width: 100%;
  width: 1520px !important;
  /* height: 749px !important; */
  justify-content: center;
  /* max-width: 100%; */

}

.tch_checkout_header {
  margin-bottom: 3.125rem;
}

.tch_checkout_header-title {
  font-size: 28px;
  line-height: 36px;
  font-weight: 600;
  color: #242424;
}

.tch_checkbox_deli {
  width: calc(50% - 50px);
  margin-left: 50px;
  padding: 16px 0;
  float: left !important;
}

.tch_checkout_cus_deli {
  display: flex;
  justify-content: space-between;
}

.checkout_delivery_text {
  position: relative;
  padding-bottom: 6px;
  color: #262626;
  font-size: 18px;
  line-height: 26px;
  font-weight: 600;
}

.checkout_delivery_text:after {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 2px;
  background: #fa8c16;
  border-radius: 6px;
  content: "";
  z-index: 999;
}

.checkout_delivery_btn {
  padding: 7px 22px;
  background: white;
  font-size: 12px;
  line-height: 22px;
  border: 1px solid #262626;
  border-radius: 100px;
  cursor: pointer;
}

.tch_deli_address {
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  margin-left: 50px;
}

.tch_delivery_card {
  padding: 12px 0;
  cursor: pointer;
}

.tch_delivery_content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-left: 12px;
}

.delivery_address {
  font-size: 0.8375rem;
  line-height: 24px;
  height: 24px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.delivery_address_description {
  font-size: 14px;
  line-height: 22px;
}

.form-group {
  margin-bottom: 16px;
}

input {
  font-size: 1rem;
  line-height: 1.5;
  padding: 11px 23px;
  border: 1px solid rgba(0, 0, 0, .15);
  border-radius: 0;
  outline: 0;
  background-color: transparent;
}

.form-control {
  display: block;
  width: 100%;
  height: calc(1.5em + .75rem + 2px);
  /*padding: .375rem .75rem;*/
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: .25rem;
  transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
}

.tch-delivery__input {
  height: 2.75rem;
  padding: 10px 23px;
  background: #fafafa;
  border: 1px solid #ededed;
  font-family: inherit;
  font-size: 13.4px;
  font-weight: 350;
}

.fix_position {
  width: calc(100% - 40px);
}

.time_deli {
  padding: 12px 0;
}

.tch-list-payment-method {
  margin: 0 0 0 40px;
  list-style: none;
}

.tch-payment-method-item {
  padding: 1rem 0;
  border-bottom: 1px solid #c4c4c4;
}

.custom-control {
  position: relative;
  z-index: 1;
  display: block;
  min-height: 1.5rem;
  padding-left: 1.5rem;
  -webkit-print-color-adjust: exact;
}

.custom-control-input {
  width: 1.5rem;
  height: 1.5rem;
}

.custom-control-label {
  cursor: pointer;
  position: relative;
  margin-bottom: 0;
  vertical-align: top;
}

label {
  display: inline-block;
}

.tch-list-payment-method .tch-payment-method-item .custom-control-label .icon {
  width: 1.5rem;
  height: 0.8375rem;
}

.tch-payment-method-item img {
  object-fit: cover;
  width: 1.5rem;
  height: 0.8375rem;
}

.tch-list-payment-method .tch-payment-method-item .custom-control-label .text {
  font-size: 0.8375rem;
  line-height: 1.5rem;
  color: #262626;
}

.policy {
  margin-top: 30px;
}

.checkbox-button {
  cursor: pointer;
}

.checkbox-button__input {
  opacity: 0;
  position: absolute;
}

.checkbox-button__control {
  /*border-color: #fa8c16;*/
  position: relative;
  display: inline-block;
  width: 25px;
  height: 25px;
  margin-right: 12px;
  vertical-align: middle;
  background-color: inherit;
  color: #fa8c16;
  border: 3px solid #fa8c16;
}

.checkbox-button__control::after {
  content: "";
  display: block;
  position: absolute;
  top: 3px;
  left: 3px;
  width: 12px;
  height: 10px;
  font-size: 69px;
  background: url(https://minio.thecoffeehouse.com/images/tch-web-order/Vector.png);
}

.checkbox-button__label {
  color: #262626;
  font-size: 16px;
}

.tch-checkout-box__text {
  color: #fa8c16;
  font-size: 0.8375rem;
  line-height: 1.5rem;
}

.tch-checkout-box__text .icon {
  font-size: 1.25rem;
  line-height: 1;
}

.tch-order-card {
  min-height: 3.5rem;
  padding: 0.75rem 0;
  cursor: pointer;
}

.product_chose_item {
  align-items: center;
  justify-content: space-between;
  display: flex;
}

.tch-order-card__icon {
  font-size: 0.8375rem;
  line-height: 1;
  color: #fa8c16;
}

.tch-order-card__content {
  padding-left: 30px;
  flex: 1;
  color: #262626;
}

.tch-order-card__title,
.tch-order-card__text {
  font-size: 0.8375rem;
  line-height: 1.5rem;
  height: 24px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.tch-order-card__description {
  font-size: 0.8375rem;
  line-height: 1.375rem;
}

.tch-order-delete-item {
  display: inline;
}

.tch-order-card--border::after {
  position: absolute;
  bottom: -1px;
  right: 0;
  content: "";
  height: 1px;
  background-color: #c4c4c4;
  opacity: .3;
}

hr {
  border-bottom: 0.2px solid #c4c4c4;
}

.tch-checkout-box {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

.tch-checkout-box--list-submited {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  background: radial-gradient(75.9% 488.28% at 24.1% 100%, #e87800 0%, #fa8c16 100%);
  box-shadow: 0 2px 8px rgb(0 0 0 / 12%);
  padding: 0.8375rem 15px;
}

.text-white {
  color: #fff !important;
}

.btn.btn--radius-100 {
  border-radius: 6.25rem !important;
}

.btn.btn--white {
  background: white;
}

.btn {
  padding: 0.375rem 1.375rem;
}

.text-orange {
  color: #fa8c16;
}

/*p {*/
/*  margin-top: 0;*/
/*  margin-bottom: 1rem;*/
/*}*/

.modal-header {
  justify-content: space-between;
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: calc(.3rem - 1px);
  border-top-right-radius: calc(.3rem - 1px);
}

.icon {
  color: black;
  font-size: 0.8375rem;
  line-height: 1.5rem;

}

.modal-title {
  font-size: 0.8375rem;
  line-height: 1.5rem;
  color: #262626;
  margin: auto;
  font-weight: 500;
}

.modal-body {
  padding: 1rem;
}
</style>
