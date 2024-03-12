import ax from "axios";
const httpClient = ax.create({ 
  // Khởi tạo cấu hình cho axios
  baseURL: process.env.VUE_APP_API_URL,
  //timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});


export default httpClient;