import { AppRouteModule } from '@/types/Route';

export default <AppRouteModule>{
	path: 'harver-ui',
	name: 'harver-ui',
	meta: {
		title: 'harverUI',
		order: 1,
		isMenu: true,
		inMicro: false,
	},
	children: [],
};
