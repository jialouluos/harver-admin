import { PageEnum } from '@/enums/PageEnum';
import { AppRouteModule } from '@/types/Route';
import { DEFAULT_LAYOUT, EXCEPTION_PAGE, LOGIN_PAGE } from '@/router/constant';

// 根路由
export const RootRoute: AppRouteModule = {
	path: PageEnum.BASE_PAGE,
	name: 'Root',
	redirect: PageEnum.DEMO,
	meta: {
		title: 'Root',
		order: 1,
		isMenu: false,
		inMicro: false,
	},
};

export const LoginRoute: AppRouteModule = {
	path: PageEnum.LOGIN_PAGE,
	name: 'Login',
	component: LOGIN_PAGE,
	meta: {
		title: 'login page',
		order: 1,
		isMenu: false,
		inMicro: false,
	},
};

export const exceptionRoute: AppRouteModule = {
	path: PageEnum.EXCEPTION_PAGE,
	name: 'exception',
	component: DEFAULT_LAYOUT,
	meta: {
		title: 'exception page',
		order: 1,
		isMenu: false,
		inMicro: false,
	},
	children: [
		{
			path: '/:status(.*)*',
			name: 'exception',
			component: EXCEPTION_PAGE,
			meta: {
				order: 1,
				title: 'exception page',
				isMenu: false,
				inMicro: false,
			},
		},
	],
};

export const TestRoute: AppRouteModule = {
	path: PageEnum.TEST_PAGE,
	name: 'Test',
	component: DEFAULT_LAYOUT,
	meta: {
		title: '测试',
		order: 1,
		isMenu: true,
		inMicro: false,
	},
	children: [
		{
			path: 'test_1',
			name: 'Test_1',
			component: () => import('@/test/test_1/index.vue'),
			meta: {
				title: '表单扫盲',
				order: 1,
				isMenu: true,
				inMicro: false,
			},
		},
		{
			path: 'test_2',
			name: 'Test_2',
			component: () => import('@/test/test_2/index.vue'),
			meta: {
				title: '油猴脚本',
				order: 1,
				isMenu: true,
				inMicro: false,
			},
		},
	],
};
export const basicRoutes = <AppRouteModule[]>[LoginRoute, RootRoute, exceptionRoute, TestRoute];
