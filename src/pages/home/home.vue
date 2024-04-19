<template>
  <div class="layout">
    <!--头部 -->
    <div class="header">
      <!-- logo -->
      <div class="logo">
        <span class="iconfont icon-pan"></span>
        <span class="name">XD云盘</span>
      </div>
      <!-- 右边用户信息 -->
      <div class="right">
        <el-popover
          :width="700"
          trigger="click"
          v-model:visible="showFileVisible"
          transition="none"
          popper-style="top:70px"
        >
          <template #reference>
            <span class="iconfont icon-transfer"></span>
          </template>
          <uploadFileVue ref="uploadFileRef" @uploadFile="uploadFileHandel" />
        </el-popover>
        <el-dropdown trigger="click">
          <div class="userInfo">
            <AvatarVue :width="40" :height="40" />
            <div class="nickName">{{ userInfo?.nickName }}</div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="showUpdata(true)"
                >修改头像</el-dropdown-item
              >
              <el-dropdown-item @click="showUpdata(false)"
                >修改密码</el-dropdown-item
              >
              <el-dropdown-item @click="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <!-- 内容 -->
    <div class="content">
      <!-- 左侧菜单栏 -->
      <div class="leftSider">
        <div class="menuList">
          <div
            :class="[
              'menuItem',
              { active: item.menuCode === currentMenu?.menuCode },
            ]"
            v-for="item in menus"
            :key="item.path"
            @click="menuClick(item)"
          >
            <template v-if="item.allShow">
              <div :class="['iconfont', `icon-${item.icon}`]"></div>
              <span>{{ item.name }}</span>
            </template>
          </div>
        </div>
        <div class="menuSubList" v-if="currentMenu?.children">
          <div
            :class="['menuSubItem', { active: item.path === currMenuPath }]"
            v-for="item in currentMenu?.children"
            :key="item.path"
            @click="menuClick(item as any)"
          >
            <span
              v-if="item.icon"
              :class="['iconfont', `icon-${item.icon}`]"
            ></span>
            <span>{{ item.name }}</span>
          </div>
          <div class="tips" v-if="currentMenu.tips">{{ currentMenu.tips }}</div>
          <div class="spaceInfo">
            <div>空间使用</div>
            <div class="percent">
              <el-progress :percentage="userSpacePercent"></el-progress>
            </div>
            <div class="spaceUse">
              <div class="use">{{ _convertSize(userSpace.useSpace) }}/{{ _convertSize(userSpace.totalSpace) }}</div>
              <div class="iconfont icon-refresh" @click="getUseSpace"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- 路由内容 -->
      <div class="main">
        <router-view v-slot="{ Component }">
          <component :is="Component" @addFileEmit="addFile" @getUserSpace="getUseSpace"></component>
        </router-view>
      </div>
    </div>
  </div>
  <!-- 修改头像弹出框或者修改密码 -->
  <updataAvatarOrPasswordVue ref="updateAvatarRef" />
</template>

