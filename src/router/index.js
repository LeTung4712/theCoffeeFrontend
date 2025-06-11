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

  // Xử lý route admin
  if (to.matched.some((record) => record.path.startsWith("/admin"))) {
    // Nếu route yêu cầu đăng nhập admin
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!authStore.isAdminLoggedIn) {
        // Nếu chưa đăng nhập admin, chuyển về trang login admin
        next({ path: "/admin/login" });
        return;
      }
    }
    // Nếu đã đăng nhập admin và cố truy cập trang login admin
    if (to.path === "/admin/login" && authStore.isAdminLoggedIn) {
      // Chuyển về trang dashboard admin
      next({ path: "/admin/profile" });
      return;
    }
  }

  // Xử lý route user
  if (to.matched.some((record) => !record.path.startsWith("/admin"))) {
    // Nếu route yêu cầu đăng nhập user
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!authStore.isUserLoggedIn) {
        // Nếu chưa đăng nhập user, chuyển về trang chủ
        next({ path: "/" });
        return;
      }
    }
  }

  // Cho phép truy cập các route public và các route khác khi đã đăng nhập
  next();
});

export default router;
