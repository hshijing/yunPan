export interface MenuItem {
  icon: string;
  name: string;
  menuCode: string;
  path: string;
  allShow?: boolean;
  tips?: string;
  children?: MenuSubItem[];
}
export interface MenuSubItem {
  icon?: string;
  name: string;
  path: string;
  category?: string;
}
export type MenuType = MenuItem[];
export const menus: MenuType = [
  {
    icon: "cloude",
    name: "首页",
    menuCode: "main",
    path: "/main/all",
    allShow: true,
    children: [
      {
        icon: "all",
        name: "全部",
        category: "all",
        path: "/main/all",
      },
      {
        icon: "video",
        name: "视频",
        category: "video",
        path: "/main/video",
      },
      {
        icon: "music",
        name: "音乐",
        category: "music",
        path: "/main/music",
      },
      {
        icon: "image",
        name: "图片",
        category: "image",
        path: "/main/image",
      },
      {
        icon: "doc",
        name: "文档",
        category: "doc",
        path: "/main/doc",
      },
      {
        icon: "more",
        name: "其他",
        category: "more",
        path: "/main/more",
      },
    ],
  },
  {
    icon: "share",
    name: "分享",
    menuCode: "share",
    path: "/share",
    allShow: true,
    children: [
      {
        name: "分享记录",
        path: "/share",
      },
    ],
  },
  {
    icon: "del",
    name: "回收站",
    menuCode: "recycle",
    path: "/recycle",
    allShow: true,
    tips: "回收站保留10天内删除记录",
    children: [
      {
        name: "删除的文件",
        path: "/recycle",
      },
    ],
  },
];
