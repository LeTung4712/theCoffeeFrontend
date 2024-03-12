import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authenticated: false, // trạng thái đăng nhập, nếu là true thì đã đăng nhập và ngược lại nếu là false thì chưa đăng nhập
    Sidebar_drawer: null, // nếu là true thì sidebar sẽ hiện ra và ngược lại nếu là false thì sidebar sẽ ẩn đi
    Customizer_drawer: false, // nếu là true thì customizer sẽ hiện ra và ngược lại nếu là false thì customizer sẽ ẩn đi , customizer là cái màu của sidebar
    SidebarColor: "white", // màu của sidebar
    SidebarBg: "", // background của sidebar
    product_detail: [], // chi tiết sản phẩm
  },
  mutations: {
    SET_SIDEBAR_DRAWER(state, payload) {
      // đây là hàm để hiện sidebar
      state.Sidebar_drawer = payload;
    },
    SET_CUSTOMIZER_DRAWER(state, payload) {
      // đây là hàm để hiện customizer
      state.Customizer_drawer = payload;
    },
    SET_SIDEBAR_COLOR(state, payload) {
      // đây là hàm để thay đổi màu của sidebar
      state.SidebarColor = payload;
    },
    SET_PRODUCT_DETAIL(state, value) {
      // đây là hàm để lưu chi tiết sản phẩm
      return (state.product_detail = value);
    },
    SET_AUTH(state, auth) {
      // đây là hàm để lưu trạng thái đăng nhập
      return (state.authenticated = auth);
    },
  },
  actions: {
    product_Detail({ commit }, value) {
      commit("SET_PRODUCT_DETAIL", value);
    },
    setAuth({ commit }, auth) {
      commit("SET_AUTH", auth);
    },
  },
  modules: {},
});
