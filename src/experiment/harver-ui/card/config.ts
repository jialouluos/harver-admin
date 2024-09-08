import { AppRouteModule } from '@/types/Route';

export default <AppRouteModule>{
	path: 'card',
	name: 'card',
	component: () => import('./index.vue'),
	meta: {
		title: '卡片',
		order: 1,
		isMenu: true,
		inMicro: false,
	},
};
