import { type Columns, TableOptions } from "@/components/MyTable.vue";
//数据
export const columns: Columns[] = [
  {
    prop: "fileName",
    label: "文件名",
    scopedSlot: "fileName",
    width: "900px",
  },
  {
    prop: "shareTime",
    label: "分享时间",
    width: "200px",
  },
  {
    prop: "expireTime",
    label: "过期时间",
    scopedSlot: "expireTime",
    width: "200px",
  },
  {
    prop: "showCount",
    label: "浏览次数",
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