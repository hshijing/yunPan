import { createApp } from "vue";
import { store } from "@/pinia/index";
import router from "@/router/index";
import App from "./App.vue";
import AvatarVue from "@/components/Avatar.vue";
//代码高亮
import highlightjsVue from "@highlightjs/vue-plugin";
import "highlight.js/styles/github.css";
import "highlight.js/lib/common";

// 引入全局样式
import "@/assets/icon/iconfont.css";
import "@/css/index.scss";
import "element-plus/dist/index.css";
const app = createApp(App);
// 全局注册组件
app.component("AvatarVue", AvatarVue);
app.use(store);
app.use(router);
app.use(highlightjsVue);
app.mount("#app");
