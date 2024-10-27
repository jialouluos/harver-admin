import type { AppRouteModule } from '@jialouluo/configs';

export default <AppRouteModule>{
	path: 'catalog', //用于子应用路由path
	name: 'catalog',
	meta: {
		title: '目录管理',
		order: 1,
		isMenu: true,
		inMicro: true, //待确认
		microPath: 'home/catalog', //用于主应用路由菜单跳转
	},
};
