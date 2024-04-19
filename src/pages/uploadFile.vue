<!-- 上传文件弹窗的组件 -->
<template>
  <div class="uploadFile">
    <!-- title -->
    <div class="title">
      <span>上传任务</span>
      <span class="tips">(仅展示本次上传任务)</span>
    </div>
    <!-- 无数据 -->
    <div v-if="fileList.length === 0" class="empty">
      <span>暂无上传任务</span>
    </div>
    <!-- 文件列表 -->
    <div class="fileList">
      <div v-for="(item, index) in fileList" :key="item.uid" class="fileItem">
        <!-- 文件信息展示 -->
        <div class="uploadPanel">
          <span class="name">{{ item.fileName }}</span>
          <!-- 上传进度 -->
          <div class="progress">
            <el-progress
              v-if="
                item.status === uploadStatus.uploading.value ||
                item.status === uploadStatus.upload_seconds.value ||
                item.status === uploadStatus.upload_finish.value
              "
              :percentage="item.uploadProgress"
            ></el-progress>
          </div>
          <!-- 状态 -->
          <div class="uploadStatus">
            <!-- 图标 -->
            <span
              :class="['iconfont', `icon-${uploadStatus[item.status].icon}`]"
              :style="{ color: uploadStatus[item.status].color }"
            ></span>
            <!-- 状态描述 -->
            <span
              class="status"
              :style="{ color: uploadStatus[item.status].color }"
            >
              {{
                item.status === "fail"
                  ? item.errorMsg
                  : uploadStatus[item.status].desc
              }}
            </span>
            <!-- 上传中 -->
            <span
              class="info"
              v-if="item.status === uploadStatus.uploading.value"
            >
              {{ _convertSize(item.uploadSize) }}/{{
                _convertSize(item.totalSize)
              }}
            </span>
          </div>
        </div>
        <!-- 操作 -->
        <div class="op">
          <!-- md5进度 -->
          <el-progress
            v-if="item.status === uploadStatus.init.value"
            :width="50"
            type="circle"
            :percentage="item.md5Progress"
          >
          </el-progress>
          <!-- 按钮 -->
          <div class="Btn">
            <span v-if="item.status === uploadStatus.uploading.value">
              <!-- 上传 -->
              <MyIconVue
                :width="30"
                icon-name="upload"
                class="btnItem"
                v-if="item.pause"
                title="上传"
                @click="stateUpload(item.uid)"
              />
              <!-- 暂停 -->
              <MyIconVue
                v-else
                :width="30"
                icon-name="upload"
                class="btnItem"
                title="上传"
                @click="pauseUpload(item.uid)"
              />
            </span>
            <MyIconVue
              v-if="
                item.status !== uploadStatus.init.value &&
                item.status !== uploadStatus.upload_finish.value &&
                item.status !== uploadStatus.upload_seconds.value
              "
              :width="30"
              icon-name="del"
              class="btnItem del"
              title="删除"
              @click="delUpload(item.uid, index)"
            />
            <MyIconVue
              v-if="
                item.status !== uploadStatus.upload_finish.value ||
                item.status !== uploadStatus.upload_seconds.value
              "
              :width="30"
              icon-name="clean"
              class="btnItem clean"
              title="清除"
              @click="delUpload(item.uid, index)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
