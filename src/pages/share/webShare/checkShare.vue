<!-- 分享校验组件 -->
<template>
  <div class="checkShare">
    <div class="body">
      <div class="logo">
        <span class="iconfont icon-pan"></span>
        <span class="title">XD云盘</span>
      </div>
      <div class="box">
        <div class="header">
          <div class="avatar">
            <AvatarVue
              :avatar="shareInfo.avatar"
              :width="50"
              :height="50"
            ></AvatarVue>
          </div>
          <div class="shareInfo">
            <span class="nickName">{{ shareInfo.nickName }}</span>
            <span class="shareTime">分享于:{{ shareInfo.shareTime }} </span>
            <div class="fileName">分享文件:{{ shareInfo.fileName }}</div>
          </div>
        </div>
        <div class="content">
          <el-form v-model="formDate" ref="formRef" :rules="rules">
            <el-form-item prop="code">
              <el-input
                placeholder="请输入提取码"
                :style="{ width: '300px' }"
                v-model.trim="formDate.code"
              ></el-input>
              <el-button
                type="primary"
                :style="{ marginLeft: '10px', width: '100px' }"
                @click="sendShareCode"
                >提取</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import request from "@/utils/request";
import { useMyRef } from "@/utils/useMyRef";
import { ElForm, ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
enum API {
  shareInfo = "/showShare/getShareInfo",
  checkShare = "/showShare/checkShareCode",
}
//分享文件信息
const shareInfo = ref({
  avatar: "",
  userId: "",
  nickName: "",
  shareTime: "",
  fileName: "",
  fileId: "",
});
//分享文件id
const shareId = route.params.shareId;
//表单校验
const formDate = ref({
  code: "",
});
const rules = {
  code: [
    { required: true, message: "请输入提取码", trigger: "blur" },
    { min: 5, max: 5, message: "提取码为5位", trigger: "change" },
  ],
};
const formRef = useMyRef(ElForm);

//获取分享文件信息
const getShareInfo = async () => {
  try {
    const res: any = await request({
      url: API.shareInfo,
      params: { shareId },
    });
    shareInfo.value = res.data;
  } catch (error: any) {
    ElMessage.warning(error.msg);
    return Promise.reject(error);
  }
};

//提取按钮
const sendShareCode = async () => {
  try {
    await formRef.value?.validate();
    await request({
      url: API.checkShare,
      params: { shareId, code: formDate.value.code },
    });
    ElMessage.success("提取成功");
    router.push(`/webShareDetail/${shareId}`);
  } catch (error) {
    ElMessage.warning("提取错误");
    return Promise.reject(error);
  }
};

getShareInfo();
</script>

<style scoped lang="scss">
.checkShare {
  width: 100%;
  height: calc(100vh);
  background: url("../../../assets/g4925.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  .body {
    margin-left: auto;
    margin-top: 100px;
    width: 500px;
    height: 300px;
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      .iconfont {
        font-size: 80px;
        color: #e2e8f1;
      }
      .title {
        font-size: 30px;
        color: #e2e8f1;
      }
    }
    .box {
      width: 100%;
      height: 220px;
      border-radius: 50px;
      opacity: .7;
      .header {
        display: flex;
        align-items: center;
        height: 50px;
        padding: 10px;
        border-radius: 15px 15px 0 0;
        background: #5b96f0;
        .avatar {
          margin-left: 10px;
        }
        .shareInfo {
          margin-left: 10px;
          .nickName {
            font-size: 20px;
            color: #ffffff;
          }

          .shareTime {
            margin-left: 10px;
            font-size: 13px;
            color: #ffffff;
          }
          .fileName {
            margin-top: 10px;
            margin-left: 30px;
            font-size: 13px;
            color: #ffffff;
          }
        }
      }
      .content {
        background: #ffffff;
        width: 100%;
        height: 150px;
        border-radius: 0 0 15px 15px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
