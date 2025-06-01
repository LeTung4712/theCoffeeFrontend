import { createRouter, createWebHistory } from "vue-router";
import { userRoutes, adminRoutes, notFoundRoute } from "./routes";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [userRoutes, adminRoutes, notFoundRoute],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

// Thêm navigation guard
router.beforeEach((to, from, next) => {
  const isAdminLoggedIn = localStorage.getItem("AdminLoggedIn") === "true";

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAdminLoggedIn) {
      next({ name: "Login" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
