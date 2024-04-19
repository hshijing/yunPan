<!-- 文件移动 -->
<template>
  <DialongVue
    :show="dialogDate.show"
    :title="dialogDate.title"
    :width="dialogDate.width"
    :top="dialogDate.top"
    :show-close="true"
    :show-cancel="false"
    :buttons="dialogDate.buttons"
    @close="dialogDate.show = false"
  >
    <!-- 文件导航栏 -->
    <div class="navigation">
      <navigationVue
        ref="navigationRef"
        :watch-path="false"
        @nav-change="navChange"
      />
    </div>
    <!-- 文件列表 -->
    <div class="fileList" v-if="folderList.length > 0">
      <div
        class="fileItem"
        v-for="item in folderList"
        :key="item.fileId"
        @click="selectFolder(item)"
      >
        <MyIconVue :icon-type="0" />
        <div class="name">{{ item.fileName }}</div>
      </div>
    </div>
    <div class="tips" v-else>移动至{{currFloder.fileName}}</div>
  </DialongVue>
</template>

<script setup lang="ts">
import MyIconVue from "./MyIcon.vue";
import { reqLoadAllFolder } from "@/api/file/file";
import { type LoadAllFolder } from "@/api/file/type";
import { ref, defineAsyncComponent } from "vue";
const DialongVue = defineAsyncComponent(() => import("./Dialong.vue"));
const navigationVue = defineAsyncComponent(() => import("./MyNavigation.vue"));
//目录列表
const folderList = ref<LoadAllFolder[]>([]);
//父级id
const filePid = ref("0");
//当前目录
const currentFileIds = ref("0");
//导航栏目录
const currFloder = ref({
  fileId: "0",
  fileName: "全部文件",
});
//弹出框数据
const dialogDate = ref({
  show: false,
  title: "移动文件",
  width: "400px",
  top: 100,
  buttons: [
    {
      type: "primary",
      text: "移动到此",
      buttonLeft: "250px",
      click: (e) => {
        confirmSelectFolder();
      },
    },
  ],
});
//导航栏实例
const navigationRef = ref();
//导航栏改变
const navChange = (_, Floder: { fileId: string; fileName: string }) => {
  currFloder.value=Floder
  filePid.value = Floder.fileId;
  getFolderList();
};
//获取目录列表
const getFolderList = async () => {
  const res = await reqLoadAllFolder(filePid.value, '0');
  folderList.value = res.data;
};

//选择目录
const selectFolder = (file: LoadAllFolder) => {
  navigationRef.value.openFloder(file)
};
//确定选择目录
const emit = defineEmits<{ selectFolder: [folderId: string] }>();
const confirmSelectFolder = () => {
  emit("selectFolder", filePid.value);
};
//弹出框  父组件调用
const openDialog = (currFileId) => {
  dialogDate.value.show = true;
  currentFileIds.value = currFileId;
  getFolderList();
};
//关闭弹出框
const closeDialog = () => {
  dialogDate.value.show = false;
  filePid.value = "0";
};
defineExpose({ openDialog, closeDialog });
</script>

<style scoped lang="scss">
.navigation {
  padding-left: 10px;
  background: #f1f1f1;
}
.fileList {
  min-height: 200px;
  max-height: calc(100vh - 200px);
  .fileItem {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 10px;
    .name {
      display: inline-block;
      margin-left: 10px;
    }
    &:hover {
      background: #e1e1e1;
    }
  }
}
.tips {
  text-align: center;
  line-height: 200px;
  span {
    color: #0f6cb8;
  }
}
</style>
