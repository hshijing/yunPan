<!-- 视频播放组件 -->
<template>
  <div ref="playerRef" id="player"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Dplayer from "dplayer";
const _props = defineProps<{ url: string }>();
//播放器实例
const playerRef = ref();
//初始化播放器
const initPlayer = () => {
  //配置播放器
  new Dplayer({
    element: playerRef.value, //播放器容器
    theme: "#b7daff", //主题色
    video: {
      url: `/api${_props.url}`, //视频地址
      type: "customHls", //MSE支持
      customType: {
        customHls: function (video, player) {
          //@ts-ignore 创建hls实例 （流媒体）
          const hls = new Hls();
          hls.loadSource(video.src);
          hls.attachMedia(video);
        },
      },
    },
  });
};
onMounted(() => {
  initPlayer();
});
</script>

<style scoped lang="scss">
#player {
  width: 100%;
  :depp .dplayer-wrap {
    text-align: center;
    .dplayer-video {
      margin: 0 auto;
      max-height: calc(100vh - 100px);
    }
  }
}
</style>
