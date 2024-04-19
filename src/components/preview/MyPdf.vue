<!-- pdf预览组件 -->
<template>
  <div id="pdf">
    <vue-pdf-embed
      :source="pdf.url"
      class="vuePdfEmbed"
      :width="800"
      :page="pdf.pageNum"
    ></vue-pdf-embed>
  </div>
</template>

<script setup lang="ts">
import vuePdfEmbed from "vue-pdf-embed";
import { ref, onMounted } from "vue";
const _props = defineProps<{ url: string }>();
const pdf = ref({
  url: "",
  pageNum: 0,
  numPages: 0,
});
//初始化
const initPdf = async () => {
  pdf.value.url = `/api${_props.url}`;
};
onMounted(() => {
  initPdf();
});
</script>

<style lang="scss">
#pdf {
  width: 100%;
}
</style>
