<template>
  <div class="share">
    <div class="header">
      <div class="content">
        <div class="logo" @click="jump">
          <span class="iconfont icon-pan"></span>
          <span class="name">XD云盘</span>
        </div>
      </div>
    </div>
    <div class="shareBody">
      <!-- 有数据 -->
      <template v-if="shareInfo.fileId !== ''">
        <div class="panel">
          <div class="userInfo">
            <div class="avatar">
              <AvatarVue :avatar="shareInfo.avatar" :width="50" :height="50" />
            </div>
            <div class="info">
              <div class="user">
                <div class="nickName">{{ shareInfo.nickName }}</div>
                <div class="shareTime">分享于：{{ shareInfo.shareTime }}</div>
              </div>
              <div class="fileName">分享文件：{{ shareInfo.fileName }}</div>
            </div>
            <div class="opBtn">
              <el-button
                type="primary"
                v-if="shareInfo.currentUser"
                :disabled="selectFileList.length === 0"
                @click="cancelShare"
                :style="{ marginLeft: '900px' }"
                >取消分享</el-button
              >
            </div>
          </div>
        </div>
        <div class="fileList">
          <!-- 文件列表 -->
          <MyTableVue
            ref="tableRef"
            :columns="columns"
            :table-data="tableData"
            :table-options="tableOptions"
            @rowSelect="rowSelect"
            :initFn="false"
          >
            <!-- 插槽回显数据 -->
            <template #fileName="{ row }: { row: LoadFileList }">
              <div
                class="fileItem"
                @mouseenter="showOp(row)"
                @mouseleave="cancelShowOp(row)"
              >
                <!-- 是转码后的图片或者视频 就直接取来做icon -->
                <template v-if="row.fileType === 3 || row.fileType === 1">
                  <MyIconVue :cover="row.fileCover" />
                </template>
                <template v-else>
                  <MyIconVue v-if="row.folderType === 1" :icon-type="0" />
                  <MyIconVue v-else :icon-type="row.fileType" />
                </template>
                <!--  文件名 -->
                <span :title="row.fileName">
                  {{ row.fileName }}
                </span>

                <!-- hover文件时展示操作按钮 -->
                <div class="op">
                  <span
                    class="iconfont icon-download"
                    @click="download(row)"
                    v-if="row.showOp"
                    >下载</span
                  >
                  <span
                    class="iconfont icon-"
                    @click="SeveFile(row)"
                  >
                    保存到我的网盘</span
                  >
                </div>
              </div>
            </template>
            <template #updataTime="{ row }: { row: LoadFileList }">
              {{ row.lastUpdateTime }}
            </template>
            <template #fileSize="{ row }: { row: LoadFileList }">
              <span v-if="row.folderType === 1">目录</span>
              <span v-else>{{ _convertSize(row.fileSize) }}</span>
            </template>
          </MyTableVue>
        </div>
      </template>
      <!-- 加载中 -->
      <template v-else>
        <div class="loading" v-loading="shareInfo.fileId == ''"></div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  reqGetShareLoginInfo,
  reqLoadFileList,
  reqCancelShare,
  reqCreateDownloadUrl,
  reqSaveShare,
  type ShareLoginInfo,
  LoadFileList,
} from "@/api/share/index";
import MyTableVue from "@/components/MyTable.vue";
import MyIconVue from "@/components/MyIcon.vue";
import { useStore } from "@/pinia/index";
import { tableOptions, columns } from "./index";
import { ElMessage } from "element-plus";
const route = useRoute();
const router = useRouter();
const store = useStore();
//分享id
const shareId = route.params.shareId as string;
//分享信息
const shareInfo = ref<ShareLoginInfo>({
  shareTime: "",
  expireTime: "",
  nickName: "",
  fileName: "",
  currentUser: false,
  fileId: "",
  userId: "",
  avatar: "",
});
const currFolderId = ref({ fileId: "0", fileName: "" });
//表格数据
const tableData = ref<any>({
  totalCount: 0,
  pageNo: 1,
  pageSize: 15,
  pageTotal: 15,
  list: [],
});
//存储当前选中的文件
const selectFileList = ref<string[]>([]);
//表格checkbox 选中事件
//区分当前是勾选还是取消勾选
const isCheckbox = ref(false);
const rowSelect = (rows) => {
  if (!isCheckbox.value) {
    //勾选 添加选中文件
    selectFileList.value.push(shareId);
    isCheckbox.value = true;
  } else {
    //每次点击清空选中文件  
    selectFileList.value = [];
    isCheckbox.value = false;
  }
};
//校验登录情况 没登陆不允许提取分享
const checkLogin = async () => {
  try {
    const res = await reqGetShareLoginInfo(shareId);
    if (res.data == null) {
      throw new Error("未找到分享信息");
    }
    shareInfo.value = res.data;
    getLoadFileList();
  } catch (error) {
    router.push(`/checkShare/${shareId}`);
    return Promise.reject(error);
  }
};
//加载文件列表
const getLoadFileList = async () => {
  try {
    const res = await reqLoadFileList(shareId, currFolderId.value.fileId);
    tableData.value = res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
//点击logo
const jump = () => router.push("/");

//取消分享
const cancelShare = async () => {
  try {
    const shareId = selectFileList.value[0];
    await reqCancelShare(shareId);
    ElMessage.success("取消分享成功");
    if (store.userInfo?.userId === shareInfo.value.userId) {
      router.push("/share");
    } else {
      router.push("/login");
    }
  } catch (error) {
    ElMessage.error("操作失败");
    return Promise.reject(error);
  }
};
//保存到我的网盘
const SeveFile = async (row: LoadFileList) => {
  try {
    const res = await reqSaveShare({
      shareId: shareId,
      shareFileIds: row.fileId,
      myFolderId: "0",
    });
    console.log(res);
  } catch (error) {}
};

//文件下载
const download = async (row: LoadFileList) => {
  try {
    const res = await reqCreateDownloadUrl(shareId, row.fileId);
    const download = await fetch(`/showShare/download/${res.data}`);
    const blob = await download.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = row.fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    ElMessage.error(error.msg);
    return Promise.reject(error);
  }
};

//鼠标移入文件时展示操作按钮
const showOp = (row) => {
  tableData.value.list.forEach((item) => {
    item.showOp = false;
  });
  row.showOp = true;
};

//鼠标移出文件时取消展示操作按钮
const cancelShowOp = (row) => (row.showOp = false);

//大小转换
const _convertSize = (size: number) => {
  interface SizeMappings {
    [key: string]: (size: number) => string;
  }
  if (size === null) {
    return;
  }
  const sizeMappings: SizeMappings = {
    B: (size) => size.toFixed(2) + "B",
    KB: (size) => (size / 1024).toFixed(2) + "KB",
    MB: (size) => (size / (1024 * 1024)).toFixed(2) + "MB",
    GB: (size) => (size / (1024 * 1024 * 1024)).toFixed(2) + "GB",
  };
  for (const key in sizeMappings) {
    if (
      size <
      0.1 * 1024 * Math.pow(1024, Object.keys(sizeMappings).indexOf(key))
    ) {
      return sizeMappings[key](size);
    }
  }
};
checkLogin();
</script>

<style scoped lang="scss">
@import "@/css/file.list.scss";
.header {
  width: 100%;
  position: fixed;
  background-color: rgb(22, 120, 177);
  height: 50px;
  .content {
    width: 70%;
    margin: 0 auto;
    color: #fff;
    line-height: 50px;
    .logo {
      display: flex;
      align-self: center;
      cursor: pointer;
      .icon-pan {
        font-size: 50px;
        color: #fff;
      }
      .name {
        margin-left: 10px;
        font-size: 20px;
        font-weight: bold;
      }
    }
  }
}
.shareBody {
  width: 70%;
  margin: 0 auto;
  padding-top: 50px;
  .loading {
    height: calc(100vh / 2);
    width: 100%;
  }
  .panel {
    margin-top: 20px;
    display: flex;
    justify-content: space-around;
    border: 1px solid #ccc;
    padding-bottom: 10px;
    .userInfo {
      flex: 1;
      display: flex;
      align-items: center;
      .avatar {
        margin-left: 5px;
      }
      .info {
        .user {
          display: flex;
          align-self: center;
          .nickName {
            margin-left: 10px;
            font-size: 14px;
          }
          .shareTime {
            margin-left: 20px;
            font-size: 12px;
          }
        }
      }
      .fileName {
        margin-left: 70px;
        font-size: 12px;
      }
    }
  }
}
.fileList {
  margin-top: 10px;
  .fileItem {
    .op {
      margin-left: auto;
      width: 120;
    }
  }
}
</style>
