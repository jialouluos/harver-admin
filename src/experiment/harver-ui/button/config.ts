import { AppRouteModule } from '@/types/Route';

export default <AppRouteModule>{
	path: 'button',
	name: 'button',
	component: () => import('./index.vue'),
	meta: {
		title: '按钮',
		order: 1,
		isMenu: true,
		inMicro: false,
	},
};
