import type { AppRouteModule } from '@jialouluo/configs';

export default <AppRouteModule>{
	path: '/home',
	name: 'home',
	component: () => import('./index.vue'),
	meta: {
		title: 'home',
		order: 1,
		isMenu: false,
		inMicro: true, //待确认
		microPath: 'home',
	},
	redirect: '/home/welcome',
};
