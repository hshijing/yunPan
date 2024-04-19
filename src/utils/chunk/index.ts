import { uploadFileStore } from "@/pinia/uploadFile";
const store = uploadFileStore();
/**
 * 切片上传流程
 * 1. 创建切片
 * 2.开线程
 * 3.分片完成数据回传
 * 4.切片上传
 * @param file
 */
// 切片大小 5MB
const CHUNKSIZE = 1024 * 1024 * 5;
// 线程数 8
const CPUCOUNT = navigator.hardwareConcurrency || 4;

export function chunk(file: File) {
  //用于实时传递进度
  let Md5Index = 0;
  // 重置进度为0
  store.removeMd5Progress();
  //文件回显 组件要用
  //@ts-ignore
  store.setFileUid(file.uid as number);
  return new Promise((resolve, reject) => {
    //分片数量
    const chunkCount = Math.ceil(file.size / CHUNKSIZE); //26
    //线程任务数
    const taskCount = Math.ceil(chunkCount / CPUCOUNT); //4
    //分片结果
    const chunks: Array<any> = [];
    //完成线程数
    let doneCount = 0;
    //创建线程分配任务
    for (let i = 0; i < CPUCOUNT; i++) {
      //每个线程的分片起始位置
      const start = i * taskCount;
      //每个线程的分片结束位置
      let end = (i + 1) * taskCount;
      //最后一个线程分片结束位置
      if (end > chunkCount) {
        end = chunkCount;
      }
      const worker = new Worker(new URL("./worker.ts", import.meta.url), {
        type: "module",
      });
      worker.postMessage({
        file,
        CHUNKSIZE,
        start,
        end,
      });
      worker.onmessage = (event) => {
        //分片结果
        for (let i = start; i < end; i++) {
          chunks[i] = event.data[i - start];
          //实时传递进度
          Md5Index++;
          //调用仓库方法让组件监听数据
          store.setUploadProgress(chunkCount, Md5Index);
        }
        //线程任务完成
        doneCount++;
        worker.terminate();
        if (doneCount === CPUCOUNT) {
          //所有线程任务完成
          resolve(chunks);
        }
      };
    }
  });
}
