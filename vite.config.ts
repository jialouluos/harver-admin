import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

function _resolve(dir: string) {
	return path.resolve(__dirname, dir);
}
// https://vitejs.dev/config/
export default defineConfig({
	base: '/',
	plugins: [vue()],
	resolve: {
		alias: {
			'@': _resolve('src'),
			'#': _resolve('./'),
			'@jialouluo/configs': '@jialouluo/configs/dist/lib-esm/index.js', // Before modification
		},
	},
});
