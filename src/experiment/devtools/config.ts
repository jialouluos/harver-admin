import { AppRouteModule } from '@/types/Route';

export default <AppRouteModule>{
	path: 'dev-tools',
	name: 'dev-tools',
	component: () => import('./index.vue'),
	meta: {
		title: '开发者工具唤起监听',
		order: 1,
		isMenu: true,
		inMicro: false,
	},
};
