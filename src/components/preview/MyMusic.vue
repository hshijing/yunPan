<!-- 音乐预览组件 -->
<template>
  <div class="Music">
    <div class="content">
      <span class="cover">
        <img src="../../assets/icon-image/music.png" alt="" />
      </span>
      <div class="play" ref="playRef"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Aplayer from "aplayer";
import "aplayer/dist/APlayer.min.css";
import request from "../../utils/request";
import { ref, onMounted, onUnmounted } from "vue";
const _props = defineProps<{ url: string; fileName: string }>();

const playRef = ref<HTMLElement>();
const play = ref();
onMounted(() => {
  play.value = new Aplayer({
    container: playRef.value,
    audio: {
      url: `/api${_props.url}`,
      name: _props.fileName,
      //@ts-ignore
      cover: new URL("../../assets/icon-image/music.png", import.meta.url).href,
    },
  });
});
onUnmounted(() => {
  play.value.destroy();
});
</script>

<style scoped lang="scss">
.Music {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  .content {
    text-align: center;
    .cover {
      margin: 0 auto;
      width: 200px;
      text-align: center;
      img {
        width: 100%;
      }
    }
    .play {
      margin-top: 20px;
    }
  }
}
</style>
