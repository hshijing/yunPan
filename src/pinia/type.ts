export interface STATE {
  // 用户信息
  userInfo:User | null
  userAvatar:string
  userAvatarForce:number
}
interface User{
  userId:string,
  nickName:string,
  avatar:null|string,
  admin:boolean
}