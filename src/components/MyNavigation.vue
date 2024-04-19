<!-- 导航栏封装 -->
<template>
  <div class="nav">
    <template v-if="floderList.length > 0">
      <span class="link" @click="backPath">返回上一级</span>
    </template>
    <span v-if="floderList.length === 0" class="allFile">全部文件</span>
    <span class="iconfont icon-right"></span>
    <span v-if="floderList.length > 0" class="link" @click="setPathClick(-1)"
      >全部文件</span
    >
    <template v-for="(item, index) in floderList" :key="item.fileId">
      <span class="iconfont icon-right"></span>
      <span
        class="link"
        v-if="index < floderList.length - 1"
        @click="setPathClick(index)"
      >
        {{ item.fileName }}
      </span>
      <span v-if="index === floderList.length - 1">{{ item.fileName }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import {
  reqFolderInfo,
  reqAdminFolderInfo,
  reqShareFolderInfo,
} from "@/api/Navigation/NavigationBar";

import { getFolderInfo } from "@/api/Navigation/type";
import { type fileItem } from "@/api/file/type";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const _props = defineProps({
  watchPath: {
    type: Boolean,
    default: false,
  },
  shearId: {
    type: String,
  },
  adminShow: {
    type: Boolean,
    default: false,
  },
});
//目录列表
const floderList = ref<getFolderInfo[]>([]);
//当前目录
const currFolder = ref<getFolderInfo>({ fileId: "0", fileName: "" });
const category = ref("");

//全部文件与路径点击跳转到对应目录 需要区分
const setPathClick = (index: number) => {
  //跳转全部文件
  if (index === -1) {
    floderList.value = [];
    currFolder.value = { fileId: "0", fileName: "" };
  } else {
    //更新当前目录
    currFolder.value = floderList.value[index];
    //删除当前目录之后的数据
    floderList.value.splice(index + 1, floderList.value.length);
  }
  setPath();
};
//返回上一级 如果使用router.back() 会造成目录展示不正确
const backPath = () => {
  for (let i = 0, len = floderList.value.length; i < len; i++) {
    if (floderList.value[i].fileId === currFolder.value.fileId) {
      setPathClick(i - 1);
      break;
    }
  }
};
//打开目录
const openFloder = (data: fileItem) => {
  const { fileId, fileName } = data;
  const folder = { fileId, fileName };
  //添加目录 如果当前目录已经存在 则不添加
  if (!floderList.value.find((item) => item.fileId === folder.fileId)) {
    floderList.value.push(folder);
    currFolder.value = folder;
  }
  setPath();
};
//更新路径 设置当前展示目录
const setPath = () => {
  //当前是移动文件时展现的导航栏 不需要切换路由
  if (!_props.watchPath) {
    doCallback();
    return;
  }
  let pathList: string[] = [];
  //获取目录id 用来拼接路由路径
  floderList.value.forEach((item) => {
    pathList.push(item.fileId);
  });
  if (pathList.length === 0) {
    router.push({
      path: route.path,
    });
  } else {
    router.push({
      path: route.path,
      query: {
        path: pathList.join("/"),
      },
    });
  }
};
//区分当前获取目录是正常获取还是管理员还是分享
const distinguishRequst = (path: string) => {
  let fn = reqFolderInfo;
  let params: { path: string; shearId?: string } = {
    path,
  };
  if (_props.shearId) {
    fn = reqShareFolderInfo;
    params.shearId = _props.shearId;
  }
  if (_props.adminShow) {
    fn = reqAdminFolderInfo;
  }
  return { fn, params };
};
//获取当前路径的目录
const getNavFloder = async (path: string) => {
  const { fn, params } = distinguishRequst(path);
  if (path === "") return;
  try {
    const res: any = await fn(params);
    floderList.value = res.data;
  } catch (error) {
    console.log(error);
  }
};
//如果回到主页面刷新则干掉当前目录
const init = () => {
  floderList.value = [];
  currFolder.value = { fileId: "0", fileName: "" };
  doCallback();
};
//解析路由
const parseRoutePath = (routeData) => {
  const pathUrl = routeData.query.path;
  category.value = routeData.params.category;
  //开始解析路由
  if (pathUrl === undefined) {
    init();
  } else {
    //获取打开的目录
    getNavFloder(pathUrl);
    const pathArr = pathUrl.split("/");
    //设置当前目录
    currFolder.value.fileId = pathArr[pathArr.length - 1];
    doCallback();
  }
};

const emit = defineEmits<{
  navChange: [category: string, currFloder: getFolderInfo];
}>();
const doCallback = () => {
  emit("navChange", category.value, currFolder.value);
};

//当前是移动文件时展现的导航栏 不需要切换路由
//监听路由变化 刷新当前文件列表
watch(
  route,
  (newVal) => {
    //当前是移动文件时展现的导航栏 不需要切换路由
    if (!_props.watchPath) return;
    //只需要处理main下的路径 来进行文件列表的刷新
    if (
      newVal.path.indexOf("/main") === -1 &&
      newVal.path.indexOf("/share") === -1
    )
      return;
    //解析路由路径
    parseRoutePath(newVal);
  },
  { immediate: true, deep: true }
);

defineExpose({ openFloder });
</script>

<style scoped lang="scss">
.nav {
  font-size: 13px;
  display: flex;
  align-items: center;
  line-height: 40px;
  .allFile {
    font-weight: bold;
  }
  .link {
    color: rgb(33, 143, 216);
    cursor: pointer;
  }
  .icon-right {
    color: rgb(33, 143, 216);
    padding: 0 5px;
    font-size: 13px;
  }
}
</style>
