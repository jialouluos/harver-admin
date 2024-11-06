import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import qiankun from 'vite-plugin-qiankun';
import packagesConfig, { PACKAGE_ENUM } from '@jialouluo/configs';
import { dynamicBase } from 'vite-plugin-dynamic-base';

function _resolve(dir: string) {
	return path.resolve(__dirname, dir);
}
const config = packagesConfig[PACKAGE_ENUM.BLOG_ADMIN];
// https://vitejs.dev/config/
export default defineConfig({
	build: {
		outDir: `dist/`,
	},
	base: process.env.NODE_ENV === 'production' ? '/blog_admin' : '/',
	plugins: [
		vue(),
		qiankun(config.microConfig!.name, {
			useDevMode: true,
		}) as any,
		// dynamicBase({
		// 	/* options */
		// }),
	],
	server: {
		port: config.port,
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
	},

	resolve: {
		alias: {
			'@blog_admin': _resolve('src'),
		},
	},
});
