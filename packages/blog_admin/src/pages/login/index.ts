import type { AppRouteModule } from '@jialouluo/configs';

export default <AppRouteModule>{
	path: '/login',
	name: 'login',
	component: () => import('./index.vue'),
	meta: {
		title: '登录',
		order: 1,
		isMenu: false,
		inMicro: false, //待确认
		microPath: 'login',
	},
};
