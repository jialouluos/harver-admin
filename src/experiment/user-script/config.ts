import { AppRouteModule } from '@/types/Route';

export default <AppRouteModule>{
	path: 'monkey',
	name: 'monkey',
	component: () => import('./index.vue'),
	meta: {
		title: '油猴脚本',
		order: 1,
		isMenu: true,
		inMicro: false,
	},
};
