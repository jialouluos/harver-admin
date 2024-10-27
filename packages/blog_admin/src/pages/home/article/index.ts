import type { AppRouteModule } from '@jialouluo/configs';

export default <AppRouteModule>{
	path: 'article', //用于子应用路由path
	name: 'article',
	meta: {
		title: '文章管理',
		order: 1,
		isMenu: true,
		inMicro: true, //待确认
		microPath: 'home/article', //用于主应用路由菜单跳转
	},
};
