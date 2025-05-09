import { defineStore } from "pinia";

export const useAnalyzeStore = defineStore("analyze", {
  state: () => ({
    isLoading: false,
    timeRange: "week",
    timeRanges: [
      { title: "7 ngày qua", value: "week" },
      { title: "30 ngày qua", value: "month" },
      { title: "90 ngày qua", value: "quarter" },
      { title: "365 ngày qua", value: "year" },
    ],
    statistics: {
      totalRevenue: 0,
      revenueGrowth: 0,
      totalOrders: 0,
      orderGrowth: 0,
      newCustomers: 0,
      customerGrowth: 0,
      completionRate: 0,
    },
    topProducts: [],
    chartData: {
      revenue: {
        labels: [],
        revenueData: [],
        costData: [],
        profitData: [],
      },
      orderStatus: {
        completed: 0,
        pending: 0,
        canceled: 0,
      },
      paymentMethod: {
        COD: 0,
        MoMo: 0,
        Zalopay: 0,
        VNPay: 0,
      },
    },
    lastUpdated: null,
  }),

  getters: {
    getTimeRange: (state) => state.timeRange,
    getStatistics: (state) => state.statistics,
    getTopProducts: (state) => state.topProducts,
    getRevenueChartData: (state) => ({
      labels: state.chartData.revenue.labels,
      datasets: [
        {
          label: "Doanh thu",
          data: state.chartData.revenue.revenueData,
          borderColor: "#4CAF50",
          tension: 0.1,
          fill: false,
        },
        {
          label: "Chi phí",
          data: state.chartData.revenue.costData,
          borderColor: "#1976D2",
          tension: 0.1,
          fill: false,
        },
        {
          label: "Lợi nhuận",
          data: state.chartData.revenue.profitData,
          borderColor: "#FF5722",
          tension: 0.1,
          fill: false,
        },
      ],
    }),
    getOrderStatusData: (state) => ({
      labels: ["Hoàn thành", "Đang xử lý", "Đã hủy"],
      datasets: [
        {
          data: [
            state.chartData.orderStatus.completed,
            state.chartData.orderStatus.pending,
            state.chartData.orderStatus.canceled,
          ],
          backgroundColor: ["#4CAF50", "#2196F3", "#F44336"],
        },
      ],
    }),
    getPaymentMethodData: (state) => ({
      labels: ["COD", "MoMo", "Zalopay", "VNPay"],
      datasets: [
        {
          data: [
            state.chartData.paymentMethod.COD,
            state.chartData.paymentMethod.MoMo,
            state.chartData.paymentMethod.Zalopay,
            state.chartData.paymentMethod.VNPay,
          ],
          backgroundColor: ["#FFC107", "#9C27B0", "#00BCD4", "#FF5722"],
        },
      ],
    }),
    getLastUpdated: (state) => state.lastUpdated,
  },

  actions: {
    setTimeRange(range) {
      this.timeRange = range;
    },

    setStatistics(data) {
      this.statistics = {
        totalRevenue: data.totalRevenue || 0,
        revenueGrowth: data.revenueGrowth || 0,
        totalOrders: data.totalOrders || 0,
        orderGrowth: data.orderGrowth || 0,
        newCustomers: data.newCustomers || 0,
        customerGrowth: data.customerGrowth || 0,
        completionRate: data.completionRate || 0,
      };
    },

    setTopProducts(products) {
      this.topProducts = products.map((product) => ({
        id: product.id,
        name: product.name,
        image_url: product.image_url,
        soldCount: product.soldCount || 0,
        revenue: product.revenue || 0,
      }));
    },

    setChartData(data) {
      if (data.revenueByTimeRange) {
        this.chartData.revenue = {
          labels: data.revenueByTimeRange.labels || [],
          revenueData: (data.revenueByTimeRange.revenueData || []).map(
            (value) => (typeof value === "string" ? parseFloat(value) : value)
          ),
          costData: (data.revenueByTimeRange.costData || []).map((value) =>
            typeof value === "string" ? parseFloat(value) : value
          ),
          profitData: (data.revenueByTimeRange.profitData || []).map((value) =>
            typeof value === "string" ? parseFloat(value) : value
          ),
        };
      }

      if (data.orderStatusByTimeRange) {
        this.chartData.orderStatus = {
          completed: data.orderStatusByTimeRange.completed || 0,
          pending: data.orderStatusByTimeRange.pending || 0,
          canceled: data.orderStatusByTimeRange.canceled || 0,
        };
      }

      if (data.paymentMethodByTimeRange) {
        this.chartData.paymentMethod = {
          COD: data.paymentMethodByTimeRange.COD || 0,
          MoMo: data.paymentMethodByTimeRange.MoMo || 0,
          Zalopay: data.paymentMethodByTimeRange.Zalopay || 0,
          VNPay: data.paymentMethodByTimeRange.VNPay || 0,
        };
      }
    },

    updateLastUpdated() {
      this.lastUpdated = new Date();
    },

    resetState() {
      this.statistics = {
        totalRevenue: 0,
        revenueGrowth: 0,
        totalOrders: 0,
        orderGrowth: 0,
        newCustomers: 0,
        customerGrowth: 0,
        completionRate: 0,
      };
      this.topProducts = [];
      this.chartData = {
        revenue: {
          labels: [],
          revenueData: [],
          costData: [],
          profitData: [],
        },
        orderStatus: {
          completed: 0,
          pending: 0,
          canceled: 0,
        },
        paymentMethod: {
          COD: 0,
          MoMo: 0,
          Zalopay: 0,
          VNPay: 0,
        },
      };
    },
  },
});
