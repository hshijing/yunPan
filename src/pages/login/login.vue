<template>
  <div class="login">
    <div class="loginBody">
      <div class="title">{{ titleType[type] }}</div>
      <div class="form">
        <el-form
          :model="formDate"
          ref="formRef"
          :rules="rules"
          :inline-message="true"
          @submit.prevent
        >
          <!-- 邮箱 -->
          <el-form-item prop="email">
            <el-input
              type="email"
              placeholder="请输入邮箱"
              size="large"
              v-model.trim="formDate.email"
            >
              <template #prefix>
                <span class="iconfont icon-account"></span>
              </template>
            </el-input>
          </el-form-item>

          <!-- 注册与重置独有 邮箱验证码 -->
          <el-form-item prop="emailCode" v-if="type !== 'login'">
            <div class="checkCode">
              <el-input
                type="email"
                placeholder="请输入邮箱验证码"
                size="large"
                v-model.trim="formDate.emailCode"
              >
                <template #prefix>
                  <span class="iconfont icon-checkcode"></span>
                </template>
              </el-input>
              <el-button
                size="large"
                type="primary"
                style="width: 200px; margin-left: 10px"
                @click="getEmailCode"
                >获取验证码</el-button
              >
            </div>
            <el-popover placement="left" :width="500" trigger="click">
              <div>
                <p>1.在垃圾箱中查找邮箱验证码</p>
                <p>2.在邮箱中头像->设置->反垃圾->白名单->设置邮件地址白名单</p>
                <p>
                  3.将邮箱【laoluo@wuhancoder.com】添加到白名单不知道怎么设置?
                </p>
              </div>
              <template #reference>
                <span class="a-link" :style="{ fontSize: '14px' }">
                  未收到验证码?
                </span>
              </template>
            </el-popover>
          </el-form-item>

          <!-- 注册独有  昵称 -->
          <el-form-item prop="nickName" v-if="type === 'register'">
            <el-input
              placeholder="请输入昵称"
              size="large"
              v-model.trim="formDate.nickName"
            >
              <template #prefix>
                <span class="iconfont icon-account"></span>
              </template>
            </el-input>
          </el-form-item>

          <!-- 找回与注册 密码 -->
          <el-form-item
            prop="registerPassword"
            class="item"
            v-if="type !== 'login'"
          >
            <el-input
              size="large"
              type="password"
              placeholder="请输入密码"
              v-model.trim="formDate.registerPassword"
              show-password
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
            </el-input>
          </el-form-item>

          <!-- 找回与注册 二次密码 -->
          <el-form-item prop="reRegisterPassword" v-if="type !== 'login'">
            <el-input
              size="large"
              placeholder="请再次输入密码"
              v-model.trim="formDate.reRegisterPassword"
              show-password
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
            </el-input>
          </el-form-item>

          <!-- 登录独有 密码 -->
          <el-form-item prop="password" v-if="type === 'login'">
            <el-input
              size="large"
              placeholder="请输入密码"
              v-model.trim="formDate.password"
              show-password
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
            </el-input>
          </el-form-item>

          <!-- 图片验证码 -->
          <el-form-item prop="checkCode">
            <div class="checkCode">
              <el-input
                size="large"
                placeholder="请输入验证码"
                v-model.trim="formDate.checkCode"
                @keyup.enter="doSendForm"
              >
                <template #prefix>
                  <span class="iconfont icon-checkcode"></span>
                </template>
              </el-input>
              <img
                class="img"
                :src="checkCodeUrl"
                alt="验证码"
                @click="getCheckCodeUrl(0)"
              />
            </div>
          </el-form-item>

          <!-- 忘记密码 -->
          <el-form-item v-if="type === 'login'">
            <div class="rememberMe">
              <el-checkbox v-model="formDate.rememberMe">记住我</el-checkbox>
            </div>
            <div class="forget">
              <a
                href="javascript:void(0);"
                class="a-link"
                @click="changeTypeCilck('forget')"
                >忘记密码?</a
              >
              <a
                href="javascript:void(0);"
                class="a-link"
                @click="changeTypeCilck('register')"
                >没有账号?</a
              >
            </div>
          </el-form-item>

          <!-- 去登录 -->
          <el-form-item v-if="type === 'forget'">
            <div class="forget">
              <a
                href="javascript:void(0);"
                class="a-link"
                @click="changeTypeCilck('login')"
                >去登录?</a
              >
            </div>
          </el-form-item>

          <!-- 已有帐号 -->
          <el-form-item v-if="type === 'register'">
            <div class="forget">
              <a
                href="javascript:void(0);"
                class="a-link"
                @click="changeTypeCilck('login')"
                >已有帐号?</a
              >
            </div>
          </el-form-item>

          <!-- 登录按钮 -->
          <el-form-item>
            <el-button
              size="large"
              type="primary"
              style="width: 100%"
              @click="doSendForm"
            >
              {{ titleType[type] }}
            </el-button>
          </el-form-item>
          <div class="qqLoing" v-if="type === 'login'">
            <span>快捷登录</span>
            <img
              class="qqLoingImg"
              src="../../assets/R-C.jpg"
              @click="qqLogin"
            />
          </div>
        </el-form>
      </div>
    </div>
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
        :model="getEmailCodeDate"
        ref="getEmailCodeRef"
        :rules="rules"
        label-width="70px"
        label-position="right"
        @submit.prevent
      >
        <el-form-item label="邮箱:">
          {{ getEmailCodeDate.email }}
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item prop="checkCode" label="验证码:">
          <div class="checkCode">
            <el-input
              size="large"
              placeholder="请输入验证码"
              v-model.trim="getEmailCodeDate.checkCode"
            >
              <template #prefix>
                <span class="iconfont icon-checkcode"></span>
              </template>
            </el-input>
            <img
              class="img"
              :src="emailCheckCodeUrl"
              alt="验证码"
              @click="getCheckCodeUrl(1, true)"
            />
          </div>
        </el-form-item>
      </el-form>
    </DialongVue>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch, nextTick,defineAsyncComponent } from "vue";
