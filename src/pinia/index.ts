import { STATE } from "./type";
import { defineStore, createPinia } from "pinia";
import { persistPlugin } from "@/utils/persistPlugin";
const KEY_USER = "userInfoStore";
const store = createPinia();
//数据持久化插件
store.use(persistPlugin);

const useStore = defineStore(KEY_USER, {
  state: (): STATE => ({
    userInfo: {
      userId: "",
      nickName: "",
      avatar: "",
      admin: false,
    },
    userAvatar: `/getAvatar`,
    //用于强制属性头像组件
    userAvatarForce: 0,
  }),
  actions: {
    // 定义操作
    setUserInfo(data: any) {
      this.userInfo = data;
    },
    setUserAvatarForce(){
      this.userAvatarForce +=1
    }
   
  },
  getters: {
    // 定义获取器
    getUserInfo: (state) => state.userInfo,
     //获取最新的用户头像
     getUserAvatarData: (state) => `${state.userAvatar}${state.userInfo?.userId}`,
     //获取最新的用户头像
    }
});
export { store, useStore, KEY_USER };