interface FileItem {
  file: File; //文件对象
  uid: number; //文件唯一标识
  fileId: number | undefined;
  md5Progress: number; //MD5上传进度条
  md5: string | null; //md5值
  filePid: number | string; //文件父级ID
  fileName: string; //文件名
  status: string; //上传状态
  uploadSize: number; //上传大小
  totalSize: number; //文件总大小
  uploadProgress: number; //上传进度条
  pause: boolean; //暂停
  chunkIndex: number; //分片索引
  chunkSize: number; //分片大小
  errorMsg: string; //错误信息
}
interface UploadStatusItem {
  value: string;
  desc: string;
  color: string;
  icon: string;
}
interface FILE extends File {
  uid: number;
}
type UploadStatus = {
  [key: string]: UploadStatusItem;
};
interface Md5Item {
  blob: Blob;
  end: number;
  start: number;
  hash: string;
  index: number;
}
import { ref, watch } from "vue";
import { _convertSize } from "@/utils/fileSize2str";
import MyIconVue from "@/components/MyIcon.vue";
import { chunk } from "@/utils/chunk/index";
import { uploadFileStore } from "@/pinia/uploadFile";
import { reqUploadFile } from "@/api/file/file";
const store = uploadFileStore();
const emit = defineEmits<{ uploadFile: [] }>();
//文件列表
const fileList = ref<FileItem[]>([]);
//文件切片删除列表
const delChunkList = ref<any>([]);
//文件上传状态
const uploadStatus: UploadStatus = {
  emptyfile: {
    value: "emptyfile",
    desc: "文件为空",
    color: "#f75000",
    icon: "close",
  },
  fail: {
    value: "fail",
    desc: "上传失败",
    color: "#f75000",
    icon: "close",
  },
  init: {
    value: "init",
    desc: "解析中",
    color: "#e6a23c",
    icon: "clock",
  },
  uploading: {
    value: "uploading",
    desc: "上传中",
    color: "#409eff",
    icon: "upload",
  },
  upload_finish: {
    value: "upload_finish",
    desc: "上传完成",
    color: "#67c23a",
    icon: "ok",
  },
  upload_seconds: {
    value: "upload_seconds",
    desc: "秒传",
    color: "#67c23a",
    icon: "ok",
  },
};
//添加文件
const childAddFile = async (file: FILE, filePid: number) => {
  const fileItem: FileItem = {
    file,
    uid: file.uid,
    md5Progress: 0,
    md5: null,
    fileId: undefined,
    filePid,
    fileName: file.name,
    status: uploadStatus.init.value,
    uploadSize: 0,
    totalSize: file.size,
    uploadProgress: 0,
    pause: false,
    chunkIndex: 0,
    errorMsg: "",
    chunkSize: 0,
  };
  fileList.value.unshift(fileItem);
  //开始计算md5(文件切片打标记)
  if (fileItem.totalSize === 0) {
    fileItem.status = uploadStatus.emptyfile.value;
    return;
  }
  //获得的是整个文件分片后的数组
  const md5 = await computMd5(fileItem);
  if (md5 !== null) {
    uploadFile(md5 as any, fileItem.uid);
  }
};
//开始上传
const stateUpload = (uid: number) => {
  const file = getFileUid(uid);
  if (file) {
    file.pause = false;
  }
};
//暂停上传
const pauseUpload = (uid: number) => {
  const file = getFileUid(uid);
  if (file) {
    file.pause = true;
  }
};
//删除上传
const delUpload = (uid: number, index: number) => {
  fileList.value.splice(index, 1);
};
//获取当前上传文件
const getFileUid = (uid: number) => {
  return fileList.value.find((item) => item.uid === uid);
};
//上传文件 请求接口
const uploadFile = async (md5: Md5Item[], uid: number, chunkIndex?: number) => {
  /* 整理服务器所需参数 */
  //当前分片的下标
  chunkIndex = chunkIndex ? chunkIndex : 0;
  let currFile = getFileUid(uid);
  //分片大小
  currFile?.chunkSize == md5[0].blob.size;
  //当前分片的数量
  const chunkNum = md5.length;
  for (let i = chunkIndex; i < chunkNum; i++) {
    let delIndex = delChunkList.value.indexOf(uid);
    //删除的分片
    if (delIndex !== -1) {
      delChunkList.value.splice(delIndex, 1);
      break;
    }
    //不断获取文件 后端如果返回什么错误信息 则终止上传
    currFile = getFileUid(uid);
    if (!currFile) break;
    //暂停
    if (currFile?.pause) {
      break;
    }
    let blob = currFile?.file?.slice(md5[i].start, md5[i].end);
    try {
      //上传分片
      const res = await reqUploadFile(
        {
          file: blob,
          fileName: currFile?.file.name,
          fileMd5: md5[i].hash,
          filePid: currFile?.filePid,
          fileId: currFile?.fileId,
          chunks: chunkNum,
          chunkIndex: i,
        },
        uploadError,
        uploadProgress,
        uid
      );
      //上传成功更新状态
      currFile.fileId = res.data.fileId;
      currFile.status = uploadStatus[res.data.status].value;
      currFile.chunkIndex = i;
      //更新文件进度
      currFile.uploadProgress = Math.floor(
        ((currFile.chunkSize * i) / currFile.totalSize) * 100
      );

      if (
        res.data.status === uploadStatus.upload_finish.value ||
        res.data.status === uploadStatus.upload_seconds.value
      ) {
        currFile!.uploadProgress = 100;
        emit("uploadFile");
        //完成上传执行重新获取文件列表
        store.piniaGetFileList();
        break;
      }
    } catch (error: any) {
      currFile!.status = uploadStatus.fail.value;
      currFile!.errorMsg = error.msg;
      break;
    }
  }
};
//上传失败触发
const uploadError = (error: any, uid: number) => {
  const currFile = getFileUid(uid);
  if (currFile) {
    currFile.status = uploadStatus.fail.value;
    currFile.errorMsg = error.info;
  }
};
//上传进度
const uploadProgress = (event: any, uid: number) => {
  const currFile = getFileUid(uid);
  if (!currFile) return;
};
//md5计算
const computMd5 = async (fileItem: FileItem) => {
  const uid = fileItem.uid;
  const file = getFileUid(uid);
  return await chunk(file?.file as any);
};

// 监听文件分片进度
watch(
  () => store,
  (newVal) => {
    if (newVal.uid) {
      const file = getFileUid(newVal.uid);
      if (file) {
        //设置MD5进度条
        file.md5Progress = newVal.md5Progress;
      }
      //编码成功变化状态
      if (file?.md5Progress === 100) {
        file.status = uploadStatus.uploading.value;
      }
    }
  },
  { deep: true, immediate: false }
);
//暴露给父组件的方法
defineExpose({ childAddFile });
</script>

<style scoped lang="scss">
.uploadFile {
  .title {
    border-bottom: 1px solid #ccc;
    line-height: 40px;
    padding: 0 10px;
    font-size: 14px;
    .tips {
      font-size: 12px;
      color: #999;
    }
  }
  .empty {
    padding: 10px 0;
    color: #999;
    font-size: 12px;
    text-align: center;
  }
  .fileList {
    overflow: auto;
    padding: 10px 0;
    min-height: calc(100vh / 2);
    max-height: calc(100vh - 120px);
    .fileItem {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 3px 10px;
      background-color: #ffffff;
      border-bottom: 1px solid #a38c8c;
    }
    .fileItem:nth-child(even) {
      background-color: #f0f0f0;
    }
    .uploadPanel {
      flex: 1;
      .name {
        color: #6e6b6b;
      }
      .uploadStatus {
        display: flex;
        align-self: center;
        margin-top: 5px;
        .iconfont {
          margin-right: 3px;
        }
        .status {
          color: red;
          font-size: 12px;
        }
        .info {
          margin-top: 5px;
          font-size: 12px;
          color: #999;
        }
      }
      .progress {
        height: 10px;
      }
    }
    .op {
      width: 100px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .Btn {
        .btnItem {
          cursor: pointer;
        }
      }
      .del,
      .clean {
        margin-left: 5px;
      }
    }
  }
}
</style>
