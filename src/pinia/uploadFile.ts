import { defineStore } from "pinia";
//实时获取文件分片进度
export const uploadFileStore = defineStore("uploadFile", {
  state: () => ({
    md5Progress: 0,
    uid: 0,
    fn() {},
  }),
  actions: {
    setUploadProgress(total: number, index: number) {
      this.md5Progress = Math.ceil((index / total) * 100);
    },
    setFileUid(uid: number) {
      this.uid = uid;
    },
    removeMd5Progress() {
      this.md5Progress = 0;
      this.uid = 0;
    },
    //设置上传成功执行回调
    piniaSetFileList(fn) {
      this.fn = fn;
    },
    //上传完毕后调用我 我给你执行重新获取文件列表
    piniaGetFileList() {
      this.fn && this.fn();
    },
  },
});
