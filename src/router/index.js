import { createRouter, createWebHistory } from 'vue-router'
import { ROUTES } from '@/constants/routes'

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
      // {
      //   name: "userAcount",
      //   path: ROUTES.USER_ACCOUNT,
      //   component: () => import("@/components/userComponents/accountUser"),
      // },
      // {
      //   name: "user",
      //   path: ROUTES.USER_PAGE,
      //   component: () => import("@/views/pages_user/UserPage"),
      // },
      // {
      //   name: "menuMenu",
      //   path: ROUTES.MENU,
      //   component: () => import("@/components/productComponents/menuMenu"),
      // },
      {
        name: "ThanhToan",
        path: ROUTES.CHECKOUT,
        component: () => import("@/pages/user/CheckOut/CheckOut"),
      },
    ],
  },
] 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
