import { AppRouteModule } from '@/types/Route';

export default <AppRouteModule>{
	path: 'modal',
	name: 'modal',
	component: () => import('./index.vue'),
	meta: {
		title: '弹窗',
		order: 1,
		isMenu: true,
		inMicro: false,
	},
};
