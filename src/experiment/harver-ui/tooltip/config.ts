import { AppRouteModule } from '@/types/Route';

export default <AppRouteModule>{
	path: 'tooltip',
	name: 'tooltip',
	component: () => import('./index.vue'),
	meta: {
		title: '文字提示',
		order: 1,
		isMenu: true,
		inMicro: false,
	},
};
