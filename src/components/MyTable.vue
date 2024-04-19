<!-- 表格封装 -->
<template>
  <el-table
    :data="tableData && tableData.list"
    ref="tableRef"
    :heigh="600"
    :max-height="600"
    :stripe="tableOptions.stripe"
    :border="tableOptions.border"
    header-row-class-name="table-header"
    @row-click="rowClick"
    @selection-change="handleSelectionChange"
  >
    <!-- selection选择框 -->
    <el-table-column
      type="selection"
      width="55"
      v-if="tableOptions.showSelection"
      align="center"
    >
    </el-table-column>
    <!-- 序号 -->
    <el-table-column
      type="index"
      v-if="tableOptions.showIndex"
      align="center"
      width="50"
    >
    </el-table-column>
    <!-- 数据列 -->
    <template v-for="(item, index) in columns" :key="index">
      <!-- 插槽回显 -->
      <template v-if="item.scopedSlot">
        <el-table-column
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :align="item.align || 'center'"
        >
          <template #default="scope">
            <slot
              :name="item.scopedSlot"
              :index="scope.$index"
              :row="scope.row"
            ></slot>
          </template>
        </el-table-column>
      </template>
      <!-- 展示数据 -->
      <template v-else>
        <el-table-column
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :align="item.align || 'center'"
        >
        </el-table-column>
      </template>
    </template>
  </el-table>
  <div class="showPagination">
    <el-divider />
    <el-pagination
      v-if="showPagination"
      background
      :page-sizes="[10, 20, 30, 40]"
      :total="tableData.totalCount"
      :current-page="tableData.pageNo"
      :page-size="tableData.pageSize"
      @current-change="handlePageChange"
      layout=" total, prev, pager, next, jumper"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { type fileItem } from "@/api/file/type";
export interface TableData {
  totalCount: number; //文件总数
  pageNo: number; //当前页码
  pageSize: number; //每页显示条数
  list: fileItem[]; //数据
}
export interface TableOptions {
  stripe: boolean; //是否显示斑马纹
  border: boolean; //是否显示边框
  showIndex: boolean; //是否显示序号
  showSelection: boolean; //是否显示选择框
  height: string; //表格高度
}
export interface Columns {
  prop: string; //列名
  label: string; //列标题
  width: string; //列宽度
  align?: string; //列对齐方式
  scopedSlot?: string; //插槽名
}
const _props = defineProps({
  //表格数据
  tableData: {
    type: Object as () => TableData,
    required: true,
  },
  //表格配置项
  tableOptions: {
    type: Object as () => TableOptions,
    required: true,
  },
  //是否展示分页
  showPagination: {
    type: Boolean,
    default: true,
  },
  //数据
  columns: {
    type: Array as () => Columns[],
  },
  //是否需要初始化数据函数
  fn: {
    type: Function,
    dafault: () => {},
  },
  initFn: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["rowClick", "rowSelect"]);
const tableRef = ref();

//清楚选中
const clearSelection = () => {
  tableRef.value.clearSelection();
};
//设置选中
const setSelection = (rowKey, rowVal) => {
  const row = _props.tableData.list.find((item: any) => item[rowKey] == rowVal);
  tableRef.value.setCurrentRow(row);
};
defineExpose({
  clearSelection,
  setSelection,
});
//行点击事件
const rowClick = (row: any) => {
  emit("rowClick", row);
};
//checkbox选择事件
const handleSelectionChange = (row: any) => {
  emit("rowSelect", row);
};
//分页点击
const handlePageChange = (pageNo: number) => {
  _props.tableData.pageNo = pageNo;
  _props.fn && _props.fn();
};
//初始化数据
const init = () => {
  if (_props.initFn && _props.fn) {
    _props.fn();
  }
};
init();
</script>

<style scoped lang="scss">
.showPagination {
  padding: 10px 0 0 10px;
  margin-top: 20px;
}
.el-pagination {
  justify-content: right;
}
:depp .el-table__cell {
  padding: 4px 0;
}
</style>
