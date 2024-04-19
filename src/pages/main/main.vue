<template>
  <!-- 头部 -->
  <div class="top">
    <!-- 按钮列 -->
    <div class="topOp">
      <div class="btn">
        <el-upload
          :style="{ marginRight: '10px' }"
          :show-file-list="false"
          :with-credentials="true"
          :multiple="true"
          :http-request="addFile"
          :accept="fileAccept"
        >
          <el-button type="primary">
            <span class="iconfont icon-upload" />上传
          </el-button>
        </el-upload>
        <el-button v-if="category === 'all'" type="success" @click="AddFileBtn">
          <span class="iconfont icon-folder-add" />新建文件夹
        </el-button>
        <el-button
          type="danger"
          @click="delFileBatch"
          :disabled="selectFileList.length === 0"
        >
          <span class="iconfont icon-del" />批量删除
        </el-button>
        <el-button
          type="warning"
          @click="moveFileBatch"
          :disabled="selectFileList.length === 0"
        >
          <span class="iconfont icon-move" />批量移动文件
        </el-button>
        <div class="search">
          <el-input
            placeholder="请输入文件名"
            v-model="fileNameFuzzy"
            @keyup.enter="searchFile"
          >
            <template #suffix>
              <span class="iconfont icon-search" @click="searchFile"></span>
            </template>
          </el-input>
        </div>
        <div class="iconfont icon-refresh" @click="router.go(0)"></div>
      </div>
    </div>
    <!-- 导航 -->
    <span :style="{ fontSize: '13px', color: '#666' }">
      <MyNavigationVue
        ref="navigationRef"
        :watchPath="true"
        @navChange="navChange"
      />
    </span>
  </div>
  <!-- 文件列表 -->
  <div class="fileList" v-if="tableData.list.length > 0">
    <MyTableVue
      ref="tableRef"
      :columns="columns"
      :table-data="tableData"
      :table-options="tableOptions"
      @row-click="rowClick"
      @row-select="rowSelect"
      :initFn="true"
      :fn="getFileDataList"
    >
      <!-- 插槽回显数据 -->
      <template #fileName="{ row, index }: { row: fileItem, index: number }">
        <div
          class="fileItem"
          @mouseenter="showOp(row)"
          @mouseleave="cancelShowOp(row)"
        >
          <!-- 是转码后的图片或者视频 就直接取来做icon -->
          <template
            v-if="
              row.status === 2 && (row.fileType === 3 || row.fileType === 1)
            "
          >
            <MyIconVue :cover="row.fileCover" />
          </template>
          <template v-else>
            <!-- 目录特殊处理 其他就返回对应类型取icon -->
            <MyIconVue v-if="row.folderType === 1" :icon-type="0" :width="32" />
            <MyIconVue
              v-if="row.folderType === 0"
              :icon-type="row.fileType"
              :width="32"
            />
          </template>
          <!-- 完全展示 文件名 -->
          <span class="fileName" :title="row.fileName">
            <span @click="preViewFile(row)">{{ row.fileName }}</span>
            <span v-if="row.status === 0" class="transferStatus">转码中</span>
            <span v-if="row.status === 0" class="transferFail">转码失败</span>
          </span>
          <!-- 新建文件夹 -->
          <div class="edit" v-if="row.showEdit">
            <el-input
              v-model.trim="row.fileNameReal"
              :maxlength="20"
              ref="editInputRef"
              @keyup.enter="AddFileInput(index)"
              placeholder="请输入文件夹名称"
            >
              <!-- 文件后缀名 -->
              <template #suffix>
                <span>{{ row.fileNameRealOld }}</span>
              </template>
            </el-input>
            <span
              :class="[
                'iconfont',
                'icon-right1',
                row.fileNameReal ? '' : 'notAllow',
              ]"
              @click="AddFileInput(index)"
            ></span>
            <span
              class="iconfont icon-error"
              @click="cancelFileInput(index)"
            ></span>
          </div>
          <!-- hover文件时展示操作按钮 -->
          <span class="op">
            <template v-if="row.status === 2 && row.fileId && row.showOp">
              <span class="iconfont icon-share1" @click="shareFile(row)">分享</span>
              <!-- 目录不支持下载 -->
              <span
                class="iconfont icon-download"
                v-if="row.folderType === 0"
                @click="downloadFile(row)"
              >
                下载
              </span>
              <span class="iconfont icon-del" @click="delFile(row)">删除</span>
              <span class="iconfont icon-edit" @click="reNameFile(index)">
                重命名
              </span>
              <span class="iconfont icon-move" @click="moveFile(row)">
                移动
              </span>
            </template>
          </span>
        </div>
      </template>
      <template #="{ row }: { row: fileItem }">
        {{ row.lastUpdateTime }}
      </template>
      <template #fileSize="{ row }: { row: fileItem }">
        <span v-if="row.folderType === 0">{{
          _convertSize(row.fileSize)
        }}</span>
      </template>
    </MyTableVue>
  </div>
  <!-- 无数据 -->
  <div v-else>
    <MyNoDataVue :category="category" :add-file="addFile" />
  </div>
  <!-- 移动文件组件 -->
  <MyMoveFileVue
    ref="moveFileRef"
    @select-folder="folderSelect"
  ></MyMoveFileVue>
  <!-- 文件预览组件 -->
  <MyPreViewVue ref="preViewRef"/>
  <!-- 文件分享组件 -->
  <MyShareVue ref="shareRef"/>
