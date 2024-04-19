import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ElLoading, ElMessage } from "element-plus";
import router from "@/router/index";
let Loading: any;
const ContenTypeFrom = "application/x-www-form-urlencoded;charset=utf-8";
const ContenTypeJson = "application/json";
const ResponseTypeJson = "json";
interface MyAxiosRequestConfig extends AxiosRequestConfig {
  showLoading?: boolean;
  errorCallback?: (response: AxiosResponse) => void;
  showError?: boolean;
  dataType?: string;
}
const interce = axios.create({
  baseURL: "/api",
  timeout: 1 * 10000,
});
//请求拦截器
interce.interceptors.request.use(
  (config: any) => {
    if (config.showLoading) {
      Loading = ElLoading.service({
        lock: true,
        text: "加载中...",
        background: "rgba(0, 0, 0, 0.7)",
      });
    }
    return config;
  },
  (error) => {
    if (error.config.showLoading && Loading) {
      Loading.close();
      ElMessage.error("请求失败");
    }
    return Promise.reject(error);
  }
);
//响应拦截器
interce.interceptors.response.use(
  (response: AxiosResponse) => {
    const config: MyAxiosRequestConfig = response.config;
    const { showLoading, errorCallback, showError, responseType } = config;
    //关闭loading效果
    if (showLoading && Loading) {
      Loading.close();
    }
    const responseData = response.data;
    //处理二进制流
    if (responseType === "arraybuffer" || responseType === "blob") {
      return responseData;
    }
    //正常请求
    if (responseData.code === 200) {
      return responseData;
    } else if (responseData.code === 901) {
      //登录超时
      router.push("/login");
      return Promise.reject({ showError: false, msg: "登录超时" });
    } else {
      //错误处理
      if (errorCallback) {
        errorCallback(responseData);
      }
      return Promise.reject({ showError, msg: responseData.info });
    }
  },
  (error) => {
    if (error.config.showLoading && Loading) {
      Loading.close();
      ElMessage.error("请求失败");
    }
    return Promise.reject({ showError: true, msg: "网络异常" });
  }
);

const request = async <T>(config: MyAxiosRequestConfig): Promise<T> => {
  const {
    url,
    params,
    dataType,
    showLoading = true,
    errorCallback,
    showError = true,
    responseType = ResponseTypeJson,
  } = config;

  // 设置请求头
  let contentType = ContenTypeFrom;
  // formData对象
  let formData = new FormData();

  // 携带内容
  for (const key in params) {
    formData.append(key, params[key] === undefined ? "" : params[key]);
  }
  // json格式
  if (dataType !== null && dataType === "json") {
    contentType = ContenTypeJson;
  }
  // 设置请求头
  const headers = {
    "Content-Type": contentType,
    "X-Requested-With": "XMLHttpRequest",
  };

  try {
    return await interce.post(url as string, formData, {
      onUploadProgress: (progressEvent) => {
        //进度条 如果支持就触发
        if(config.onUploadProgress){
          config.onUploadProgress(progressEvent)
        }
      },
      headers,
      responseType,
      //@ts-ignore
      showLoading,
      errorCallback,
      showError,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};
export default request;
