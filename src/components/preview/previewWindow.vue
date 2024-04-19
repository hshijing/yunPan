<!-- 预览组件 -->
<template>
  <div class="window" v-if="show">
    <!-- 遮罩层 -->
    <div class="mask" @click="close"></div>
    <!-- 关闭按钮 -->
    <div class="close" @click="close">
      <span class="iconfont icon-close2"></span>
    </div>
    <!-- 内容 -->
    <div
      class="content"
      :style="{
        top: '0px',
        left: `${windowContentLeft}px`,
        width: `${windowContentWidth}px`,
      }"
    >
      <div class="title">{{ title }}</div>
      <div class="body" :style="{ 'align-items': align }">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

const _props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  width: {
    type: Number,
    default: 1000,
  },
  title: {
    type: String,
    default: "视频预览",
  },
  align: {
    type: String,
    default: "top",
  },
});
const emit = defineEmits<{ close: [] }>();
//计算预览宽度
const windowWidth = ref(window.innerWidth);
const windowContentWidth = computed(() => {
  return _props.width > windowWidth.value ? windowWidth.value : _props.width;
});
//计算预览偏移量
const windowContentLeft = computed(() => {
  let left = windowWidth.value - _props.width;
  return left < 0 ? 0 : left / 2;
});
const close = () => emit("close");

//响应式大小
const resizeWidth = () => {
  windowWidth.value = window.innerWidth;
};
onMounted(() => {
  window.addEventListener("resize", resizeWidth);
});
onUnmounted(() => {
  window.removeEventListener("resize", resizeWidth);
});
</script>

<style scoped lang="scss">
.window {
  .mask {
    top: 0px;
    left: 0px;
    width: 100%;
    height: calc(100vh);
    z-index: 1000;
    opacity: 0.5;
    background: #000;
    position: fixed;
  }
  .close {
    z-index: 1001;
    cursor: pointer;
    position: absolute;
    top: 40px;
    right: 30px;
    width: 40px;
    height: 40px;
    background: #c9c5c5;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    .iconfont {
      font-size: 20px;
      color: #fff;
      cursor: pointer;
      z-index: 10000;
    }
  }
  .content {
    top: 0px;
    z-index: 1001;
    position: absolute;
    background: #fff;
    .title {
      text-align: center;
      line-height: 40px;
      border-bottom: 1px solid #ccc;
      font-weight: bold;
    }
    .body {
      height: calc(100vh - 100px);
      display: flex;
      overflow: auto;
    }
  }
}
</style>
