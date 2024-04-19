<!-- 文件图标映射 -->
<template>
  <span :style="{ width: `${width}px`, height: `${height}px` }" class="Myicon">
    <img :src="getTypeImg()" :style="{ objectFit: Flt }" />
  </span>
</template>

<script setup lang="ts">
type FIT = "cover" | "contain" | "fill" | "none" | "scale-down";

const _props = defineProps({
  width: {
    type: Number,
    default: 32,
  },
  height: {
    type: Number,
    default: 32,
  },
  Flt: {
    type: String as () => FIT,
    default: "cover",
  },
  iconName: {
    type: String,
  },
  iconType: {
    type: Number,
  },
  cover: {
    type: String,
  },
});
//如果有封面 直接请求封面数据 /api/file/getImage${id}
const apiGetImg = "/api/file/getImage";
const fileTypeMap = new Map();
fileTypeMap.set(0, { desc: "目录", icon: "folder" }); //  目录
fileTypeMap.set(1, { desc: "视频", icon: "video" }); //   视频
fileTypeMap.set(2, { desc: "音频", icon: "music" }); //   音频
fileTypeMap.set(3, { desc: "图片", icon: "image" }); //   图片
fileTypeMap.set(4, { desc: "exe", icon: "pdf" }); //      exe
fileTypeMap.set(5, { desc: "doc", icon: "word" }); //     文档
fileTypeMap.set(6, { desc: "excel", icon: "excel" }); //  表格
fileTypeMap.set(7, { desc: "纯文本", icon: "txt" }); //  表格
fileTypeMap.set(8, { desc: "程序", icon: "code" }); //     程序
fileTypeMap.set(9, { desc: "压缩包", icon: "zip" }); //    压缩包
fileTypeMap.set(10, { desc: "其他", icon: "others" }); //   其他
const getTypeImg = (): string => {
  //如果有封面直接取
  if (_props.cover) {
    return `${apiGetImg}/${_props.cover}`;
  }
  //默认icon
  let icon = "no_data";
  //如果指定icon
  if (_props.iconName) {
    icon = _props.iconName;
  } else {
    //根据类型获取icon
    icon = fileTypeMap.get(_props.iconType)
      ? fileTypeMap.get(_props.iconType).icon
      : "no_data";
  }
  return new URL(`../assets/icon-image/${icon}.png`, import.meta.url).href;
};
</script>

<style scoped lang="scss">
.Myicon {
  text-align: center;
  display: inline-block;
  border-radius: 3px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
