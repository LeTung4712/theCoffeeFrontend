<template>
  <v-container fluid class="down-top-padding">
    <adminHeader></adminHeader>


    <v-row align="center">
      <v-col cols="3">
        <div class="ml-6">
          <v-select label="Chọn thuật toán" :items="['FpGrowth', 'Apriori',]" v-model="selected" clearable>
          </v-select>
        </div>
      </v-col>
      <v-col cols="2">
        <v-btn color="primary" dark large class="ml-4 mt-9 mb-9" :disabled="isDisabled"
          @click="selected === 'FpGrowth' ? handleAnalyzeFpGrowth() : handleAnalyzeApriori()">
          PHÂN TÍCH
        </v-btn>
      </v-col>


      <div v-if="isLoading">
        <v-progress-circular :rotate="-90" :size="80" :width="15" :value="progress" color="success">
          {{ progress }}
        </v-progress-circular>

      </div>
      <div v-if="isLoading" class="ml-4 mt-9 mb-9">Đang phân tích...</div>
      <v-alert v-if="isCountDown" type="warning" class="ml-4 mt-9 mb-9" border="left" elevation="2">
        Bạn chỉ có thể phân tích sau {{ countdown }} giây
      </v-alert>
    </v-row>
    <v-col cols="12" md="12" lg="12">
      <v-row>
        <div class="offset-md-4 mb-1">
          <v-card-actions>
            <v-spacer></v-spacer>
            <strong>THÔNG TIN THỐNG KÊ XU HƯỚNG</strong>
            
            <div style = "margin-left:20px" v-if="countTransaction != 0">
            Tổng số giao dịch: {{ countTransaction }}
          </div>
          </v-card-actions>
          
        </div>
        <v-data-table dense disable-sort :header-props="{ sortIcon: null }" :headers="headers" :items="products_infors"
          class="elevation-1" style="width: 100%">
        </v-data-table>
      </v-row>
    </v-col>
    <Footer></Footer>
  </v-container>
</template>

<script>
import { getAssociationRules, analyzeApriori, analyzeFpGrowth } from '@/api/recommend'
export default {
  name: "Profile",
  data() {
    return {
      isLoading: false,
      isDisabled: false,
      isCountDown: false,
      countdown: 60,
      progress: 0,
      countTransaction: 0,
      headers: [{
        text: 'STT',
        align: 'center',
        value: 'number',
        width: '10%',
      },
      {
        text: 'ĐIỀU KIỆN ',
        value: 'antecedent_name',
        align: 'center',
        width: '30%'
      },
      {
        text: 'KẾT QUẢ GỢI Ý',
        value: 'consequent_name',
        align: 'center',
        width: '30%'
      },
      {
        text: 'ĐIỂM TIN CẬY',
        value: 'confidence',
        align: "center",
        width: '10%'
      },

      ],
      products_infors: [],
      associationRules: [],
      interval: {},
      selected: 'FpGrowth'
    }
  },
  components: {
    adminHeader: () => import('@/layouts/header/adminHeader'),
    Footer: () => import('@/layouts/footer/Footer'),
  },
  beforeUnmount() {
    this.stopProgress()
    clearInterval(this.countdownInterval)
  },
  mounted() {

  },
  created() {
    if (localStorage.getItem("AdminLoggedIn") == "false") {
      this.$router.push("/pages/login")
    } else {
      this.getAssociationRules()
    }
  },
  methods: {
    //lấy ra thông tin của các sản phẩm trong tập quy tắc
    async getAssociationRules() {
      try {
        const response = await getAssociationRules()
        // console.log('association rules', response.data)
        this.products_infors = []
        this.associationRules = response.data.associationRules
        // console.log('association rules 1', this.associationRules)
        for (let index in this.associationRules) {
          let antecedent_name = []
          let consequent_name
          //lấy ra confidence và chuyển về dạng % lấy 2 số sau dấu phẩy
          let confidence = (this.associationRules[index].confidence * 100).toFixed(2) + '%'
          for (let i in this.associationRules[index].antecedent_products) {
            //in mỗi sản phẩm 1 dòng
            antecedent_name.push(this.associationRules[index].antecedent_products[i].name)

          }
          for (let i in this.associationRules[index].consequent_products) {
            consequent_name = this.associationRules[index].consequent_products[i].name
          }
          //console.log('antecedent_name', antecedent_name)
          //console.log('consequent_name', consequent_name)
          this.products_infors.push({
            number: parseInt(index) + 1,
            antecedent_name: antecedent_name,
            consequent_name: consequent_name,
            confidence: confidence
          })
        }
      } catch (error) {
        console.log(error)
      }
    },

    //gọi api phân tích apriori
    async handleAnalyzeApriori() {
      if (this.isDisabled) return;
      this.progress = 0;
      this.isLoading = true;
      this.isDisabled = true;
      this.countdown = 10;
      this.startProgress();

      try {
        const response = await analyzeApriori();
        await this.fetchDataFromApi();
        this.countTransaction = response.data.countTransactions;
        this.progress = 100;
        this.getAssociationRules();
      } catch (error) {
        console.error("Error fetching data: ", error);
        this.progress = 0;
      } finally {
        this.stopProgress();
        this.isLoading = false;
        this.isCountDown = true;
        this.startCountdown();
      }
    },

    //gọi api phân tích fp-growth
    async handleAnalyzeFpGrowth() {
      if (this.isDisabled) return;
      this.progress = 0;
      this.isLoading = true;
      this.isDisabled = true;
      this.countdown = 10;
      this.startProgress();
      try {
        const response = await analyzeFpGrowth();
        await this.fetchDataFromApi();
        this.countTransaction = response.data.countTransactions;
        this.progress = 100;
        this.getAssociationRules();
      } catch (error) {
        console.error("Error fetching data: ", error);
        this.progress = 0;
      } finally {
        this.stopProgress();
        this.isLoading = false;
        this.isCountDown = true;
        this.startCountdown();
      }
    },
    startProgress() {
      this.interval = setInterval(() => {
        if (this.progress >= 100) {
          return;
        }
        this.progress += 10;
      }, 1000);
    },
    stopProgress() {
      clearInterval(this.interval);
    },
    async fetchDataFromApi() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: "API data" });
        }, 10000); // Giả định API mất 10 giây để phản hồi
      });
    },
    //xử lý sau khi click phân tích thì sau 20s mới được ấn lại phân tích
    startCountdown() {
      this.countdownInterval = setInterval(() => {
        if (this.countdown <= 0) {
          clearInterval(this.countdownInterval);
          this.isCountDown = false; // Ẩn thông báo đếm ngược
          this.isDisabled = false; // Kích hoạt lại nút khi đếm ngược kết thúc
          return;
        }
        this.countdown -= 1;
      }, 1000);
    },
  }

};
</script>

<style scoped>
.store_infor {
  text-align: left;
  position: relative;
}

.store_infor::before {
  content: "";
  position: absolute;
  width: 60%;
  bottom: -5px;
  left: 0;
  border-bottom: 2px solid #fa8c16;
}

.v-text-field {
  width: 500px;
}

.v-progress-circular {
  margin: 1rem;
}
</style>