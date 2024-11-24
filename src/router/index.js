import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "mainpage",
    component: () => import("@/layouts/Layout"),
    children: [
      // Components
      {
        name: "Mainpage",
        path: "mainpage",
        component: () => import("@/views/pages_user/Mainpage"),
      },
      {
        name: "productInfo",
        path: "products/:product_name_convert",
        component: () => import("@/views/pages_user/productInStore"),
      },
      {
        name: "userAcount",
        path: "userAcount",
        component: () => import("@/components/userComponents/accountUser"),
      },
      {
        name: "user",
        path: "user/:name",
        component: () => import("@/views/pages_user/UserPage"),
      },
      {
        name: "menuMenu",
        path: "collections/:category_name",
        component: () => import("@/components/productComponents/menuMenu"),
      },
      {
        name: "ThanhToan",
        path: "thanh-toan",
        component: () => import("@/views/pages_user/ThanhToan"),
      },
    ],
  },
  {
    path: '/admin',
    redirect: 'admin/pages/profile',
    component: () => import('@/layouts/LayoutAdmin'),
    children: [
        // Components
        {
            name: 'OrderDetails',
            path: 'order-detail/:order_detail_id',
            component: () => import('@/views/pages_admin/OrderDetails'),
        },

        {
            name: 'Profile',
            path: 'pages/profile',
            component: () => import('@/views/pages_admin/Profile'),
        },

        {
            name: 'Icons',
            path: 'pages/icons',
            component: () => import('@/views/pages_admin/Icons'),
        },

        {
            name: 'NewOrders',
            path: 'pages/new-orders',
            component: () => import('@/views/pages_admin/NewOrders'),
        },
        {
            name: 'PaymentHistory',
            path: 'pages/payment-history',
            component: () => import('@/views/pages_admin/PaymentHistory'),
        },
        {
            name: 'Login',
            path: '/pages/login',
            component: () => import('@/views/pages_admin/Login'),
        }
    ]

},
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
