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

export const basicRoutes = <AppRouteModule[]>[LoginRoute, RootRoute, exceptionRoute];
