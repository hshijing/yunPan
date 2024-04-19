<!-- 文档预览组件 -->
<template>
  <div ref="docRef" id="docContent"></div>
</template>

<script setup lang="ts">
import * as docx from "docx-preview";
import { ref, onMounted } from "vue";
import request from "../../utils/request";
const _props = defineProps<{ url: string }>();
const docRef = ref();
//初始化
const initDoc = async () => {
  try {
    const res = await request({
      url: _props.url,
      responseType: "blob",
    });
    //开启预览
    docx.renderAsync(res, docRef.value);
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};
onMounted(() => {
  initDoc();
});
</script>

<style scoped lang="scss">
#docContent {
  margin: 0 auto;
  :deep(.docx-wrapper) {
    padding: 10px 0;
    background: #fff;
  }
  :deep(.docx-wrapper > section.docx) {
    margin-bottom: 0;
  }
}
</style>
