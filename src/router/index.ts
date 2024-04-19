//路由
import { createRouter, createWebHistory } from "vue-router";
import routes from "./router";
import { useStore } from "@/pinia/index";
const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  // 路由拦截
  const store = useStore();
  const userId = store.$state.userInfo?.userId;

  //判断用户是否登录
  if (to.path === "/login" || userId !== "") {
    // 如果用户已经登录，则允许访问其他页面
    next();
  } else {
    // 如果没有登录，则跳转到登录页面
    next("/login");
  }
});
export default router;
