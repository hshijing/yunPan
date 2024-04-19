export default [
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/login/login.vue"),
  },

  {
    path: "/",
    name: "home",
    component: () => import("@/pages/home/home.vue"),
    children: [
      {
        path: "/",
        redirect: "/main/all",
      },
      {
        path: "/main/:category",
        name: "首页",
        meta: {
          needLogin: true,
          menuCode: "main",
        },
        component: () => import("@/pages/main/main.vue"),
      },
      {
        path: "/share",
        name: "share",
        meta: {
          needLogin: true,
          menuCode: "share",
        },
        component: () => import("@/pages/share/share.vue"),
      },
      {
        path: "/recycle",
        name: "回收站",
        meta: {
          needLogin: true,
          menuCode: "recycle",
        },
        component: () => import("@/pages/recycle/recycle.vue"),
      },
    ],
  },
  {
    path: "/checkShare/:shareId",
    name: "分享校验",
    component: () => import("@/pages/share/webShare/checkShare.vue"),
  },
  {
    path: "/webShareDetail/:shareId",
    name: "分享",
    component: () => import("@/pages/share/webShare/webShare.vue"),
  },
];
