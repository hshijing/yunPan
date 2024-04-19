interface res {
  code: number;
  status: string;
  info: string;
}

export interface getFolderInfoRes extends res {
  data: getFolderInfo[];
}
export interface getFolderInfo {
  fileName: string; //目录名
  fileId: string; //目录id
}
