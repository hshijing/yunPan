<template>
  <div class="top">
    <el-button
      type="success"
      :disabled="selectFileList.length === 0"
      @click="batchRestore"
      >批量还原</el-button
    >
    <el-button
      type="danger"
      :disabled="selectFileList.length === 0"
      @click="batchDelete"
      >批量删除</el-button
    >
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
      :fn="getLoadRecycleList"
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
            <MyIconVue v-if="row.folderType === 1" :icon-type="0" />
            <MyIconVue v-else :icon-type="row.fileType" />
          </template>
          <!--  文件名 -->
          <span class="fileName" :title="row.fileName">
            {{ row.fileName }}
          </span>

          <!-- hover文件时展示操作按钮 -->
          <span class="op">
            <template v-if="row.showOp">
              <span class="iconfont icon-share1" @click="restore(row)"
                >还原</span
              >
              <span class="iconfont icon-cancel" @click="Delete(row)"
                >删除</span
              >
            </template>
          </span>
        </div>
      </template>
      <template #deleteTime="{ row }: { row: getShareItem }">
        {{ row.lastUpdateTime }}
      </template>
      <template #fileSize="{ row }: { row: getShareItem }">
        <span v-if="row.folderType === 1">目录</span>
        <span v-else>{{ _convertSize(row.fileSize) }}</span>
      </template>
    </MyTableVue>
  </div>
</template>

<script setup lang="ts">
import { tableOptions, columns } from "./index";
import MyTableVue from "@/components/MyTable.vue";
import MyIconVue from "@/components/MyIcon.vue";
import { ElMessage } from "element-plus";
import { Message } from "@/utils/message";
import {
  type getShareItem,
  reqLoadRecycleList,
  reqDelFile,
  reqRecoverFile,
} from "@/api/recycle/index";
import { ref } from "vue";
const emit = defineEmits(["addFileEmit", "getUserSpace"]);

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
  rows.forEach((i) => selectFileList.value.push(i.fileId));
};

//批量删除
const batchDelete = () => {
  if (selectFileList.value.length === 0) {
    ElMessage.warning("请选择要删除的文件");
    return;
  }
  Message({
    message: `确定要彻底删除【${selectFileList.value.length}】个文件吗?`,
    btnText: "删除",
    fn() {
      deleteFile(selectFileList.value.join(","));
    },
  });
};
//删除
const Delete = (row: getShareItem) => {
  Message({
    message: `确定要彻底删除【${row.fileName}】吗?`,
    btnText: "删除",
    fn() {
      deleteFile(row.fileId);
    },
  });
};
//删除的请求方法
const deleteFile = async (fileIds: string | string[]) => {
  try {
    await reqDelFile(fileIds);
    ElMessage.success("删除成功");
    getLoadRecycleList();
    emit("getUserSpace");
  } catch (error) {
    ElMessage.error("网络错误");
    return Promise.reject(error);
  }
};
//批量还原
const batchRestore = () => {
  if (selectFileList.value.length === 0) {
    ElMessage.warning("请选择要还原的文件");
    return;
  }
  Message({
    message: `确定要还原【${selectFileList.value.length}】个文件吗?`,
    btnText: "还原",
    fn() {
      recoverFile(selectFileList.value.join(","));
    },
  });
};
//还原
const restore = (row: getShareItem) => {
  Message({
    message: `确定要还原【${row.fileName}】吗?`,
    btnText: "还原",
    fn() {
      recoverFile(row.fileId);
    },
  });
};
//还原的请求方法
const recoverFile = async (fileIds: string) => {
  try {
    await reqRecoverFile(fileIds);
    ElMessage.success("还原成功");
    getLoadRecycleList();
    emit("getUserSpace");
  } catch (error) {
    ElMessage.error("网络错误");
    return Promise.reject(error);
  }
};

//获取文件列表
const getLoadRecycleList = async () => {
  try {
    const res = await reqLoadRecycleList(tableData.value);
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
</script>

<style scoped lang="scss">
@import "@/css/file.list.scss";
.fileList {
  margin-top: 10px;
  .fileItem {
    .op {
      width: 120px;
    }
  }
}
</style>
