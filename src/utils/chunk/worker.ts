import { currFile } from "./currFile";
addEventListener("message", async (event) => {
  const { file, CHUNKSIZE, start, end } = event.data;
  const proms: any = [];
  for (let i = start; i < end; i++) {
    const chunk = await currFile(file, i, CHUNKSIZE);
    proms.push(chunk);
  }
  // 发送每个分片的结果
  const chunks = await Promise.all(proms);
  postMessage(chunks);
});