</template>

<script setup lang="ts">
import MyTableVue, { type TableData } from "@/components/MyTable.vue";
import MyIconVue from "@/components/MyIcon.vue";
import MyNavigationVue from "@/components/MyNavigation.vue";
import {
  reqLoadDataList,
  reqNewFoloder,
  reqReNameFile,
  reqMoveFile,
  reqDeleteFile,
} from "@/api/file/file";
import { type FileDate, fileItem } from "@/api/file/type";
import { _convertSize } from "@/utils/fileSize2str";
import { ref, nextTick, defineAsyncComponent, onMounted, computed } from "vue";
import { ElMessage } from "element-plus";
import { Message } from "@/utils/message";
import {
  columns,
  tableOptions,
  newFolderBorderValidation,
  reNameFileBorderValidation,
  fileTypeMap,
} from "./index";
import { useRouter } from "vue-router";
import request from "@/utils/request";
import { uploadFileStore } from "@/pinia/uploadFile";
const router = useRouter();
const pinia = uploadFileStore();
//文件夹的列
const emit = defineEmits<{
  addFileEmit: [file: File, filePid: number];
  getUserSpace: [];
}>();
//移动文件组件
const MyMoveFileVue = defineAsyncComponent(
  () => import("@/components/MyMoveFile.vue")
);
//导航组件
const MyNoDataVue = defineAsyncComponent(
  () => import("@/components/MyNoData.vue")
);
//文件预览组件
const MyPreViewVue = defineAsyncComponent(
  () => import("@/components/preview/index.vue")
);
//文件分享
const MyShareVue=defineAsyncComponent(()=>import('./share.vue'))
//表格组件实例
const tableRef = ref();
//文件编辑实例
const editInputRef = ref();
//移动文件组件实例
const moveFileRef = ref();
//导航栏实例
const navigationRef = ref();
//文件预览实例
const preViewRef = ref();
//文件分享实例
const shareRef = ref();
//当前是否处于编辑状态
const showEdit = ref(false);
//当前选中的文件夹
//文件类型
const category = ref("all");
//表格数据
const tableData = ref<TableData>({
  totalCount: 0,
  pageNo: 1,
  pageSize: 15,
  list: [],
});
//文件模糊搜索
const fileNameFuzzy = ref("");
//支持的文件类型
const fileAccept = computed(() => {
  const currFileAccept = fileTypeMap[category.value];
  return currFileAccept ? currFileAccept.accept : "*";
});
//当前目录
const currFolder = ref({ filePid: "0", fileName: "" });
//当前要移动的文件
const currMoveFile = ref<any>({});
//存储当前选中的文件
const selectFileList = ref<string[]>([]);

