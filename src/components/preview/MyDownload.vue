<!-- 下载组件 -->
<template>
  <div class="others">
    <div class="content">
      <MyIconVue
        :icon-name="fileInfo.fileType === 9 ? 'zip' : 'others'"
        :width="80"
      />
      <div class="name">{{ fileInfo.fileName }}</div>
      <div class="tips">该类型文件暂不支持预览,请下载后查看</div>
      <div class="btn">
        <el-button type="primary" @click="downloadClick">下载文件</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import request from "../../utils/request";
import { fileItem } from "../../api/file/type";
import MyIconVue from "../MyIcon.vue";
const _props = defineProps<{
  downloadUrl: string;
  createDownloadUrl: string;
  fileInfo: fileItem;
}>();

const downloadClick = async () => {
  try {
    const res: any = await request({
      url: _props.createDownloadUrl,
    });
    //下载文件 狗比浏览器策略？不让我下
    // window.location.href = `${_props.downloadUrl}/${res.data}`;
    // const a = document.createElement("a");
    // a.href = `${_props.downloadUrl}/${res.data}`;
    // a.click();
    // a.remove();
    const response = await fetch(`${_props.downloadUrl}/${res.data}`);
    //返回的路径以二进制接收
    const blob = await response.blob();
    //创建临时url
    const url = window.URL.createObjectURL(blob);
    //模拟点击a标签下载
    const a = document.createElement("a");
    a.href = url;
    a.download = _props.fileInfo.fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    return Promise.reject(error);
  }
};
</script>

<style scoped lang="scss">
.others {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  .content {
    text-align: center;
    .name {
      font-weight: bold;
    }
    .tips {
      color: #999;
      margin-top: 5px;
      font-size: 13px;
    }
    .btn {
      margin-top: 20px;
    }
  }
}
</style>
