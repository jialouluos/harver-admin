import type { AppRouteModule } from '@jialouluo/configs';

export default <AppRouteModule>{
	path: 'article-up', //用于子应用路由path
	name: 'article-up',
	component: () => import('./index.vue'),
	meta: {
		title: '文章上传',
		order: 1,
		isMenu: true,
		inMicro: true, //待确认
		microPath: 'article-up', //用于主应用路由菜单跳转
	},
};
