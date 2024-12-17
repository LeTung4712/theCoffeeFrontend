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
      props: true,
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
  redirect: { name: "Profile" },
  children: [
    {
      path: ROUTES.ADMIN.LOGIN,
      name: "Login",
      component: () => import("@/pages/admin/Auth/LoginAdmin"),
    },
    {
      path: "pages",
      component: () => import("@/layouts/LayoutAdmin"),
      children: [
        {
          name: "Profile",
          path: ROUTES.ADMIN.PROFILE,
          component: () => import("@/pages/admin/Profile/ShopProfile"),
          meta: { requiresAuth: true },
        },
        {
          name: "ManageProducts",
          path: ROUTES.ADMIN.MANAGE_PRODUCTS,
          component: () => import("@/pages/admin/ManageProduct/ManageProductPage"),
          meta: { requiresAuth: true },
        },
        {
          name: "ManageToppings",
          path: ROUTES.ADMIN.MANAGE_TOPPINGS,
          component: () => import("@/pages/admin/ManageTopping/ManageToppingPage"),
          meta: { requiresAuth: true },
        },
        {
          name: "ManageVouchers",
          path: ROUTES.ADMIN.MANAGE_VOUCHERS,
          component: () => import("@/pages/admin/ManageVoucher/ManageVoucherPage"),
          meta: { requiresAuth: true },
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
        {
          name: "PaymentHistory",
          path: ROUTES.ADMIN.PAYMENT_HISTORY,
          component: () => import("@/pages/admin/PaymentHistory/PaymentHistoryPage"),
          meta: { requiresAuth: true },
        },
        {
          name: "DeliveryOrders",
          path: ROUTES.ADMIN.DELIVERY_ORDERS,
          component: () => import("@/pages/admin/DeliveryOrder/DeliveryOrderPage"),
          meta: { requiresAuth: true },
        },
      ]
    }
  ],
};
