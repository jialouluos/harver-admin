import type { AppRouteModule } from '@jialouluo/configs';

export default <AppRouteModule>{
	path: 'welcome', //用于子应用路由path
	name: 'welcome',
	component: () => import('./index.vue'),
	meta: {
		title: '欢迎',
		order: 1,
		isMenu: true,
		inMicro: true, //待确认
		microPath: 'home/welcome', //用于主应用路由菜单跳转
	},
};