import { Login } from "./type";
import { ElForm, ElMessage } from "element-plus";
import { useMyRef } from "@/utils/useMyRef";
import { useStore } from "@/pinia/index";
import router from "@/router/index";
//api
import {
  reqSendEmailCode,
  reqRegister,
  reqLogin,
  reqResetPassword,
  reqQQLogin,
} from "@/api/login/login";
import vueCookies from "vue-cookies"; //cookie
import md5 from "js-md5"; //密码加密

const DialongVue = defineAsyncComponent(() =>
  import("@/components/Dialong.vue")
);
/* 表单数据 */
const formDate = reactive<Login>({
  email: "", //邮箱
  password: "", //登录密码
  checkCode: "", //图片验证码
  rememberMe: false, //记住我
  emailCode: "", //邮箱验证码
  nickName: "", //昵称
  registerPassword: "", //注册密码
  reRegisterPassword: "", //注册二次密码
});
/* 表单实例 */
const formRef = useMyRef(ElForm);
//表单校验
const rules: any = {
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{6,50}$/,
      message: "密码由6-16位字母与数字",
      trigger: "blur",
    },
  ],
  checkCode: [
    { required: true, message: "请输入图片验证码", trigger: "change" },
  ],
  emailCode: [
    { required: true, message: "请输入邮箱验证码", trigger: "change" },
  ],
  nickName: [
    { required: true, message: "请输入昵称", trigger: "change" },
    { min: 2, max: 10, message: "昵称长度在2到10个字符", trigger: "change" },
  ],
  registerPassword: [
    { required: true, message: "请输入密码", trigger: "change" },
    {
      pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{6,16}$/,
      message: "密码由6-16位字母与数字",
      trigger: "change",
    },
  ],
  reRegisterPassword: [
    { required: true, message: "请输入密码", trigger: "change" },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value !== formDate.registerPassword) {
          callback(new Error("两次密码不一致"));
        } else {
          callback();
        }
      },
    },
  ],
};
//pinia仓库
const store = useStore();

