<!-- 没数据展示组件 -->
<template>
  <div class="noData">
    <div class="noDataInner">
      <MyIconVue icon-name="no_data" :width="120" :height="80" Fit="file" />
      <div class="tips">当前目录没有数据,快去上传你的第一个文件吧😊</div>
      <div class="opList">
        <el-upload
          :style="{ marginRight: '10px' }"
          :show-file-list="false"
          :with-credentials="true"
          :multiple="true"
          :http-request="addFile"
          :accept="fileAccept"
        >
          <div class="opItem">
            <MyIconVue icon-name="file" :width="90" :height="70" Fit="file" />
            <span class="span">上传文件</span>
          </div>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MyIconVue from "./MyIcon.vue";
defineProps({
  fileAccept: {
    type: String,
    default: ".txt,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf",
  },
  addFile: {
    type: Function,
    default: () => {},
  },
  category: {
    type: String,
    required: true,
  },
});
</script>

<style scoped lang="scss">
.noData {
  height: calc(100vh - 200px);
  width: 100%;
  position: relative;
  left: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  .noDataInner {
    text-align: center;
    .tips {
      margin-top: 10px;
    }
    .opList {
      margin-top: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      .opItem {
        cursor: pointer;
        width: 100px;
        height: 100px;
        margin: 0 10px;
        padding: 5px 0;
        background-color: #f3f2f2;
        .span {
          font-size: 12px;
          color: #5e5c5c;
        }
      }
    }
  }
}
</style>
