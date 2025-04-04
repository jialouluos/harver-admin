import { defineConfig } from 'vite';
import path from 'path';
import qiankun from 'vite-plugin-qiankun';
import packagesConfig, { PACKAGE_ENUM } from '@jialouluo/configs';

function _resolve(dir: string) {
	return path.resolve(__dirname, dir);
}
const config = packagesConfig[PACKAGE_ENUM.DEMO];

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		outDir: `dist/`,
	},
	base: process.env.NODE_ENV === 'production' ? '/demo' : '/',
	plugins: [
		qiankun(config.microConfig!.name, {
			useDevMode: true,
		}),
		// dynamicBase({
		// 	/* options */
		// }),
	],
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.d.ts'],
		alias: {
			'@demo': _resolve('./src'),
		},
	},
	server: {
		port: config.port,
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
	},
});
