interface res {
  status: string;
  code: 200;
  info: string;
}
export interface GetEmailCodeRes extends res {
  data: null;
}
export interface GetEmailCode {
  email: string;
  checkCode: string;
  type: number;
}

export interface getRegister {
  email: string;
  nickName: string;
  password: string;
  checkCode: string;
  emailCode: string;
}

export interface getLogin {
  email: string;
  password: string; //经过MD5加密
  checkCode: string;
}
export interface getLoginRes extends res {
  data: {
    nickName: string;
    userId: string;
    avatar: null;
    admin: boolean;
  };
}

export interface getResetPassword {
  email: string;
  password: string; //经过MD5加密
  checkCode: string;
  emailCode: string;
}

export interface getUseSpaceRes extends res {
  data: {
    useSpace: number;
    totalSpace: number;
  };
}
