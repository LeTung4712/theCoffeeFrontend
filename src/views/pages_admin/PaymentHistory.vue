<template>
  <v-container fluid class="down-top-padding">
    <adminHeader></adminHeader>
    <v-row class="pt-3">
      <v-col cols="12" sm="12" class="pa-0 ">
        <v-card style="padding: 0 12px">
          <v-row>
            <v-col cols="12" sm="6">
              <v-row>
                <v-col cols="12" sm="3">
                  <v-avatar style="border-radius: 20%" size="120">
                    <img :src="require('@/assets/logo.jpg')" alt="user" width="300px" class="img-fluid  shadow-sm" />
                  </v-avatar>
                </v-col>
                <v-col cols="12" sm="9">
                  <h4 class="mt-3 title black--text text--darken-2 font-weight-regular ">THE COFFEE PAYMENT</h4>
                  <h4 class="grey--text text--darken-2 font-weight-light text-subtitle-1 mt-n2">The Coffee Khoa</h4>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" sm="6" class="mt-2">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-row class="mt-4 grey--text text--darken-2 font-weight-regular" justify="center" align="center">TỔNG
                    TIỀN GD TRONG NGÀY</v-row>
                  <v-row class="mt-3 title black--text text--darken-2 font-weight-regular text-h5 " justify="center"
                    align="center"> {{ saleTotal }}VNĐ </v-row>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-row class="mt-4 grey--text text--darken-2 font-weight-regular" justify="center" align="center">TỔNG
                    SỐ GD TRONG NGÀY</v-row>
                  <v-row class="mt-3 title black--text text--darken-2 font-weight-regular text-h5 " justify="center"
                    align="center">{{ countOrders }}</v-row>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="mt-4 ml-9 grey--text text--darken-2 font-weight-regular">NGÀY {{ mydate }}
                    <input type="date" v-model="mydate">
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-card-title>
            <v-col cols="6" offset-sm="6">
              <v-text-field v-model="search" append-icon="mdi-magnify" label="Nhập mã đơn hàng " single-line dense
                hide-details></v-text-field>
            </v-col>
          </v-card-title>

          <v-data-table :headers="headers" :items="contents" :search="search" :items-per-page="10"
            :sort-by="['order_time']" :sort-desc="true">
            <template v-slot:item="{ item }">
              <tr v-if="item.order_time.slice(0, 10) === mydate">
                <td>{{ item.order_time }}</td>
                <td>{{ item.order_id }}</td>
                <td>{{ separator(item.total_price) }}</td>
                <td>{{ item.user_name }}</td>
                <td>{{ item.note }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <Footer></Footer>
  </v-container>
</template>

<script>
import { getSuccessOrders } from "@/api/order";
export default {
  name: "PaymentHistory",
  components: {
    adminHeader: () => import('@/layouts/header/adminHeader'),
    Footer: () => import('@/layouts/footer/Footer'),
  },
  data() {
    return {
      mydate: new Date().toISOString().slice(0, 10),
      search: '',
      count: 0,
      headers: [
        { text: 'THỜI GIAN', align: 'start', sortable: true, value: 'order_time', width: '16%', },
        { text: 'Mã ĐƠN HÀNG', value: 'order_id', width: '16%' },
        { text: 'SỐ TIỀN', value: 'total_price', width: '14%' },
        { text: 'TÊN KHÁCH HÀNG ', value: 'user_name', width: '14%' },
        { text: 'GHI CHÚ', value: 'address', width: '40%' },
      ],
      contents: []
    }
  },
  computed: {
    saleTotal() {
      let total = 0;
      for (let i = 0; i < this.contents.length; i++) {
        if (this.contents[i].order_time.slice(0, 10) === this.mydate)
          total += parseInt(this.contents[i].total_price)
      }
      return this.separator(total);
    },

    countOrders() {
      return this.contents.filter(item => item.order_time.slice(0, 10) === this.mydate).length;
    },

  },
  created() {
    if (localStorage.getItem("AdminLoggedIn") == "false") {
      this.$router.push("/pages/login")
    }
    else {
      this.getOrders()
    }
  },
  methods: {

    //lấy danh sách các đơn hàng thành công
    async getOrders() {
      try {
        const response = await getSuccessOrders();
        this.contents = response.data.orders;
        console.log("Sucess: ", response.data);
      } catch (error) {
        console.log("Start\n");
        console.log(error.response)
        console.log("END\n");
      }
    },
    separator(numb) {
      var str = numb.toString().split(".");
      str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return str.join(".");
    },

  }
};
</script>