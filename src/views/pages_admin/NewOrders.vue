<template>
  <v-container fluid class="topss down-top-padding" >

    <adminHeader></adminHeader>

    <v-row style="background-color: white">
      <v-col cols="12" sm="6" >
        <v-row>
          <v-col cols="12" sm="12" md="12"  >
            <h2  style="justify-content: center; display: flex;left: 50%; padding: 16px 0;margin-bottom: 12px">New Orders</h2>
          </v-col>
        </v-row>
      </v-col>
      <v-row>
        <v-col cols="6" offset-sm="4" class="mt-2">
          <v-row>
              <v-row class="mt-4 grey--text text--darken-2 font-weight-regular" justify="center" align="center" >TỔNG SỐ ORDER TRONG NGÀY</v-row>
              <v-row class="mt-3 title black--text text--darken-2 font-weight-regular text-h5 " justify="center" align="center" >{{new_orders.length}}</v-row>
          </v-row>
        </v-col>
        <v-card-title>
            <v-col cols="12" offset-sm="6">
              <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Nhập mã đơn hàng "
                  single-line
                  dense
                  hide-details
              ></v-text-field>
            </v-col>
          </v-card-title>
      </v-row>
      
      <v-col cols="12" md="12" lg="12">
        <v-row>
          <v-data-table
              disable-sort
              :header-props="{ sortIcon: null }"
              :headers="headers"
              :search="search"
              :items="new_orders"
              :items-per-page="5"
              class="elevation-1"
              style="width: 100%"
              @click:row="selected"
          >
            <template v-slot:item="{ item }">
              <tr style="text-align: center">
                <td>{{item.number}}</td>
                <td  @click="rowClicked(item.order_id)"><u style="cursor: pointer" >{{item.order_id}}</u></td>
                <td>{{item.order_time}}</td>
                <td>{{item.mobile_no}}</td>
                <td>{{item.address}}</td>
              </tr>
            </template>

          </v-data-table>
        </v-row>
      </v-col>
    </v-row>
    <Footer></Footer>
  </v-container>
</template>

<script>
import { getUnsuccessOrders } from "@/api/order"
export default {
  name: "NewOrders",
  components: {
    adminHeader: () => import('@/layouts/header/adminHeader'),
    Footer: () => import('@/layouts/footer/Footer'),
  },
  data () {
    return {
      order_id_detail:'',
      search: '',
      selected:[],
      singleSelect: false,
      headers: [
        {text: 'STT', align: 'center', value: 'number', width:'10%',},
        { text: 'MÃ ĐƠN ', value: 'order_id',align: 'center',width: '15%' },
        { text: 'Thời gian', value: 'order_time',align: 'center',width: '20%' },
        { text: 'SỐ ĐIỆN THOẠI', value: 'mobile_no',align: 'center',width: '15%' },
        { text: 'ĐỊA CHỈ', value: 'address',align: 'center',width: '50%' },

      ],
      new_orders: [],
    }
  },
  created(){
    if (localStorage.getItem("AdminLoggedIn") == "false") {
      this.$router.push("/pages/login")
    }
    else {
      this.getOrders()
    }
  },
  methods:{
    async getOrders() {
      try {
        const response = await getUnsuccessOrders()
        console.log("Unsucess: ", response.data);
        this.new_orders = response.data.orders;
        for (let i in this.new_orders) {
          this.new_orders[i].number = Number(i) + 1
        }
      } catch (error) {
        console.log("Start\n");
        console.log(error.response)
        console.log("END\n");
      }
    },
    rowClicked(row) {
      this.order_id_detail = row;
      this.$router.push({
        name: "OrderDetails",
        params: {order_detail_id: `${this.order_id_detail}`},
      }).catch(() => {});
    },
  },


};
</script>

<style>
.parent-class >>> .v-toolbar__content {
  padding: 0px !important;
}

.topss{
  align-items: start;

}
</style>
