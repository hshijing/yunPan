import request from "@/utils/request";
import {
  GetEmailCode,
  GetEmailCodeRes,
  getRegister,
  getLogin,
  getLoginRes,
  getUseSpaceRes,
  getResetPassword,
} from "./type";

enum API {
  sendEmailCode = "/sendEmailCode", //获取邮箱验证码
  register = "/register", //注册
  login = "/login", //登录
  resetPassword = "/resetPwd", //重置密码
  qqLogin = "/qqlogin", //qq登录
  updataAvatar = "/updateUserAvatar", //修改头像
  updatePassword = "/updatePassword", //修改密码
  logout = "/logout", //退出登录
  getUseSpace = "/getUseSpace", //获取用户存储空间
}

//获取邮箱验证码
export const reqSendEmailCode = (
  data: GetEmailCode
): Promise<GetEmailCodeRes> =>
  request({
    url: API.sendEmailCode,
    method: "POST",
    params: data,
  });
//注册
export const reqRegister = (data: getRegister): Promise<GetEmailCodeRes> =>
  request({
    url: API.register,
    method: "POST",
    params: data,
  });
//登录
export const reqLogin = (data: getLogin): Promise<getLoginRes> =>
  request({
    url: API.login,
    method: "POST",
    params: data,
  });
//重置密码
export const reqResetPassword = (
  data: getResetPassword
): Promise<GetEmailCodeRes> =>
  request({
    url: API.resetPassword,
    method: "POST",
    params: data,
  });
//qq登录
export const reqQQLogin = (callbackUrl: string): Promise<GetEmailCodeRes> =>
  request({
    url: API.qqLogin,
    method: "POST",
    params: { callbackUrl },
  });
//修改头像
export const reqUpdataAvatar = (avatar: File): Promise<GetEmailCodeRes> =>
  request({
    url: API.updataAvatar,
    method: "POST",
    params: { avatar },
  });
//修改密码
export const reqUpdatePassword = (password: string): Promise<GetEmailCodeRes> =>
  request({
    url: API.updatePassword,
    method: "POST",
    params: { password },
  });

//退出登录
export const reqLogout = (): Promise<GetEmailCodeRes> =>
  request({
    url: API.logout,
  });
//获取用户存储空间

export const reqGetUseSpace = (): Promise<getUseSpaceRes> =>
  request({
    url: API.getUseSpace,
  });
