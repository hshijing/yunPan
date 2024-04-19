import { type Columns, TableOptions } from "@/components/MyTable.vue";
import { ElMessage } from "element-plus";
import { type fileItem } from "@/api/file/type";

//数据
export const columns: Columns[] = [
  {
    prop: "fileName",
    label: "文件名",
    scopedSlot: "fileName",
    width: "1100px",
  },
  {
    prop: "updateTime",
    label: "修改时间",
    width: "200px",
  },
  {
    prop: "fileSize",
    label: "文件大小",
    scopedSlot: "fileSize",
    width: "200px",
  },
];

//表格配置项
export const tableOptions: TableOptions = {
  showIndex: true,
  showSelection: true,
  stripe: true,
  border: false,
  height: "500",
};

//分享表单数据类型
export interface shareFormData {
  fileName:string
  validType:number
  extractCode:number
  code?:string
  fileId:string
}

//重命名的边界校验
export const reNameFileBorderValidation = (currFile: fileItem) => {
  //区分是重命名文件还是文件夹
  if (currFile.folderType === 0) {
    //重命名文件 切割 不让改文件后缀名
    currFile.fileNameReal = currFile.fileName.substring(
      0,
      currFile.fileName.lastIndexOf(".")
    );
    //新增一个属性 后面用来展示文件后缀名
    currFile.fileNameRealOld = currFile.fileName.substring(
      currFile.fileName.lastIndexOf(".")
    );
  } else {
    //重命名文件夹
    currFile.fileNameReal = currFile.fileName;
    currFile.fileNameRealOld = "";
  }
};
//新建文件夹的边界校验
export const newFolderBorderValidation = (
  fileNameReal: string,
  list: fileItem[]
) => {
  //判断命名是否符合规则
  if (fileNameReal === "") {
    ElMessage.error("文件夹名称不能为空");
    return false;
  }
  if (fileNameReal?.indexOf("/") !== -1 || fileNameReal?.indexOf("\\") !== -1) {
    ElMessage.error("文件夹名称不能包含特殊字符");
    return false;
  }
  const isUpload = list.some((item) => {
    if (item.folderType === 0) {
      const Name = item.fileName.substring(0, item.fileName.lastIndexOf("."));
      return Name === fileNameReal; //判断文件名称是否重复
    } else {
      return item.fileName === fileNameReal; //判断文件夹名称是否重复
    }
  });
  if (isUpload) {
    ElMessage.error("文件夹名称不能重复");
    return false;
  }
  return true;
};

//支持的文件类型映射
export const fileTypeMap = {
  all: { accept: "*" },
  video: { accept: ".mp4,.avi,.flv,.mkv" },
  image: { accept: ".jpg,.png,.gif,.webp" },
  music: { accept: ".mp3,.wav,.wma,.mp2,.flac,.aac,.ape" },
  zip: { accept: ".zip,.rar,.7z,.gz,.tar" },
  doc: { accept: ".doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.pdf" },
  other: { accept: "*" },
};
