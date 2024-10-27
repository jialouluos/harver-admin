import { NavigationGuardNext, RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { basicRoutes } from './routes/basic';
import { App } from 'vue';
import { AppRouteModule } from '@/types/Route';
import { deepFilterTree, deepHandleObjectFn } from '@jialouluo/tools';
import { importFileRouteSystem } from '../utils/index';
import { useStore } from '@/store';
import { PACKAGE_ENUM } from '@jialouluo/configs';
import { client } from '@/utils/client';
import { message } from 'ant-design-vue';

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
export const router = createRouter({
	// 创建一个 hash 历史记录。
	history: createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
	// 应该添加到路由的初始路由列表。
	routes: moduleRouteList as unknown as RouteRecordRaw[],
	// 是否应该禁止尾部斜杠。默认为假
	strict: true,
	scrollBehavior: () => ({ left: 0, top: 0 }),
});
console.log('main app route register：', moduleRouteList);
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
export const rawMenus = (
	deepFilterTree(moduleRouteList, 'children', {
		filterFn: object => object.meta.isMenu,
	}) as AppRouteModule[]
)
	.sort((a, b) => b.meta.order - a.meta.order)
	.map(item => {
		return deepHandleObjectFn(item, 'children', {
			handleFn: obj => obj,
			handleNextNodes: obj => {
				return obj.sort((a, b) => b.meta.order - a.meta.order);
			},
		});
	});
export const setupRoute = (app: App<Element>) => {
	initWhiteList(basicRoutes);
	app.use(router);
};
const blogAdminPathTemplate = (strings: TemplateStringsArray) => {
	return `/${PACKAGE_ENUM.BLOG_ADMIN}${strings}`;
};
const routePermissionValidate = async (options: {
	next: NavigationGuardNext;
	handleNoPermission: () => void;
	handleHasPermission?: () => void;
	extraCheck?: () => boolean;
}) => {
	const { next, handleNoPermission, handleHasPermission, extraCheck } = options;

	if (extraCheck && !extraCheck()) {
		return handleNoPermission();
	}

	return await client
		.check()
		.then(_ => {
			handleHasPermission && handleHasPermission();
			next();
		})
		.catch(_ => {
			message.error('token非法或已过期!');
			handleNoPermission();
		});
};
router.beforeEach(async (to, _, next) => {
	const store = useStore();

	if (to.path.startsWith(`/${PACKAGE_ENUM.BLOG_ADMIN}`)) {
		// blog admin
		const microPath = '/' + to.path.split('/').slice(2).join('/');
		if (microPath.includes('/login')) {
			store.blogAdminStore?.clear();
			next();
		} else {
			await routePermissionValidate({
				next,
				handleNoPermission: () => {
					store.blogAdminStore?.clear();
					next(blogAdminPathTemplate`/login`);
				},
				handleHasPermission: () => {
					store.blogAdminStore.showMicroRouteMenu = true;
				},
				extraCheck: () => store.blogAdminStore.hasToken,
			});
		}
	} else {
		store.blogAdminStore?.clear();
		next();
	}
});
