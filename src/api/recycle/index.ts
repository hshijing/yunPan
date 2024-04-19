enum API {
  loadRecycleList = "/recycle/loadRecycleList", //获取回收站文件
  recoverFile = "/recycle/recoverFile", //恢复删除文件
  delFile = "/recycle/delFile", //彻底删除
}
import request from "@/utils/request";

//获取回收站文件
export const reqLoadRecycleList = ({
  pageNo,
  pageSize,
}: {
  pageNo: number;
  pageSize: number;
}): Promise<getShareListRes> =>
  request({
    url: API.loadRecycleList,
    params: { pageNo, pageSize },
  });

//恢复删除文件
export const reqDelFile = (fileIds: string[] | string): Promise<resNoDate> =>
  request({
    url: API.delFile,
    params: { fileIds },
  });

//恢复删除文件
export const reqRecoverFile = (
  fileIds: string[] | string
): Promise<resNoDate> =>
  request({
    url: API.recoverFile,
    params: { fileIds },
  });

interface res {
  code: number;
  info: string;
  status: number;
}

interface resNoDate extends res {
  data: null;
}

interface getShareListRes extends res {
  data: getShareList;
}

export interface getShareList {
  totalCount: number;
  pageSize: number;
  pageNo: number;
  pageTotal: number;
  list: getShareItem[];
}

export interface getShareItem {
  fileId: string;
  filePid: string;
  fileSize: number;
  fileName: string;
  fileCover: string;
  lastUpdateTime: string;
  folderType: number;
  fileCategory: number;
  fileType: number;
  status: number;
  showOp?:boolean
}
