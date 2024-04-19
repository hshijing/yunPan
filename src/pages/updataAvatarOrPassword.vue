<!-- 更新头像|修改密码 -->
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
    <el-form
      :model="formDate"
      ref="formRef"
      label-position="right"
      label-width="100px"
      @submit.prevent
      :rules="rules"
    >
      <template v-if="UpdateAvatar">
        <el-form-item label="昵称:">
          {{ formDate.nickName }}
        </el-form-item>
        <el-form-item label="头像上传:">
          <uploadAvatarVue
            v-model="formDate.avatar"
            @file="(e) => (formDate.avatar = e)"
          />
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="新密码:" prop="password">
          <el-input
            v-model="formDate.password"
            placeholder="请输入密码"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码:" prop="registerPassword">
          <el-input
            v-model="formDate.registerPassword"
            placeholder="请再次输入密码"
            type="password"
            show-password
          />
        </el-form-item>
      </template>
    </el-form>
  </DialongVue>
</template>

<script setup lang="ts">
import { ref,defineAsyncComponent } from "vue";
import { useStore } from "@/pinia/index";
import { reqUpdataAvatar ,reqUpdatePassword} from "@/api/login/login";
import { useMyRef } from "@/utils/useMyRef";
import { ElForm, ElMessage } from "element-plus";
const uploadAvatarVue=defineAsyncComponent(()=>import('@/components/uploadAvatar.vue'))
const DialongVue=defineAsyncComponent(()=>import('@/components/Dialong.vue'))
const store = useStore();
//区分当前是更新头像还是更新密码
const UpdateAvatar = ref(true);
//弹出框数据
const dialogDate = ref({
  show: false,
  title: "",
  width: "400px",
  top: 100,
  buttons: [
    {
      type: "primary",
      text: "确定",
      buttonLeft: "250px",
      click: (e) => {
        getUpdateAvatarOrPassword();
      },
    },
  ],
});
interface formData {
  nickName?: string;
  avatar?: File;
  password?: string;
  //二次密码
  registerPassword?: string;
}
//表单数据
const formDate = ref<formData>({
  nickName: store.userInfo?.nickName as string,
});
const formRef = useMyRef(ElForm);
//表单校验
const rules: any = {
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{6,50}$/,
      message: "密码由6-16位字母与数字",
      trigger: "blur",
    },
  ],
  registerPassword: [
    { required: true, message: "请输入密码", trigger: "change" },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value !== formDate.value.password) {
          callback(new Error("两次密码不一致"));
        } else {
          callback();
        }
      },
    },
  ],
};
//暴漏方法让父组件打开弹窗
const showUpdateAvatarOrPassWord = (type: boolean) => {
  if (type) {
    dialogDate.value.title = "修改头像";
    UpdateAvatar.value = true;
  } else {
    dialogDate.value.title = "修改密码";
    UpdateAvatar.value = false;
  }
  dialogDate.value.show = true;
};
//接口更新
const getUpdateAvatarOrPassword = async () => {
  try {
    //更新头像
    if (UpdateAvatar.value) {
      if (!(formDate.value.avatar instanceof File)) {
        return;
      }
      //更新头像
      await reqUpdataAvatar(formDate.value.avatar);
      //获取最新头像 仓库属性变化 头像组件监听 然后根据时间戳强制刷新头像组件
      store.setUserAvatarForce();
    } else {
      await formRef.value?.validate();
      //更新密码 整理参数
      const reqPassword = formDate.value.password;
      await reqUpdatePassword(reqPassword as string)
    }
    dialogDate.value.show = false;
    ElMessage.success("修改成功");
  } catch (error) {
    ElMessage.error("修改失败");
    return Promise.reject(error);
  }
};
//修改头像或者密码
defineExpose({
  showUpdateAvatarOrPassWord,
});
</script>

<style scoped lang="scss"></style>
