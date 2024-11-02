import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import qiankun from 'vite-plugin-qiankun';
import packagesConfig, { PACKAGE_ENUM } from '@jialouluo/configs';

import { dynamicBase } from 'vite-plugin-dynamic-base';
function _resolve(dir: string) {
	return path.resolve(__dirname, dir);
}
const config = packagesConfig[PACKAGE_ENUM.DEMO];

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		outDir: `dist/`,
	},
	base: process.env.NODE_ENV === 'production' ? '/__dynamic_base__/' : '/',
	plugins: [
		qiankun(config.microConfig!.name, {
			useDevMode: true,
		}),
		dynamicBase({
			/* options */
		}),
	],
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.d.ts'],
		alias: {
			'@': _resolve('src'),
		},
	},
	server: {
		port: config.port,
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
	},
});
