import { ref } from "vue";

/**
 * 取出表单的实例
 * @param T 表单的类型
 * @returns {ref}
 */
export function useMyRef<T extends abstract new (...args: any) => any>(
  _:T
) {
  return ref<InstanceType<T>>();
}
