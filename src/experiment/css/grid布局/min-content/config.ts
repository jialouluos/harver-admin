import { AppRouteModule } from '@/types/Route';

export default <AppRouteModule>{
	path: 'min-content',
	name: 'min-content',
	component: () => import('./index.vue'),
	meta: {
		title: 'Grid和Flex的最小内容尺寸',
		order: 2,
		isMenu: true,
		inMicro: false,
	},
};
