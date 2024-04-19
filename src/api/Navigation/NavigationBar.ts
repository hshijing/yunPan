enum API {
  getFolderInfo = "/file/getFolderInfo", //获取当前目录
  adminGetFolderInfo = "/admin/getFolderInfo", // 管理员获取目录
  showShareGetFolderInfo = "/showShare/getFolderInfo", //分享获取目录
}
import request from "@/utils/request";
import {getFolderInfoRes} from './type'
//获取当前目录
export const reqFolderInfo = (params) =>
  request({
    url: API.getFolderInfo,
    params,
  });

//获取当前目录
export const reqAdminFolderInfo = (params):Promise<getFolderInfoRes> =>
  request({
    url: API.adminGetFolderInfo,
    params
  });

//分享获取目录
export const reqShareFolderInfo = (params) =>
  request({
    url: API.showShareGetFolderInfo,
    params,
  });
