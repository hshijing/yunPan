enum API {
  loadDataList = "/file/loadDataList", //获取文件列表
  uploadFile = "/file/uploadFile", //上传文件
  newFoloder = "/file/newFoloder", //新建文件夹
  renameFile = "/file/rename", //重命名文件
  deleteFile = "/file/delFile", //删除文件
  moveFileFolder = "file/changeFileFolder", //移动文件
  loadAllFolder = "/file/loadAllFolder", //获取所有文件夹(目录)
}
import request from "@/utils/request";
import {
  fileRes,
  FileDate,
  reNameFileOrAddFolder,
  noDataRes,
  LoadAllFolderRes,
} from "./type";
// 获取文件列表
export const reqLoadDataList = (params: FileDate): Promise<fileRes> =>
  request({
    url: API.loadDataList,
    params,
  });
//上传文件
export const reqUploadFile = (
  params: any,
  fn: Function,
  OK: Function,
  uid: number
): Promise<any> =>
  request({
    url: API.uploadFile,
    params,
    showLoading: false,
    dataType: "file",
    showError: false,
    errorCallback: (errMsg) => {
      fn(errMsg, uid);
    },
    onUploadProgress: (event) => {
      //回传进度监控
      OK(event, uid);
    },
  });

//新建文件夹
export const reqNewFoloder = (params: reNameFileOrAddFolder): Promise<any> =>
  request({
    url: API.newFoloder,
    params,
  });

//文件重命名
export const reqReNameFile = (params: reNameFileOrAddFolder): Promise<any> =>
  request({
    url: API.renameFile,
    params,
  });

//文件删除
export const reqDeleteFile = (fileIds: string): Promise<noDataRes> =>
  request({
    url: API.deleteFile,
    params: { fileIds },
  });

//文件移动
export const reqMoveFile = (
  fileIds: string,
  filePid: string
): Promise<noDataRes> =>
  request({
    url: API.moveFileFolder,
    params: { fileIds, filePid },
  });

//获取当前目录
export const reqLoadAllFolder = (filePid: string,currentFileIds:string): Promise<LoadAllFolderRes> =>
  request({
    url: API.loadAllFolder,
    params: { filePid,currentFileIds },
  });
