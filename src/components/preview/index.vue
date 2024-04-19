<!-- 文件预览组件 -->
<template>
  <!-- 图片预览 -->
  <div v-if="currFileInfo?.fileType === 3">
    <previewImageVue ref="previewImageRef" :src-list="[imgUrl]" />
  </div>
  <!-- 其他预览 -->
  <template v-else>
    <previewWindowVue
      ref="previewVideoRef"
      @close="previewVideoClose"
      :width="currFileInfo?.fileType === 1 ? 1500 : 900"
      :show="showPreviewWindow"
      :title="currFileInfo?.fileName"
      :align="currFileInfo?.fileType === 1 ? 'center' : 'top'"
    >
      <!-- 视频预览 -->
      <previewVideoVue v-if="currFileInfo?.fileType === 1" :url="previewUrl" />
      <!-- pdf预览 -->
      <previewViPdfVue v-if="currFileInfo?.fileType === 4" :url="previewUrl" />

      <!-- 文档预览 -->
      <previewDocVue v-if="currFileInfo?.fileType === 5" :url="previewUrl" />

      <!-- excel预览 -->
      <previewViExcelVue
        v-if="currFileInfo?.fileType === 6"
        :url="previewUrl"
      />

      <!-- txt预览 -->
      <previewViTxtVue
        v-if="currFileInfo?.fileType === 7 || currFileInfo?.fileType === 8"
        :url="previewUrl"
      />
      <!-- 音乐预览 -->
      <previewViMusicVue
        v-if="currFileInfo?.fileType === 2"
        :url="previewUrl"
        :fileName="currFileInfo.fileName"
      />
      <!-- 无法预览的就下载 -->
      <previewViDownloadVue
        :downloadUrl="downloadUrl"
        :createDownloadUrl="createDownloadUrl"
        :fileInfo="currFileInfo as fileItem"
        v-if="currFileInfo?.fileCategory === 5 && currFileInfo.fileType !== 8"
      />
    </previewWindowVue>
  </template>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from "vue";
import { FILE_API_MAP } from "./index";
import previewImageVue from "./previewImage.vue";
import previewWindowVue from "./previewWindow.vue";
import previewVideoVue from "./MyVideo.vue";
import previewDocVue from "./MyDoc.vue";
import previewViExcelVue from "./MyExcel.vue";
import previewViPdfVue from "./MyPdf.vue";
import previewViTxtVue from "./MyTxt.vue";
import previewViMusicVue from "./MyMusic.vue";
import previewViDownloadVue from "./MyDownload.vue";
import { type fileItem } from "../../api/file/type";
// 图片预览组件实例
const previewImageRef = ref();
//图片预览url
const imgUrl = computed(() => {
  return ("/api/file/getImage/" + currFileInfo.value?.fileCover).replace(
    "_.",
    "."
  );
});
//其他预览url
const previewUrl = ref();
//无法预览的下载url
const downloadUrl = ref();
const createDownloadUrl = ref('');
//当前文件信息
const currFileInfo = ref<fileItem>();
const showPreview = (data: fileItem, showPart: number) => {
  currFileInfo.value = data;
  // 图片预览
  if (currFileInfo.value.fileType === 3) {
    nextTick(() => {
      previewImageRef.value.showPreview(0);
    });
  } else {
    // 其他预览
    let url = `${FILE_API_MAP.get(showPart).fileUrl}/${
      currFileInfo.value.fileId
    }`;
    //无法预览url 触发下载
    let createUrl = `${FILE_API_MAP.get(showPart).createDownloadUrl}/${
      currFileInfo.value.fileId
    }`;
    let downUrl = `${FILE_API_MAP.get(showPart).downloadUrl}`;
    //视频url特殊处理
    if (currFileInfo.value.fileType === 1) {
      url = `${FILE_API_MAP.get(showPart).videoUrl}/${
        currFileInfo.value.fileId
      }`;
    }
    showPreviewWindow.value = true;
    previewUrl.value = url;
    downloadUrl.value = downUrl;
    createDownloadUrl.value = createUrl;
  }
};
//是否显示其他预览
const showPreviewWindow = ref(false);
//其他预览组件实例
const previewVideoRef = ref();

//视频关闭按钮
const previewVideoClose = () => (showPreviewWindow.value = false);

defineExpose({
  showPreview,
});
</script>

<style scoped lang="scss"></style>
