import type { AppRouteModule } from '@jialouluo/configs';

export default <AppRouteModule>{
	path: 'article-list', //用于子应用路由path
	name: 'article-list',
	component: () => import('./index.vue'),
	meta: {
		title: '文章列表',
		order: 1,
		isMenu: true,
		inMicro: true, //待确认
		microPath: 'article-list', //用于主应用路由菜单跳转
	},
};
