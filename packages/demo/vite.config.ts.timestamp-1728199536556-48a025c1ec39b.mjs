// vite.config.ts
import { defineConfig } from "file:///D:/qiankun/node_modules/.pnpm/vite@5.2.0_@types+node@20.14.2_sass@1.77.5/node_modules/vite/dist/node/index.js";
import path from "path";
import qiankun from "file:///D:/qiankun/node_modules/.pnpm/vite-plugin-qiankun@1.0.15_typescript@5.5.4_vite@5.2.0/node_modules/vite-plugin-qiankun/dist/index.js";
import packagesConfig, { PACKAGE_ENUM } from "file:///D:/qiankun/shared/configs/dist/lib-esm/index.js";
import { dynamicBase } from "file:///D:/qiankun/node_modules/.pnpm/vite-plugin-dynamic-base@1.1.0_vite@5.2.0/node_modules/vite-plugin-dynamic-base/dist/index.js";
var __vite_injected_original_dirname = "D:\\qiankun\\packages\\demo";
function _resolve(dir) {
  return path.resolve(__vite_injected_original_dirname, dir);
}
var config = packagesConfig[PACKAGE_ENUM.DEMO];
var vite_config_default = defineConfig({
  base: process.env.NODE_ENV === "production" ? "/__dynamic_base__/" : "/",
  plugins: [
    qiankun(config.microConfig.name, {
      useDevMode: true
    }),
    dynamicBase({
      /* options */
    })
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".d.ts"],
    alias: {
      "@": _resolve("src")
    }
  },
  server: {
    port: config.port,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxxaWFua3VuXFxcXHBhY2thZ2VzXFxcXGRlbW9cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHFpYW5rdW5cXFxccGFja2FnZXNcXFxcZGVtb1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovcWlhbmt1bi9wYWNrYWdlcy9kZW1vL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHFpYW5rdW4gZnJvbSAndml0ZS1wbHVnaW4tcWlhbmt1bic7XG5pbXBvcnQgcGFja2FnZXNDb25maWcsIHsgUEFDS0FHRV9FTlVNIH0gZnJvbSAnQGppYWxvdWx1by9jb25maWdzJztcblxuaW1wb3J0IHsgZHluYW1pY0Jhc2UgfSBmcm9tICd2aXRlLXBsdWdpbi1keW5hbWljLWJhc2UnO1xuZnVuY3Rpb24gX3Jlc29sdmUoZGlyOiBzdHJpbmcpIHtcblx0cmV0dXJuIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIGRpcik7XG59XG5jb25zdCBjb25maWcgPSBwYWNrYWdlc0NvbmZpZ1tQQUNLQUdFX0VOVU0uREVNT107XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuXHRiYXNlOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nID8gJy9fX2R5bmFtaWNfYmFzZV9fLycgOiAnLycsXG5cdHBsdWdpbnM6IFtcblx0XHRxaWFua3VuKGNvbmZpZy5taWNyb0NvbmZpZyEubmFtZSwge1xuXHRcdFx0dXNlRGV2TW9kZTogdHJ1ZSxcblx0XHR9KSxcblx0XHRkeW5hbWljQmFzZSh7XG5cdFx0XHQvKiBvcHRpb25zICovXG5cdFx0fSksXG5cdF0sXG5cdHJlc29sdmU6IHtcblx0XHRleHRlbnNpb25zOiBbJy50cycsICcudHN4JywgJy5qcycsICcuZC50cyddLFxuXHRcdGFsaWFzOiB7XG5cdFx0XHQnQCc6IF9yZXNvbHZlKCdzcmMnKSxcblx0XHR9LFxuXHR9LFxuXHRzZXJ2ZXI6IHtcblx0XHRwb3J0OiBjb25maWcucG9ydCxcblx0XHRoZWFkZXJzOiB7XG5cdFx0XHQnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuXHRcdH0sXG5cdH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBa1EsU0FBUyxvQkFBb0I7QUFFL1IsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sYUFBYTtBQUNwQixPQUFPLGtCQUFrQixvQkFBb0I7QUFFN0MsU0FBUyxtQkFBbUI7QUFONUIsSUFBTSxtQ0FBbUM7QUFPekMsU0FBUyxTQUFTLEtBQWE7QUFDOUIsU0FBTyxLQUFLLFFBQVEsa0NBQVcsR0FBRztBQUNuQztBQUNBLElBQU0sU0FBUyxlQUFlLGFBQWEsSUFBSTtBQUcvQyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMzQixNQUFNLFFBQVEsSUFBSSxhQUFhLGVBQWUsdUJBQXVCO0FBQUEsRUFDckUsU0FBUztBQUFBLElBQ1IsUUFBUSxPQUFPLFlBQWEsTUFBTTtBQUFBLE1BQ2pDLFlBQVk7QUFBQSxJQUNiLENBQUM7QUFBQSxJQUNELFlBQVk7QUFBQTtBQUFBLElBRVosQ0FBQztBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNSLFlBQVksQ0FBQyxPQUFPLFFBQVEsT0FBTyxPQUFPO0FBQUEsSUFDMUMsT0FBTztBQUFBLE1BQ04sS0FBSyxTQUFTLEtBQUs7QUFBQSxJQUNwQjtBQUFBLEVBQ0Q7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNQLE1BQU0sT0FBTztBQUFBLElBQ2IsU0FBUztBQUFBLE1BQ1IsK0JBQStCO0FBQUEsSUFDaEM7QUFBQSxFQUNEO0FBQ0QsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
