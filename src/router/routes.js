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
    {
      name: "Blog",
      path: ROUTES.BLOG_PAGE,
      component: () => import("@/pages/user/BlogPage/BlogPage"),
    },
    {
      name: "BlogDetail",
      path: ROUTES.BLOG_DETAIL,
      component: () => import("@/pages/user/BlogPage/BlogDetail"),
    },
    {
      name: "AboutUs",
      path: ROUTES.ABOUT_US,
      component: () => import("@/pages/user/AboutPage/AboutUsPage"),
    },
    {
      name: "StorePage",
      path: ROUTES.STORE_PAGE,
      component: () => import("@/pages/user/StorePage/StorePage"),
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
          name: "Analyze",
          path: ROUTES.ADMIN.ANALYZE,
          component: () => import("@/pages/admin/Analyze/AnalyzePage"),
          meta: { requiresAuth: true },
        },
        {
          name: "ShoppingBehavior",
          path: ROUTES.ADMIN.SHOPPING_BEHAVIOR,
          component: () => import("@/pages/admin/Analyze/ShoppingBehaviorPage"),
          meta: { requiresAuth: true },
        },
        {
          name: "ManageProducts",
          path: ROUTES.ADMIN.MANAGE_PRODUCTS,
          component: () =>
            import("@/pages/admin/ManageProduct/ManageProductPage"),
          meta: { requiresAuth: true },
        },
        {
          name: "ManageProductsCategory",
          path: ROUTES.ADMIN.MANAGE_PRODUCTS_CATEGORY,
          component: () =>
            import("@/pages/admin/ManageProduct/ManageProductPage"),
          meta: { requiresAuth: true },
        },
        {
          name: "ManageToppings",
          path: ROUTES.ADMIN.MANAGE_TOPPINGS,
          component: () =>
            import("@/pages/admin/ManageTopping/ManageToppingPage"),
          meta: { requiresAuth: true },
        },
        {
          name: "ManageVouchers",
          path: ROUTES.ADMIN.MANAGE_VOUCHERS,
          component: () =>
            import("@/pages/admin/ManageVoucher/ManageVoucherPage"),
          meta: { requiresAuth: true },
        },
        {
          name: "ManageOrders",
          path: ROUTES.ADMIN.MANAGE_ORDERS,
          component: () => import("@/pages/admin/ManageOrder/ManageOrderPage"),
          meta: { requiresAuth: true },
        },
        {
          name: "OrderDetails",
          path: ROUTES.ADMIN.ORDER_DETAIL,
          component: () => import("@/pages/admin/ManageOrder/OrderDetail"),
          meta: { requiresAuth: true },
        },
        {
          name: "PaymentHistory",
          path: ROUTES.ADMIN.PAYMENT_HISTORY,
          component: () =>
            import("@/pages/admin/PaymentHistory/PaymentHistoryPage"),
          meta: { requiresAuth: true },
        },
      ],
    },
  ],
};