//新建文件夹按钮
const AddFileBtn = () => {
  //判断是否正在编辑
  if (showEdit.value) return;
  //先把所有文件变为不可编辑 如何新建一个对象添加到列表头部
  tableData.value.list.forEach((item: fileItem) => {
    item.showEdit = false;
  });
  showEdit.value = true;
  //新建一个对象添加到列表头部
  const newFile: any = {
    showEdit: true,
    fileType: 0,
    fileId: "",
    filePid: currFolder.value.filePid,
  };
  tableData.value.list.unshift(newFile);
  nextTick(() => {
    editInputRef.value.focus();
  });
};

//重命名文件
const reNameFile = (index: number) => {
  //新建文件夹时 直接点击重命名 应该关掉新建文件夹的input
  if (tableData.value.list[0].fileId === "") {
    tableData.value.list.splice(0, 1);
    //修正当前修改文件的索引
    index = index - 1;
  }
  tableData.value.list.forEach((item) => {
    item.showEdit = false;
  });
  const currFile: fileItem = tableData.value.list[index];
  //编辑状态
  currFile.showEdit = true;
  reNameFileBorderValidation(currFile);
  //开始编辑
  showEdit.value = true;
  //聚焦input
  nextTick(() => {
    editInputRef.value.focus();
  });
};

//批量删除
const delFileBatch = () => {
  if (selectFileList.value.length === 0) return;
  Message({
    message: "确定要删除选中的文件吗?删除的文件10内可通过回收站找回",
    btnText: "删除",
    fn() {
      const fileIds = selectFileList.value.join(",");
      getRemoveFile(fileIds, getFileDataList);
    },
  });
};

//单个删除
const delFile = async (row: fileItem) => {
  if (row.fileId === "") return;
  await Message({
    message: `确定要删除【${row.fileName}】吗?删除的文件10内可通过回收站找回`,
    btnText: "删除",
    fn() {
      getRemoveFile(row.fileId, getFileDataList);
    },
  });
};
//文件删除的请求方法
const getRemoveFile = async (fileIds: string, fn: Function) => {
  try {
    await reqDeleteFile(fileIds);
    ElMessage.success("删除成功");
    //删除成功 更新文件列表
    getFileDataList();
    //更新用户存储空间
    emit("getUserSpace");
  } catch (error: any) {
    ElMessage.error("删除失败");
    return Promise.reject(error);
  }
};
//批量移动文件
const moveFileBatch = () => {
  if (selectFileList.value.length === 0) return;
  currMoveFile.value = {};
  moveFileRef.value.openDialog(currFolder.value.filePid);
};
//单个移动文件
const moveFile = (row: fileItem) => {
  currMoveFile.value = row;
  moveFileRef.value.openDialog(currFolder.value.filePid);
};
//文件下载  
const downloadFile = async (row: fileItem) => {
  const res: any = await request({
    url: `/file/createDownloadUrl/${row.fileId}`,
  });
  const response = await fetch(`/api/file/download/${res.data}`);
  //返回的路径以二进制接收
  const blob = await response.blob();
  //创建临时url
  const url = window.URL.createObjectURL(blob);
  //模拟点击a标签下载
  const a = document.createElement("a");
  a.href = url;
  a.download = row.fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};

