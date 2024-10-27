import type { AppRouteModule } from '@jialouluo/configs';

export default <AppRouteModule>{
	path: 'catalog-list', //用于子应用路由path
	name: 'catalog-list',
	component: () => import('./index.vue'),
	meta: {
		title: '目录列表',
		order: 1,
		isMenu: true,
		inMicro: true, //待确认
		microPath: 'catalog-list', //用于主应用路由菜单跳转
	},
};
