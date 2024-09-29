import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { basicRoutes } from './routes/basic';
import { App } from 'vue';
import { AppRouteModule } from '@/types/Route';
import { deepHandleObjectFn } from '@jialouluo/tools';
import { importFileRouteSystem } from '../utils/index';

const modulesGlob = import.meta.glob('./modules/**/*.ts', { eager: true }); // import.meta.glob() 直接引入所有的模块 Vite 独有的功能

const ROUTE_WHITE_LIST: (string | symbol)[] = []; //路由白名单

const moduleRouteList: AppRouteModule[] = [...basicRoutes];

// 加入到路由集合中
moduleRouteList.push(
	...importFileRouteSystem(modulesGlob, {
		ignorePath: './modules/',
		exc: 'index.ts',
	})
);
console.log(moduleRouteList);
export const router = createRouter({
	// 创建一个 hash 历史记录。
	history: createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
	// 应该添加到路由的初始路由列表。
	routes: moduleRouteList as unknown as RouteRecordRaw[],
	// 是否应该禁止尾部斜杠。默认为假
	strict: true,
	scrollBehavior: () => ({ left: 0, top: 0 }),
});

//初始化路由白名单
export const initWhiteList = (array: AppRouteModule[]) => {
	array.forEach(item => {
		if (!item.name) console.info('no route name:', item);
		ROUTE_WHITE_LIST.push(item.name!);
		initWhiteList(item.children ?? []);
	});
};

//重设路由状态
export function resetRouter() {
	router.getRoutes().forEach(route => {
		const { name } = route;
		if (name && !ROUTE_WHITE_LIST.includes(name)) {
			router.hasRoute(name) && router.removeRoute(name);
		}
	});
}
export const rawMenus = moduleRouteList
	.filter(item => item.meta.isMenu)
	.sort((a, b) => b.meta.order - a.meta.order)
	.map(item => {
		return deepHandleObjectFn(item, 'children', {
			filterFn: obj => {
				return obj.meta.isMenu;
			},
			handleFn: obj => {
				return obj;
			},
			handleNextNodes: obj => {
				return obj.sort((a, b) => b.meta.order - a.meta.order);
			},
		});
	});

export const setupRoute = (app: App<Element>) => {
	initWhiteList(basicRoutes);
	app.use(router);
};
