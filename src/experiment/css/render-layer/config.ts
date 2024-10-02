import { AppRouteModule } from '@/types/Route';

export default <AppRouteModule>{
	path: 'render-layer',
	name: 'render-layer',
	component: () => import('./index.vue'),
	meta: {
		title: 'CSS合成层原理探索',
		order: 1,
		isMenu: true,
		inMicro: false,
	},
};
