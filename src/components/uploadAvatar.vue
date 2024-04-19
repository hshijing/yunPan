<!-- 更新头像 -->
<template>
  <div class="upload">
    <div class="showAvatar">
      <template v-if="avatarUrl">
        <img :src="avatarUrl" alt="" class="avatar" />
      </template>
      <template v-else>
        <img v-if="userAvatar" :src="`/api/${userAvatar}`" alt="img" />
        <img v-else src="../assets/R-C.jpg" alt="" class="avatar" />
      </template>
    </div>
    <div class="uploadAvatar">
      <el-upload
        name="file"
        :show-file-list="false"
        accesskey=".png,.jpg,.PNG,.JPG"
        :multiple="false"
        :http-request="uploadAvatar"
      >
        <el-button type="primary" :style="{ margin: '20px' }">选择</el-button>
      </el-upload>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "@/pinia/index";
const store = useStore();
const userAvatar = store.getUserAvatarData;
const avatarUrl = ref("");
const emit = defineEmits<{'file':[file:File],'update:modelValue':[avatarUrl:string]}>();
const uploadAvatar = async ({ file }: { file: File }) => {
  try {
    const img = new FileReader();
    img.readAsDataURL(file);
    img.onload = (e) => {
      avatarUrl.value = e.target?.result as string;
      //本地预览的base64
      emit("update:modelValue", avatarUrl.value);
      //傻逼后端要文件流
      emit("file", file);
    };
  } catch (error) {
    return Promise.reject(error);
  }
};
</script>

<style scoped lang="scss">
.upload {
  display: flex;
  justify-content: center;
  align-items: end;
  .showAvatar {
    width: 130px;
    height: 130px;
    border-radius: 30px;
    display: flex;
    justify-content: center;
    overflow: hidden;
    position: relative;
    .avatar {
      width: 100%;
      height: 100%;
    }
    .uploadAvatar {
      margin-left: 10px;
      vertical-align: bottom;
    }
  }
}
</style>
