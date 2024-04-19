interface res {
  status: string;
  code: 200;
  info: string;
}

// 文件上传
export interface FileDate {
  category: string;
  filePid?: string|number;
  fileNameFuzzy?: string;
  pageNo?: number;
  pageSize?: number;
}
export interface fileRes extends res {
  data: fileList;
}
export interface noDataRes extends res {
  data: null;
}
export interface fileList {
  totalCount: number;
  pageSize: number;
  pageNo: number;
  pageTotal: number;
  list: fileItem[];
}
export interface fileItem {
  fileId: string; //文件id
  filePid: string; //父级id
  fileSize: number; //文件大小
  fileName: string; //文件名
  fileCover: string; //文件封面
  createTime: string; //创建时间
  lastUpdateTime: string; //最后修改时间
  folderType: number; //是否目录
  fileCategory: number; //文件分类
  fileType: number; //文件类型
  status: number; //文件状态
  showOp?: boolean; //是否编辑
  showEdit?: boolean; //新建文件夹
  fileNameReal?: string; //新建文件夹
  fileNameRealOld?: string; //文件重命名需要
}
export interface reNameFileOrAddFolder {
  fileId: string;
  fileName: string;
  filePid?: string;
}

export interface LoadAllFolder {
  fileId: string;
  filePid: string;
  fileSize: null;
  fileName: string;
  fileCover: null;
  lastUpdateTime: string;
  folderType: number;
  fileCategory: null;
  fileType: null;
  status: number;
}
export interface LoadAllFolderRes extends res {
  data: LoadAllFolder[];
}
