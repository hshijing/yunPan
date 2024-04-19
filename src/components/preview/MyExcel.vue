<!-- excel预览组件 -->
<template>
  <div v-html="excelData" id="excel"></div>
</template>

<script setup lang="ts">
import * as excel from "xlsx";
import { ref, onMounted } from "vue";
import request from "../../utils/request";
const _props = defineProps<{ url: string }>();
const excelData = ref();
//初始化
const initExcel = async () => {
  try {
    const res: Buffer = await request({
      url: _props.url,
      responseType: "arraybuffer",
    });
    //开启预览
    let workbook = excel.read(new Uint8Array(res), { type: "array" });
    let worksheet = workbook.Sheets[workbook.SheetNames[0]];
    console.log(worksheet);
    excelData.value = excel.utils.sheet_to_html(worksheet);
  } catch (error) {
    return Promise.reject(error);
  }
};
onMounted(() => {
  initExcel();
});
</script>

<style lang="scss">
#excel {
  width: 100%;
  padding: 10px;

  /* 为表格添加样式 */
  table {
    width: 100%;
    margin-top: 20px;
    border-collapse: collapse; /* 合并表格边框 */
  }

  /* 为表格行添加样式 */
  tr {
    background-color: #f0f0f0; /* 设置行的背景色 */
    height: 30px; /* 设置行的高度 */
  }
   td,th:nth-child(1){
    width: 100px;
   }
  /* 为表格单元格添加样式 */
  td,
  th {
    width: 30px;
    border: 1px solid #f7f5f5; /* 设置单元格边框 */
    padding: 8px; /* 设置单元格内边距 */
  }
  /* 可以根据需要添加更多的表格样式 */
}
</style>
