enum API {
  shareFile = "/share/shareFile", //文件分享
  cancelShare = "/share/cancelShare", //取消分享
  getShareFile = "/share/loadShareList", //获取分享文件列表

  /* 外部分享 */
  getShareLoginInfo = "/showShare/getShareLoginInfo", //获取用户登录信息
  loadFileList = "/showShare/loadFileList", //获取分享文件列表
  download = "/showShare/download", //下载文件
  saveShare = "/showShare/saveShare", //保存分享
  createDownloadUrl = "/showShare/createDownloadUrl", //创建下载链接
}
import request from "@/utils/request";

//文件分享
export const reqShareFile = (params: ShareFile): Promise<resData> =>
  request({
    url: API.shareFile,
    params,
  });
//取消分享
export const reqCancelShare = (shareIds: string | string[]) =>
  request({
    url: API.cancelShare,
    params: { shareIds },
  });

//获取文件列表
export const reqGetShareFile = ({
  pageNo,
  pageSize,
}: {
  pageNo: number;
  pageSize: number;
}): Promise<getShareListRes> =>
  request({
    url: API.getShareFile,
    params: { pageNo, pageSize },
  });
//获取分享文件列表
export const reqLoadFileList = (
  shareId: string,
  filePid: string
): Promise<LoadFileListRes> =>
  request({
    url: API.loadFileList,
    params: { shareId, filePid },
  });

//获取用户登录信息
export const reqGetShareLoginInfo = (
  shareId: string
): Promise<GetShareLoginInfo> =>
  request({
    url: API.getShareLoginInfo,
    params: { shareId },
  });

//创建下载链接
export const reqCreateDownloadUrl = (
  shareId: string,
  fileId: string
): Promise<CreateDownloadUrlRes> =>
  request({
    url: `${API.createDownloadUrl}/${shareId}/${fileId}`,
  });

//下载 code：创建链接返回的data
export const reqDownload = (code: string): Promise<ResNoData> =>
  request({
    url: API.download,
    params: { code },
  });

//保存分享
export const reqSaveShare = (params: SaveShareParams): Promise<ResNoData> =>
  request({
    url: API.saveShare,
    params,
  });

interface SaveShareParams {
  shareId: string;
  shareFileIds: string[] | string;
  myFolderId: string;
}

interface LoadFileListRes extends res {
  data: {
    totalCount: number;
    pageSize: number;
    pageNo: number;
    pageTotal: number;
    list: LoadFileList[];
  };
}

interface ResNoData extends res {
  data: null;
}

interface CreateDownloadUrlRes extends res {
  data: string;
}
export interface LoadFileList {
  fileId: string;
  fileSize: number;
  fileName: string;
  fileCover: string;
  lastUpdateTime: string;
  folderType: number;
  fileCategory: number;
  fileType: number;
  status: number;
  showOp?: boolean;
}

export interface ShareLoginInfo {
  shareTime: string;
  expireTime: string;
  nickName: string;
  fileName: string;
  currentUser: boolean;
  fileId: string;
  userId: string;
  avatar: string;
}

interface GetShareLoginInfo extends res {
  data: ShareLoginInfo;
}

interface ShareFile {
  fileId: string;
  validType: number;
  code: string;
}
//文件分享返回类型
interface res {
  code: number;
  info: string;
  status: number;
}
interface resData extends res {
  data: shareInfo;
}
export type shareInfo = {
  code: string;
  expireTime: string;
  fileId: string;
  shareId: string;
  shareTime: string;
  userId: string;
  validType: number;
};

//获取文件列表类型

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
  shareId: string;
  fileId: string;
  userId: string;
  validType: number;
  expireTime: string;
  shareTime: string;
  code: string;
  showCount: number;
  fileName: string;
  folderType: number;
  fileCategory: number;
  fileType: number;
  fileCover: string;
  showOp?: boolean;
  status?: number;
}
