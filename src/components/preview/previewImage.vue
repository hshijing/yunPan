<!-- 图片预览组件 -->
<template>
  <div class="imagePreview">
    <el-image-viewer
      v-if="previewImgIndex >= 0"
      :initial-index="previewImgIndex"
      hide-on-click-modal
      @close="closeImage"
      :url-list="srcList"
      :z-index="9999"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
defineProps({
  srcList: {
    type: Array,
    default: () => [],
  },
});
const previewImgIndex = ref(-1);
const closeImage = () => {
  previewImgIndex.value = -1;
};

const showPreview = (index: number) => {
  previewImgIndex.value = index;
};
defineExpose({
  showPreview,
  closeImage,
});
</script>

<style scoped lang="scss">
.imagePreview {
  .el-image-viewer__mask {
    opacity: 0.5;
  }
}
</style>
