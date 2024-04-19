<!-- txt预览组件 -->
<template>
  <div class="code">
    <div class="op">
      <div class="select">
        <el-select
          v-model="enCode"
          placeholder="选择编码"
          @change="changeEncode"
        >
          <el-option label="utf8编码" value="utf8"></el-option>
          <el-option label="gbk编码" value="gbk"></el-option>
        </el-select>
        <div class="tips">乱码了?切换编码</div>
      </div>
      <div class="copy">
        <el-button type="primary" @click="copyTxt">复制</el-button>
      </div>
    </div>
    <!-- 代码高亮 -->
    <highlightjs autodetect :code="txtCentent"></highlightjs>
  </div>
</template>

<script setup lang="ts">
//文本复制
import clipboard from "vue-clipboard3";

import request from "../../utils/request";
import { ElMessage } from "element-plus";
import { ref, onMounted } from "vue";
const _props = defineProps<{ url: string }>();
const { toClipboard } = clipboard();
//编码格式
const enCode = ref("utf8");
//内容
const txtCentent = ref("");
//接收流文件
const blobResult = ref();

//请求数据
const readTxt = async () => {
  try {
    const res = await request({
      url: _props.url,
      responseType: "blob",
    });
    blobResult.value = res;
    //代码高亮
    parseTxt();
  } catch (error) {
    return Promise.reject(error);
  }
};

//编码格式变化
const changeEncode = (e) => {
  enCode.value = e;
  parseTxt();
};
//解析txt 代码高亮
const parseTxt = () => {
  const reader = new FileReader();
  reader.readAsText(blobResult.value, enCode.value);
  reader.onload = function (e) {
    txtCentent.value = this.result as string;
  };
};
onMounted(() => {
  readTxt();
});
//复制内容
const copyTxt = async () => {
  await toClipboard(txtCentent.value);
  ElMessage.success("复制成功");
};
</script>

<style scoped lang="scss">
.code {
  width: 100%;
  margin-top: 30px;
  .op {
    display: flex;
    align-items: center;
    justify-content: space-around;
    .select {
      flex: 1;
      display: flex;
      align-items: center;
      margin: 10px;
      .tips {
        width: 200px;
        margin-left: 10px;
        color: #999;
      }
    }
    .copy {
      margin-right: 10px;
    }
  }
  pre {
    margin: 0;
  }
}
</style>
