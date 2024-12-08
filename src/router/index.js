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
      {
        name: "UserInfo",
        path: ROUTES.USER_PAGE,
        component: () => import("@/pages/user/UserPage/UserInfo"),
      },
      {
        name: "Menu",
        path: ROUTES.MENU,
        component: () => import("@/pages/user/MenuPage/Menu"),
      },
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
