export const FILE_API_MAP = new Map();
//常规预览
const preview = {
  fileUrl: "/file/getFile",
  videoUrl: "/file/ts/getVideoInfo",
  createDownloadUrl: "/file/createDownloadUrl",
  downloadUrl: "api/file/download",
};
//管理员预览
const adminPreview = {
  fileUrl: "/admin/getFile",
  videoUrl: "/admin/ts/getVideoInfo",
  createDownloadUrl: "/admin/createDownloadUrl",
  downloadUrl: "api/admin/download",
};
//分享预览
const sharePreview = {
  fileUrl: "/showShare/getFile",
  videoUrl: "/showShare/ts/getVideoInfo",
  createDownloadUrl: "/showShare/createDownloadUrl",
  downloadUrl: "api/showShare/download",
};
FILE_API_MAP.set(0, preview);
FILE_API_MAP.set(1, adminPreview);
FILE_API_MAP.set(2, sharePreview);
