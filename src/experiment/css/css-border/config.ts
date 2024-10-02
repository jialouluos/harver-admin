import { AppRouteModule } from '@/types/Route';

export default <AppRouteModule>{
	path: 'css-border',
	name: 'css-border',

	component: () => import('./index.vue'),
	meta: {
		title: 'CSS实现一个炫酷边框',

		order: 1,
		isMenu: true,
		inMicro: false,
	},
};
