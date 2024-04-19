<!-- 分享弹窗组件 -->
<template>
  <DialongVue
    :show="dialogDate.show"
    :title="dialogDate.title"
    :width="dialogDate.width"
    :top="dialogDate.top"
    :show-close="true"
    :show-cancel="false"
    :buttons="dialogDate.buttons"
    @close="dialogDate.show = false"
  >
    
    <template v-if="!showShareSuccess">
      <el-form
        :model="formDate"
        ref="formRef"
        label-position="right"
        label-width="100px"
        @submit.prevent
        :rules="rules"
      >
        <el-form-item label="文件:"> {{ formDate.fileName }} </el-form-item>
        <el-form-item label="有效期:" prop="validType">
          <el-radio-group v-model="formDate.validType">
            <el-radio :value="0" size="large">1天</el-radio>
            <el-radio :value="1" size="large">7天 </el-radio>
            <el-radio :value="2" size="large">30天</el-radio>
            <el-radio :value="3" size="large">永久有效</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="提取码:" prop="extractCode">
          <el-radio-group v-model="formDate.extractCode">
            <el-radio :value="0" size="large">自定义</el-radio>
            <el-radio :value="1" size="large">系统生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formDate.extractCode == 0" prop="code">
          <el-input
            :style="{ width: '200px' }"
            v-model="formDate.code"
            placeholder="请输入5位提取码"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template v-else>
      <el-form
        :model="formDate"
        ref="formRef"
        label-position="right"
        label-width="100px"
        @submit.prevent
        :rules="rules"
      >
        <el-form-item label="文件:"> {{ formDate.fileName }} </el-form-item>

        <el-form-item label="分享地址:">
          {{ shareUrl }}
        </el-form-item>

        <el-form-item label="分享码:">
          {{ shareInfo.code }}
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="copyShareUrl">
            复制链接以及提取码
          </el-button>
        </el-form-item>
      </el-form>
    </template>
  </DialongVue>
</template>

<script setup lang="ts">
import DialongVue from "@/components/Dialong.vue";
import { useMyRef } from "@/utils/useMyRef";
import { ref, nextTick } from "vue";
import { shareFormData } from "./index";
import { ElForm, ElMessage } from "element-plus";
import { reqShareFile, type shareInfo } from "@/api/share/index";
import clipboard from "vue-clipboard3";
const { toClipboard } = clipboard();
//弹出框数据
const dialogDate = ref({
  show: false,
  title: "分享",
  width: "600px",
  top: 100,
  buttons: [
    {
      type: "primary",
      text: "确定",
      buttonLeft: "500px",
      click: (e) => {
        sendClick();
      },
    },
  ],
});
//标记当前分享状态
const showShareSuccess = ref(false);

//分享路径
const shareUrl = ref("");

//分享成功存储分享信息
const shareInfo = ref<shareInfo>({
  code: "",
  expireTime: "",
  fileId: "",
  shareId: "",
  shareTime: "",
  userId: "",
  validType: 0,
});
//表单数据
const formDate = ref<shareFormData>({
  fileName: "",
  validType: 0,
  extractCode: 1,
  code: "",
  fileId: "",
});
const formRef = useMyRef(ElForm);
//表单校验
const rules = {
  validType: [{ required: true, message: "请选择分享期限", trigger: "change" }],
  extractCode: [
    { required: true, message: "请选择提取码类型", trigger: "change" },
  ],
  code: [
    { required: true, message: "请输入提取码", trigger: "change" },
    { min: 5, max: 5, message: "提取码由5位字符组成", trigger: "blur" },
  ],
};

//打开按钮
const openDialog = (fileName: string, fileId: string) => {
  //每次弹窗初始化分享状态
  showShareSuccess.value = false;
  dialogDate.value.show = true;
  //初始化表单数据
  nextTick(() => {
    formRef.value?.resetFields();
    formDate.value.fileName = fileName;
    formDate.value.fileId = fileId;
    formDate.value.extractCode = 1;
    formDate.value.code = "";
    Object.keys(shareInfo.value).forEach((key) => {
      shareInfo.value[key] = "";
    });
  });
};
//确定按钮
const sendClick = async () => {
  try {
    formRef.value?.validate();
    //当前是分享成功后 再次点击确定按钮 就直接关闭弹窗
    if (shareInfo.value.code !== "") {
      dialogDate.value.show = false;
      return;
    }
    const params = {
      fileId: formDate.value.fileId,
      validType: formDate.value.validType,
      code: "",
    };
    //发送分享请求 需要区分当前是否使用自定义提取码
    if (formDate.value.extractCode == 0) {
      //自定义提取码
      params.code = `${formDate.value.code}`;
    } else {
      //@ts-ignore 系统生成提取码
      delete params.code;
    }
    const res = await reqShareFile(params);
    shareInfo.value = res.data;
    //拼接分享地址
    shareUrl.value = `${window.location.origin}/share/${res.data.shareId}`;
    showShareSuccess.value = true;
  } catch (error) {
    return Promise.reject(error);
  }
};

//复制分享链接
const copyShareUrl = async () => {
  try {
    await toClipboard(`链接:${shareUrl.value};提取码:${shareInfo.value.code}`);
    ElMessage.success("复制成功");
  } catch (error) {
    ElMessage.success("复制失败");
    return Promise.reject(error);
  }
};

defineExpose({
  openDialog,
});
</script>

<style scoped lang="scss"></style>
