<template>
  <div class="top">
    <el-button
      type="primary"
      :disabled="selectFileList.length === 0"
      @click="cancelClick"
      :style="{'width':'100px'}"
    >
      <span :class="['iconfont',selectFileList.length===0?'icon-cancel':'']"></span>
      取消分享
    </el-button>
  </div>

  <div class="fileList">
    <!-- 文件列表 -->
    <MyTableVue
      ref="tableRef"
      :columns="columns"
      :table-data="tableData"
      :table-options="tableOptions"
      @row-select="rowSelect"
      :initFn="true"
      :fn="getShareFileList"
    >
      <!-- 插槽回显数据 -->
      <template #fileName="{ row }: { row: getShareItem }">
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
            <MyIconVue v-if="row.folderType===1" :icon-type="0"/>
            <MyIconVue v-else :icon-type="row.fileType" />
          </template>
          <!--  文件名 -->
          <span class="fileName" :title="row.fileName">
            {{ row.fileName }}
          </span>

          <!-- hover文件时展示操作按钮 -->
          <span class="op">
            <template v-if="row.showOp">
              <span class="iconfont icon-share1" @click="copy(row)"
                >复制链接</span
              >
              <span class="iconfont icon-cancel" @click="cancelItem(row)"
                >取消分享</span
              >
            </template>
          </span>
        </div>
      </template>
      <!-- 过期时间 -->
      <template #expireTime="{ row }: { row: getShareItem }">
        {{ !row.expireTime ? "永久有效" : row.expireTime }}
      </template>

      <!-- 浏览次数 -->
      <template #="{ row }: { row: getShareItem }">
        {{ row.showCount }}
      </template>
    </MyTableVue>
  </div>
</template>

<script setup lang="ts">
import MyTableVue from "@/components/MyTable.vue";
import MyIconVue from "@/components/MyIcon.vue";
import { ElMessage } from "element-plus";
import { ref } from "vue";
import { tableOptions, columns } from "./index";
import {
  reqGetShareFile,
  reqCancelShare,
  type getShareItem,
} from "@/api/share/index";
import clipboard from "vue-clipboard3";
import { Message } from "@/utils/message";
const { toClipboard } = clipboard();
const _ = defineEmits(["addFileEmit", "getUserSpace"]);

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

//表格checkbox选中事件
const rowSelect = (rows) => {
  //每次点击清空选中文件
  selectFileList.value = [];
  //添加选中文件
  rows.forEach((i) => selectFileList.value.push(i.shareId));
};

//复制分享链接
const copy = async (row: getShareItem) => {
  try {
    console.log(tableData.value.list);
    await toClipboard(
      `链接:${window.location.origin}/share/${row.shareId};提取码:${row.code}`
    );
    ElMessage.success("复制成功");
  } catch (error) {
    ElMessage.error("复制失败");
    return Promise.reject(error);
  }
};
//批量取消分享
const cancelClick = () => {
  if (selectFileList.value.length === 0) {
    ElMessage.warning("请选择要取消分享文件");
    return;
  }
  Message({
    message: `确定要取消【${selectFileList.value.length}】个文件分享吗?`,
    btnText: "取消分享",
    fn() {
      cancelShare(selectFileList.value.join(","));
    },
  });
};

//单个取消分享
const cancelItem = (row: getShareItem) => {
  Message({
    message: `确定要取消【${row.fileName}】分享吗?`,
    btnText: "取消分享",
    fn() {
      cancelShare(row.shareId);
    },
  });
};

//取消分享请求
const cancelShare = async (shareId: string | string[]) => {
  try {
    await reqCancelShare(shareId);
    ElMessage.success("取消分享成功");
    getShareFileList();
  } catch (error) {
    ElMessage.error("网络错误");
    return Promise.reject(error);
  }
};

//获取文件列表
const getShareFileList = async () => {
  try {
    const res = await reqGetShareFile(tableData.value);
    tableData.value = res.data;
  } catch (error) {
    ElMessage.error("网络错误");
    return Promise.reject(error);
  }
};

//鼠标移入文件时展示操作按钮
const showOp = (row: getShareItem) => {
  tableData.value.list.forEach((item: getShareItem) => {
    item.showOp = false;
  });
  row.showOp = true;
};

//鼠标移出文件时取消展示操作按钮
const cancelShowOp = (row: getShareItem) => (row.showOp = false);
</script>

<style scoped lang="scss">
@import "@/css/file.list.scss";
.top {
  .icon-cancel {
    color: aliceblue;
    margin-right: 5px;
  }
}

.fileList {
  margin-top: 10px;
  .fileItem {
    .fileName {
      span {
        &:hover {
          color: #515355;
        }
      }
    }
    .op {
      width: 180px;
    }
  }
}
</style>
