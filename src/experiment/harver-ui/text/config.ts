import { AppRouteModule } from '@/types/Route';

export default <AppRouteModule>{
	path: 'text',
	name: 'text',
	component: () => import('./index.vue'),
	meta: {
		title: '文本',
		order: 2,
		isMenu: true,
		inMicro: false,
	},
};
