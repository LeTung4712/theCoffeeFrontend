import { createRouter, createWebHistory } from "vue-router";
import { ROUTES } from "@/constants/routes";

const routes = [
  {
    path: "/",
    redirect: ROUTES.MAIN_PAGE,
    component: () => import("@/layouts/LayoutUser"),
    children: [
      {
        name: "Mainpage",
        path: ROUTES.MAIN_PAGE,
        component: () => import("@/pages/user/MainPage/MainPage"),
      },
      {
        name: "ProductDetail",
        path: ROUTES.PRODUCT_DETAIL,
        component: () => import("@/pages/user/ProductDetail/ProductDetail"),
      },
      {
        name: "UserInfo",
        path: ROUTES.USER_PAGE,
        component: () => import("@/pages/user/UserPage/UserInfo"),
      },
      {
        name: "Menu",
        path: ROUTES.MENU,
        component: () => import("@/pages/user/MenuPage/MenuCategory"),
      },
      {
        name: "ThanhToan",
        path: ROUTES.CHECKOUT,
        component: () => import("@/pages/user/CheckOut/CheckOut"),
      },
    ],
  },
  {
    path: "/admin",
    redirect: { name: "Profile" },
    component: () => import("@/layouts/LayoutAdmin"),
    children: [
      // {
      //   name: "Login",
      //   path: ROUTES.ADMIN.LOGIN,
      //   component: () => import("@/pages/Auth/LoginAdmin"),
      // },
      {
        name: "Profile",
        path: ROUTES.ADMIN.PROFILE,
        component: () => import("@/pages/admin/Profile/ShopProfile"),
      },
      {
        name: "NewOrders",
        path: ROUTES.ADMIN.NEW_ORDERS,
        component: () => import("@/pages/admin/NewOrder/NewOrderPage"),
      },
      {
        name: "OrderDetails",
        path: ROUTES.ADMIN.ORDER_DETAIL,
        component: () => import("@/pages/admin/NewOrder/OrderDetail"),
      },
      // {
      //   name: "Icons",
      //   path: "pages/icons",
      //   component: () => import("@/views/pages_admin/Icons"),
      // },
      
      // {
      //   name: "PaymentHistory",
      //   path: "pages/payment-history",
      //   component: () => import("@/views/pages_admin/PaymentHistory"),
      // },
      // {
      //   name: "Login",
      //   path: "pages/login",
      //   component: () => import("@/views/pages_admin/Login"),
      // },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Luôn scroll lên đầu trang
    return { top: 0 }
  }
});

export default router;
