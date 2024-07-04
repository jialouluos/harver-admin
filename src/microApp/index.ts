import { registerMicroApps, addGlobalUncaughtErrorHandler, FrameworkLifeCycles, RegistrableApp } from 'qiankun';
import { packagesConfig, PACKAGE_ENUM } from '@jialouluo/configs/src/configs/packages';

const microApps = Object.values(packagesConfig)
	.filter(item => item.name !== PACKAGE_ENUM.BASE)
	.map(item => item.microConfig);

const loader = (loading: boolean) => {
	// 此处可以获取子应用是否加载成功,可以用来触发全局的loading
	console.log('loading', loading);
};
const apps = microApps.map(item => {
	return {
		...item,
		loader,
	};
}) as RegistrableApp<{}>[];

const lifeCycle: FrameworkLifeCycles<{}> = {
	beforeLoad: app => {
		// 加载微应用前，加载进度条
		console.log('before load', app.name);
		return Promise.resolve();
	},
	// qiankun 生命周期钩子 - 微应用挂载后
	afterMount: app => {
		// 加载微应用前，进度条加载完成
		console.log('after mount', app.name);
		return Promise.resolve();
	},
};

export const setupMicroApps = () => {
	registerMicroApps(apps, lifeCycle);
	addGlobalUncaughtErrorHandler((event: Event | string) => {
		console.error(event);
	});
};
export { start } from 'qiankun';
