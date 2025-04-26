import { AppRouteModule } from '@/types/Route';

export default <AppRouteModule>{
	path: 'mind',
	name: 'mind',
	component: () => import('./index.vue'),
	meta: {
		title: '思维导图开发',
		order: 1,
		isMenu: true,
		inMicro: false,
	},
};
