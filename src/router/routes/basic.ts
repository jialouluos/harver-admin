import { PageEnum } from '@/enums/PageEnum';
import { AppRouteModule } from '@/types/Route';
import { LOGIN_PAGE } from '@/router/constant';

// 根路由
export const RootRoute: AppRouteModule = {
	path: '/',
	name: 'Root',
	redirect: PageEnum.DEMO,
	meta: {
		title: 'Root',
		order: 1,
		isMenu: false,
	},
};

export const LoginRoute: AppRouteModule = {
	path: PageEnum.BASE_PAGE,
	name: 'Login',
	component: LOGIN_PAGE,
	meta: {
		title: 'login page',
		order: 1,
		isMenu: false,
	},
};

export const basicRoutes = <AppRouteModule[]>[LoginRoute, RootRoute];
