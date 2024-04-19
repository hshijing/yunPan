import { type Columns, TableOptions } from "@/components/MyTable.vue";
//数据
export const columns: Columns[] = [
  {
    prop: "fileName",
    label: "文件名",
    scopedSlot: "fileName",
    width: "600px",
  },
  {
    prop: "fileSize",
    label: "文件大小",
    scopedSlot: "fileSize",
    width: "300px",
  },
  {
    prop: "updataTime",
    label: "修改时间",
    scopedSlot: "updataTime",
    width: "300px",
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