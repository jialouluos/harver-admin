// vite.config.ts
import { defineConfig } from "file:///D:/harver-admin/node_modules/.pnpm/vite@5.4.8_@types+node@20.14.2_sass@1.77.5/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/harver-admin/node_modules/.pnpm/@vitejs+plugin-vue@5.1.4_vite@5.4.8_vue@3.5.10/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "D:\\harver-admin";
function _resolve(dir) {
  return path.resolve(__vite_injected_original_dirname, dir);
}
var vite_config_default = defineConfig({
  base: "/",
  plugins: [vue()],
  build: {
    outDir: `mainAppDist/`
  },
  resolve: {
    alias: {
      "@": _resolve("src"),
      "#": _resolve("./")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxoYXJ2ZXItYWRtaW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGhhcnZlci1hZG1pblxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovaGFydmVyLWFkbWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcblxyXG5mdW5jdGlvbiBfcmVzb2x2ZShkaXI6IHN0cmluZykge1xyXG5cdHJldHVybiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBkaXIpO1xyXG59XHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcblx0YmFzZTogJy8nLFxyXG5cdHBsdWdpbnM6IFt2dWUoKV0sXHJcblx0YnVpbGQ6IHtcclxuXHRcdG91dERpcjogYG1haW5BcHBEaXN0L2AsXHJcblx0fSxcclxuXHRyZXNvbHZlOiB7XHJcblx0XHRhbGlhczoge1xyXG5cdFx0XHQnQCc6IF9yZXNvbHZlKCdzcmMnKSxcclxuXHRcdFx0JyMnOiBfcmVzb2x2ZSgnLi8nKSxcclxuXHRcdH0sXHJcblx0fSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBbU8sU0FBUyxvQkFBb0I7QUFDaFEsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sVUFBVTtBQUZqQixJQUFNLG1DQUFtQztBQUl6QyxTQUFTLFNBQVMsS0FBYTtBQUM5QixTQUFPLEtBQUssUUFBUSxrQ0FBVyxHQUFHO0FBQ25DO0FBRUEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDM0IsTUFBTTtBQUFBLEVBQ04sU0FBUyxDQUFDLElBQUksQ0FBQztBQUFBLEVBQ2YsT0FBTztBQUFBLElBQ04sUUFBUTtBQUFBLEVBQ1Q7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNSLE9BQU87QUFBQSxNQUNOLEtBQUssU0FBUyxLQUFLO0FBQUEsTUFDbkIsS0FBSyxTQUFTLElBQUk7QUFBQSxJQUNuQjtBQUFBLEVBQ0Q7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