/* 图片验证码url */
const checkCodeUrl = ref("/api/checkCode");
/* 发送邮箱验证码的图片验证码url */
const emailCheckCodeUrl = ref("/api/checkCode");
//获取验证码url
const getCheckCodeUrl = (type: number, isGetEmailCodeUrl: boolean = false) => {
  if (!isGetEmailCodeUrl) {
    checkCodeUrl.value = `/api/checkCode?type=${type}&time=${new Date().getTime()}`;
  } else {
    emailCheckCodeUrl.value = `/api/checkCode?type=${type}&time=${new Date().getTime()}`;
  }
};

//获取邮箱验证码的弹出框
const dialogDate = reactive({
  show: false,
  title: "发送邮箱验证码",
  width: "400px",
  top: 200,
  buttons: [
    {
      type: "primary",
      text: "发送验证码",
      buttonLeft: "250px",
      click: (e) => {
        subSendEmailCode();
      },
    },
  ],
});
//获取邮箱验证码的表单实例
const getEmailCodeRef = useMyRef(ElForm);
//发送邮箱验证码的表单数据
const getEmailCodeDate = reactive({
  email: "", //邮箱
  checkCode: "", //图片验证码
  type: 0,
});

/* 当前展示模块 */
type TitleType = keyof typeof titleType;
const titleType = reactive({
  login: "登录",
  register: "注册",
  forget: "重置密码",
});
const type = ref<TitleType>("login");

//切换模块
const changeTypeCilck = (T: TitleType) => {
  type.value = T;
  //清空表单 与校验
  nextTick(() => {
    Object.keys(formDate).forEach((key) => {
      formDate[key] = "";
    });
    formRef.value?.resetFields();
    //更新验证码
    getCheckCodeUrl(type.value === "login" ? 0 : 1);
  });
};
//是否记住我  cookie数据回显表单
const getCookieData = () => {
  //如果是登录 则从cookie中获取记住的账号密码
  if (type.value === "login") {
    //@ts-ignore
    let cookieLoginInfo = vueCookies && vueCookies.get("loginInfo");
    if (cookieLoginInfo) {
      formDate.email = cookieLoginInfo.email;
      formDate.password = cookieLoginInfo.password;
      formDate.rememberMe = cookieLoginInfo.rememberMe;
    }
  }
};
//获取邮箱验证码按钮
const getEmailCode = async () => {
  //是否输入邮箱
  await formRef.value?.validateField("email");
  getEmailCodeDate.email = formDate.email;
  //获取图片验证码
  getCheckCodeUrl(1, true);
  //每次点击时清空验证码
  nextTick(() => {
    getEmailCodeDate.checkCode = "";
  });
  //发送验证码弹出
  dialogDate.show = true;
};
//请求 获取邮箱验证码
const subSendEmailCode = async () => {
  try {
    await getEmailCodeRef.value?.validate();
    //整理参数
    let params = Object.assign({}, getEmailCodeDate);
    params.type = type.value === "register" ? 0 : 1;
    //发送请求
    await reqSendEmailCode(params);
    dialogDate.show = false;
    ElMessage.success("发送成功");
  } catch (error: any) {
    ElMessage.error(error.msg);
    getCheckCodeUrl(1, true);
    return Promise.reject(error);
  }
};
//表单提交 登录|注册|忘记密码
const doSendForm = async () => {
  //校验表单
  try {
    await formRef.value?.validate();
    //登录逻辑
    if (type.value === "login") {
      sendLoginFrom();
    } else {
      //注册|重置密码逻辑
      sendRegisterFrom(
        type.value === "register" ? reqRegister : reqResetPassword,
        type.value === "register" ? "注册成功" : "重置密码成功"
      );
    }
    //登录
  } catch (error) {
    return Promise.reject(error);
  }
};

