<template>
  <span class="avatar" :style="{ width: `${width}px`, height: `${height}px` }">
    <img :src="`/api/${userAvatar}`" alt="img" />
  </span>
</template>

<script lang="ts" setup>
import { useStore } from "@/pinia/index";
import { watch ,ref} from "vue";
const store = useStore();
const userAvatar =ref(`${store.getUserAvatarData}?t=${Date.now()}`)
// 强制刷新头像
watch(
  () => store.userAvatarForce,
  () => {
    userAvatar.value = `${store.getUserAvatarData}?t=${Date.now()}`;
  }
);

defineProps<{
  avatar?: string;
  width: number;
  height: number;
}>();
</script>
<style lang="scss" scoped>
.avatar {
  display: flex;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
