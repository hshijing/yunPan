interface Chunk {
  start: number;
  end: number;
  hash: string;
  index: number;
  blob: Blob;
}
import sparkMD5 from "spark-md5";
/**
 * 文件切片
 * @param file 文件对象
 * @param index  当前切片索引
 * @param chunkSize 切片大小
 * @returns
 */
export function currFile(file: File, index: number, chunkSize: number) {
  return new Promise((resolve) => {
    //当前这一片起始位置
    const start = index * chunkSize;
    //当前这一片分结束位置
    const end = start + chunkSize;
    //md5编码  文件唯一标识(便于后端组装)
    const spark = new sparkMD5.ArrayBuffer();
    //文件读取器
    const reader = new FileReader();
    //服务器需要字段 blob对象
    const blob = file.slice(start, end);
    //开始读取文件
    reader.readAsArrayBuffer(blob);
    //读取完成
    reader.onload = (e) => {
      //计算md5
      spark.append(e.target?.result as ArrayBuffer);
      const data: Chunk = {
        start,
        end,
        hash: spark.end(),
        index,
        blob,
      };
      resolve(data);
    };
  });
}
