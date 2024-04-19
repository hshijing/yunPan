import { ElMessageBox } from "element-plus";

interface Options {
  message: string; // 提示信息
  btnText: string; // 确认按钮文字
  fn?: () => void; // 确定时执行回调
}
/**
 * 消息确认框
 * @param {Options}  options
 */
export async function Message(options: Options) {
  const { message, btnText, fn } = options;
  ElMessageBox.confirm(message, "提示", {
    confirmButtonText: btnText,
    type: "info",
  })
    .then(() => {
      fn && fn();
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}