//注册|重置密码提交表单的逻辑
const sendRegisterFrom = async (func: Function, typeMsg: string) => {
  try {
    //整理参数
    let params = Object.assign({}, formDate);
    params.password = formDate.registerPassword as string;
    delete params.reRegisterPassword;
    delete params.rememberMe;
    delete params.registerPassword;
    //重置密码不需要昵称
    if (func === reqResetPassword) {
      delete params.nickName;
    }
    //发送请求
    await func(params);
    //切换模块为登录
    ElMessage.success(typeMsg);
    changeTypeCilck("login");
  } catch (error: any) {
    ElMessage.error(error.msg);
    //失败也得切换图片验证码
    getCheckCodeUrl(0);
    return Promise.reject(error);
  }
};
//登录提交表单的逻辑
const sendLoginFrom = async () => {
  try {
    await formRef.value?.validate();
    //整理参数
    let params = Object.assign({}, formDate);
    delete params.nickName;
    delete params.reRegisterPassword;
    delete params.registerPassword;
    //是否勾选登录信息持久化?
    if (formDate.rememberMe) {
      //存储信息
      let loingInfo: any = {
        email: formDate.email,
        rememberMe: formDate.rememberMe,
      };
      //辨识密码是否加密 如果没有加密则加密
      if (params.password.length === 32) {
        loingInfo.password = params.password;
      } else {
        //@ts-ignore
        loingInfo.password = md5(params.password);
      }
      //@ts-ignore
      vueCookies && vueCookies.set("loginInfo", loingInfo, "7d");
    } else {
      //@ts-ignore
      vueCookies && vueCookies.remove("loginInfo");
    }
    //@ts-ignore 是否有cookie
    const cookie = vueCookies && vueCookies.get("loginInfo");
    const cookiePaw = cookie && cookie.password;
    //如果有则代表已经加密过了
    if (cookiePaw) {
      params.password = cookiePaw;
    } else {
      //@ts-ignore
      params.password = md5(params.password);
    }
    //发送请求
    const res = await reqLogin(params);
    //存储用户信息
    store.setUserInfo(res.data);
    ElMessage.success("登录成功");
    //路由跳转
    router.push("/");
  } catch (error: any) {
    ElMessage.error(error.msg);
    //失败也得切换图片验证码
    getCheckCodeUrl(0);
    return Promise.reject(error);
  }
};
//qq第三方登录
const qqLogin = async () => {
  const res = await reqQQLogin("/");
  if (res.code === 200) {
    //@ts-ignore
    vueCookies.remove("loginInfo");
    document.location.href = res.data as unknown as string;
  }
};
//监听type变化 form表单大小切换
watch(
  () => type.value,
  (newVal) => {
    const loginBody = document.querySelector(
      ".login .loginBody"
    ) as HTMLElement;
    if (newVal !== "login") {
      loginBody.style.height = "70vh";
    } else {
      loginBody.style.height = "50vh";
    }
  }
);
onMounted(async () => {
  getCheckCodeUrl(0);
  getCookieData();
});
</script>

<style scoped lang="scss">
.login {
  width: calc(100vw);
  height: calc(100vh);
  background: url("@/assets/login.jpg") no-repeat center center;
  background-size: cover;

  .loginBody {
    transition: height 0.3s ease;
    position: relative;
    top: 10%;
    left: 10%;
    width: 25vw;
    display: flex;
    justify-content: center;
    height: 500px;
    padding-right: 15px;
    border-radius: 20px;
    background-image: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
    opacity: 0.6;
    .title {
      font-size: 30px;
      position: absolute;
    }
    .form {
      width: 90%;
      height: 100%;
      position: absolute;
      top: 30px;
      padding: 20px;

      .forget {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
.checkCode {
  display: flex;
  width: 100%;
  .img {
    margin-left: 10px;
    cursor: pointer;
    opacity: 1;
  }
}
.item {
  margin-bottom: 20px;
}
.qqLoing {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  span {
    font-size: 14px;
  }
  .qqLoingImg {
    width: 30px;
    height: 30px;
    opacity: 0.8;
    margin-left: 5px;
    cursor: pointer;
  }
}
</style>
