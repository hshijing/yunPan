
export interface Login {
  email: string;//邮箱
  password: string; // 密码
  checkCode:string,//图片验证码
  rememberMe?:boolean//是否记住密码
  emailCode:string//邮箱验证码
  nickName?:string//用户名
  registerPassword?:string//注册密码
  reRegisterPassword?:string,//二次注册密码
}
 