<script setup lang="ts">
import { menus, MenuItem } from "./type";
import { ref, watch, nextTick, defineAsyncComponent, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/pinia/index";
import { reqLogout, reqGetUseSpace } from "@/api/login/login";
import { Message } from "@/utils/message";
import { _convertSize } from "@/utils/fileSize2str";
import { ElMessage } from "element-plus";
//定义异步组件
const uploadFileVue = defineAsyncComponent(() => import("../uploadFile.vue"));
const updataAvatarOrPasswordVue = defineAsyncComponent(
  () => import("../updataAvatarOrPassword.vue")
);

const route = useRoute();
const router = useRouter();
const store = useStore();
//用户信息
const userInfo = ref(store.userInfo);
// 当前选中菜单
const currentMenu = ref<MenuItem>();
//当前选中菜单的二级菜单
const currMenuPath = ref("");
//是否展示上传的弹窗
const showFileVisible = ref(false);
//上传的组件实例
const uploadFileRef = ref();
//当前用户的空间
const userSpace = ref({ useSpace: 1, totalSpace: 1 });
//计算当前用户的空间使用度
const userSpacePercent = computed(() => {
  return Math.floor(
    (userSpace.value.useSpace / userSpace.value.totalSpace) * 100
  );
});
// 点击菜单切换
const menuClick = (item: MenuItem) => {
  // 防止重复点击
  if (!item.path || item.menuCode === currentMenu.value?.menuCode) {
    return;
  }
  // 跳转
  router.push(item.path);
};
// 设置当前菜单
const setMenu = (menuCode: string, path: string) => {
  //一级菜单高亮
  currentMenu.value = menus.find((i) => i.menuCode === menuCode);
  //二级菜单高亮
  currMenuPath.value = path;
};
//修改头像或者修改密码的子组件实例
const updateAvatarRef = ref();
//调用子组件方法进行显示
const showUpdata = (type: boolean) =>
  updateAvatarRef.value.showUpdateAvatarOrPassWord(type);

// 退出登录
const logout = () => {
  try {
    Message({
      btnText: "确定",
      message: "你确定退出登录吗?",
      fn: async () => {
        await reqLogout();
        //移除用户信息
        store.setUserInfo(null);
        router.push("/login");
      },
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

//添加文件 数据通过父组件来给两个子组件公用 由父组件进行数据管理
//如果使用pinia来管理数据 也是得监听 还不如事件回传
const addFile = (file: File, filePid: string) => {
  // 显示弹窗
  showFileVisible.value = true;
  uploadFileRef.value.childAddFile(file, filePid);
};
//上传成功刷新用户空间
const uploadFileHandel = () => {
  nextTick(() => {
    getUseSpace();
  });
};

//获取用户存储空间
const getUseSpace = async () => {
  try {
    const res = await reqGetUseSpace();
    userSpace.value = res.data;
  } catch (error) {
    ElMessage.error("网络错误");
    return Promise.reject(error);
  }
};
getUseSpace();
// 监听路由变化 取出路由源信息 做菜单高亮
watch(
  () => route,
  (newVal) => {
    if (newVal.meta.menuCode) {
      setMenu(newVal.meta.menuCode as string, newVal.path);
    }
  },
  { immediate: true, deep: true }
);
</script>

<style scoped lang="scss">
.layout {
  width: 100vw;
  height: 100vh;
  .header {
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    height: 50px;
    padding: 5px 20px;
    position: relative;
    z-index: 10000000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .logo {
      display: flex;
      align-items: center;
      .icon-pan {
        font-size: 40px;
        color: #409eff !important;
      }
      .name {
        font-size: 24px;
        color: #409eff;
        margin-left: 10px;
      }
    }
    .right {
      display: flex;
      align-items: center;
      .icon-transfer {
        cursor: pointer;
      }
      .el-dropdown:focus {
        outline: none !important; /* 移除默认的外边框 */
      }
      .userInfo {
        margin-left: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        .avatar {
          margin: 0 10px;
          width: 20px;
          height: 20px;
          border-radius: 5px;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .nickName {
          margin-left: 10px;
          color: #78b1eb;
        }
      }
    }
  }
  .content {
    display: flex;
    .leftSider {
      border-right: 1px solid #f1f2f4;
      display: flex;
      .menuList {
        height: calc(100vh - 50px) l;
        width: 80px;
        box-shadow: 0 3px 10px rgb(0 0 0/ 6%);
        border-right: 1px solid #f1f2f4;
        .active {
          background-color: #f1f2f4;
          .iconfont {
            color: #409eff !important;
          }
          span {
            color: #409eff;
          }
        }
        .menuItem {
          text-align: center;
          font-size: 18px;
          padding: 20px 0px;
          cursor: pointer;
          &:hover {
            background-color: #f1f2f4;
          }

          .iconfont {
            font-size: 20px;
          }
          span {
            font-size: 14px;
          }

          .tips {
            font-size: 12px;
            margin-top: 10px;
            color: #909399;
          }
        }
      }
      .menuSubList {
        width: 8vw;
        height: calc(100vh - 100px);
        padding: 20px 10px 0;
        position: relative;
        .menuSubItem {
          text-align: center;
          line-height: 40px;
          border-radius: 5px;
          cursor: pointer;
          &:hover {
            background-color: #f1f2f4;
          }
          .iconfont {
            margin-right: 10px;
            font-size: 15px;
          }
          span {
            font-size: 12px;
          }
        }
        .active {
          background-color: #c9dff3;
          .iconfont {
            color: #409eff !important;
          }
          span {
            color: #409eff;
          }
        }
        .tips {
          font-size: 12px;
          margin-top: 10px;
          color: #909399;
        }

        .spaceInfo {
          position: absolute;
          bottom: 10px;
          width: 100%;
          padding: 5px;
          .percent {
            padding-right: 10px;
          }
          .spaceUse {
            margin-top: 5px;
            color: #909399;
            display: flex;
            justify-content: space-between;
            .use {
              flex: 1;
            }
            .iconfont {
              cursor: pointer;
              margin-right: 20px;
              color: #409eff;
            }
          }
        }
      }
    }
  }
}
</style>