//文件分享按钮
const shareFile=(row:fileItem)=>{
  shareRef.value.openDialog(row.fileName,row.fileId)
}
//文件模糊搜索
const searchFile = () => getFileDataList();
//确定移动目录
const folderSelect = async (folderId: string) => {
  //确定当前是批量移动还是单个移动
  let requestList: any = [];
  if (currMoveFile.value.fileId) {
    //单个移动
    requestList.push(currMoveFile.value.fileId);
  } else {
    requestList.concat(selectFileList.value);
  }
  const fileIds = requestList.join(",");
  try {
    await reqMoveFile(fileIds, folderId);
    ElMessage.success("移动成功");
    //移动成功 更新文件列表
    getFileDataList();
  } catch (error) {
    ElMessage.error("移动失败");
    return Promise.reject(error);
  } finally {
    //关闭移动文件组件
    moveFileRef.value.closeDialog();
  }
};
//新建文件夹||重命名input完成事件
const AddFileInput = async (index: number) => {
  //获取新建文件夹的数据
  const { fileId, filePid, fileNameReal } = tableData.value.list[index];
  console.log(tableData.value);
  //边界处理
  if (!newFolderBorderValidation(fileNameReal as string, tableData.value.list))
    return;
  try {
    //区分当前时新建文件夹还是重命名
    let fn = reqNewFoloder;
    if (fileId) {
      fn = reqReNameFile;
    }
    debugger;
    const res: any = await fn({
      filePid,
      fileId,
      fileName: fileNameReal as string,
    });
    //上传成功更新文件夹的数据
    tableData.value.list[index] = res.data;
  } catch (error: any) {
    ElMessage.error(error.msg);
    return Promise.reject(error);
  } finally {
    //上传成功 取消编辑状态
    showEdit.value = false;
    getFileDataList(); //更新文件列表
  }
};

//新建文|重命名件夹 input取消事件
const cancelFileInput = (index: number) => {
  //取消新建文件夹
  const fileData = tableData.value.list[index];
  //判断是否是重命名
  if (fileData.fileId) {
    fileData.showEdit = false;
  } else {
    //新建文件夹
    tableData.value.list.splice(index, 1);
  }
  showEdit.value = false;
};

//表格checkbox选中事件
const rowSelect = (rows: fileItem[]) => {
  //每次点击清空选中文件
  selectFileList.value = [];
  //添加选中文件
  rows.forEach((i) => selectFileList.value.push(i.fileId));
};

//获取文件数据接口
const getFileDataList = async () => {
  //判断当前是否处于主页面
  try {
    //整理参数
    const params: FileDate = {
      pageNo: tableData.value.pageNo,
      pageSize: tableData.value.pageSize,
      fileNameFuzzy: fileNameFuzzy.value,
      category: category.value,
      filePid: currFolder.value.filePid,
    };
    //同一个接口请求不同文件的类型
    if (category.value !== "all") {
      delete params.filePid;
    }
    const res = await reqLoadDataList(params);
    tableData.value = res.data;
  } catch (error: any) {
    ElMessage.error(error.msg);
    return Promise.reject(error);
  }
};

//上传文件
const addFile = ({ file }) => {
  const filePid = currFolder.value.filePid;
  //与上传组件进行交互 回传给父组件
  emit("addFileEmit", file, filePid as any);
};

//点击行触发
const rowClick = (row: fileItem) => {};

//点击文件名预览||打开目录
const preViewFile = (row: fileItem) => {
  //打开目录
  if (row.folderType === 1) {
    navigationRef.value.openFloder(row);
    return;
  }
  //转码中
  if (row.status !== 2) {
    ElMessage.warning("文件转码中,请稍后");
    return;
  }
  preViewRef.value.showPreview(row, 0);
};
//打开目录显示文件
const navChange = (categoryId: string, Folder) => {
  category.value = categoryId;
  currFolder.value.filePid = Folder.fileId;
  currFolder.value.fileName = Folder.fileName;
  getFileDataList();
};
//鼠标移入文件时展示操作按钮
const showOp = (row: fileItem) => {
  tableData.value.list.forEach((item: fileItem) => {
    item.showOp = false;
  });
  row.showOp = true;
};

//鼠标移出文件时取消展示操作按钮
const cancelShowOp = (row: fileItem) => (row.showOp = false);

onMounted(() => {
  //给上传组件设置上传成功的回调
  pinia.piniaSetFileList(getFileDataList);
});
</script>

<style scoped lang="scss">
@import "../../css/file.list.scss";
</style>
