import { AppRouteModule } from '@/types/Route';

export default <AppRouteModule>{
	path: 'tag',
	name: 'tag',
	component: () => import('./index.vue'),
	meta: {
		title: '标签',
		order: 2,
		isMenu: true,
		inMicro: false,
	},
};
