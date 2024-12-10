import { ROUTES } from "@/constants/routes";

export const notFoundRoute = {
  path: "/:pathMatch(.*)*",
  name: "NotFound",
  component: () => import("@/pages/404/NotFound.vue"),
};

export const userRoutes = {
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
};

export const adminRoutes = {
  path: "/admin",
  redirect: { name: "Login" }, // Đổi redirect về trang login
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
      meta: { requiresAuth: true }, // Thêm meta để đánh dấu route cần auth
    },
    {
      name: "NewOrders",
      path: ROUTES.ADMIN.NEW_ORDERS,
      component: () => import("@/pages/admin/NewOrder/NewOrderPage"),
      meta: { requiresAuth: true },
    },
    {
      name: "OrderDetails",
      path: ROUTES.ADMIN.ORDER_DETAIL,
      component: () => import("@/pages/admin/NewOrder/OrderDetail"),
      meta: { requiresAuth: true },
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
  ],
};
