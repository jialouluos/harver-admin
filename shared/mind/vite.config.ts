// 组件库打包配置
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

function _resolve(dir: string) {
	return path.resolve(__dirname, dir);
}
console.log(_resolve('src'));
export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'@mind': _resolve('src'),
		},
	},

	build: {
		outDir: 'dist/es',
		lib: {
			entry: path.resolve(__dirname, './index.ts'),
			name: 'Mind',
			fileName: 'index',
			formats: ['es'],
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				exports: 'named',
				globals: {
					vue: 'Vue',
				},
			},
		},
	},
});
