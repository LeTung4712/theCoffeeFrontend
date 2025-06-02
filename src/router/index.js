import { createRouter, createWebHistory } from "vue-router";
import { userRoutes, adminRoutes, notFoundRoute } from "./routes";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [userRoutes, adminRoutes, notFoundRoute],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

// Thêm navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAdminLoggedIn = localStorage.getItem("AdminLoggedIn") === "true";

  // Xử lý route admin
  if (to.matched.some((record) => record.path.startsWith("/admin"))) {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!isAdminLoggedIn) {
        next({ name: "Login" });
        return;
      }
    }
  }

  // Xử lý route user
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Nếu route yêu cầu đăng nhập nhưng user chưa đăng nhập
    if (!authStore.isLoggedIn) {
      next({
        path: "/mainpage",
      });
      return;
    }
  }
  next();
});

export default router;
