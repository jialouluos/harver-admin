import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import packagesConfig, { type AppRouteModule, PACKAGE_ENUM } from '@jialouluo/configs';
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import appRouteModules from './modules';
import { deepFilterTree, deepHandleObjectFn } from '@jialouluo/tools';
import { useStore } from '@blog_admin/store';

const config = packagesConfig[PACKAGE_ENUM.BLOG_ADMIN];

const router = createRouter({
	history: createWebHistory(qiankunWindow.__POWERED_BY_QIANKUN__ ? config.microConfig!.activeRule : '/'),
	routes: [
		{
			path: '/', //进入页面 将其跳转到登录页面
			redirect: '/login',
		},
		...(appRouteModules as unknown as RouteRecordRaw[]),
	],
});

export const menus = (
	deepFilterTree(appRouteModules, 'children', {
		filterFn: object => object.meta.isMenu,
	}) as AppRouteModule[]
)
	.sort((a, b) => b.meta.order - a.meta.order)
	.map(item => {
		return deepHandleObjectFn(item, 'children', {
			handleFn: obj => {
				return {
					...obj,
					path: obj.meta.microPath,
				};
			},
			handleNextNodes: obj => {
				return obj.sort((a, b) => b.meta.order - a.meta.order);
			},
		});
	});

export const setupRoute = (app: any) => {
	const store = useStore();
	store.blogAdminStore.routeMenu = menus;
	app.use(router);
	//为每一个路由守卫挂载路由守卫
};