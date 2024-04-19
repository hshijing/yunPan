import { PiniaPluginContext } from "pinia";
import { KEY_USER } from "@/pinia/index";
export function persistPlugin(Context: PiniaPluginContext) {
  // 持久化插件
  const { store } = Context;
  if (store.$id !== KEY_USER) {
    return;
  }
  //存数据
  window.addEventListener("beforeunload", () => {
    localStorage.setItem(KEY_USER, JSON.stringify(store.$state));
  });
  store.$subscribe((mutation, state) => {
    localStorage.setItem(KEY_USER, JSON.stringify(state));
  });
  //取数据
  try {
    const state = JSON.parse(localStorage.getItem(KEY_USER)!);
    if (state) {
      store.$patch(state);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
