import { AppRouteModule } from '@/types/Route';

export default <AppRouteModule>{
	path: 'grid-ram',
	name: 'grid-ram',
	component: () => import('./index.vue'),
	meta: {
		title: 'RAM布局',
		order: 2,
		isMenu: true,
		inMicro: false,
	},
};
