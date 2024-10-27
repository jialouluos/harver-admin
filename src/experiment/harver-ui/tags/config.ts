import { AppRouteModule } from '@/types/Route';

export default <AppRouteModule>{
	path: 'tags',
	name: 'tags',
	component: () => import('./index.vue'),
	meta: {
		title: '标签组',
		order: 1,
		isMenu: true,
		inMicro: false,
	},
};
