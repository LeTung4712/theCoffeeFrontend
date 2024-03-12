import Vue from "vue";
import VueRouter from "vue-router";


Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: 'mainpage',
    component: () => import('@/layouts/Layout'),
    children: [
        // Components
        {
            name: 'Mainpage',
            path: 'mainpage',
            component: () => import('@/views/pages_user/Mainpage'),
        },
        {
          name: 'productInfo',
          path: 'products/:product_name_convert',
          component: () => import('@/views/pages_user/productInStore'),
        },
      ],
  },
  
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
