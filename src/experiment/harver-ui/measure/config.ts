import { AppRouteModule } from '@/types/Route';

export default <AppRouteModule>{
	path: 'measure',
	name: 'measure',
	component: () => import('./index.vue'),
	meta: {
		title: '测量',
		order: 1,
		isMenu: true,
		inMicro: false,
	},
};
