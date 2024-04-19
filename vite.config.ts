import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { join } from "node:path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  build: {
    outDir: "./dist",
    assetsDir: "static",
    rollupOptions: {
      output: {
        dir: "./dist",
        //js打包
        entryFileNames: "js/[hash:8][name].js",
        //js分包
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
          //其他模块打包
          return "common";
        },
        //js分包后的文件存放
        chunkFileNames: `js/[name].[hash:8].js`,
        //静态资源打包
        //静态资源存放
        assetFileNames(file) {
          if (file.name?.slice(-3) === "css") {
            return "static/css/[name].[hash:8].css";
          }
          if (file.name?.slice(-3) === "svg") {
            return "static/svg/[name].[hash:8].svg";
          }
          return "static/[name].[hash:8].[ext]";
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:7090",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
  resolve: {
    alias: {
      "@": join(__dirname, "src/"),
    },
  },
});
