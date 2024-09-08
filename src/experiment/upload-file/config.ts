import { AppRouteModule } from '@/types/Route';

export default <AppRouteModule>{
	path: 'upload-file',
	name: 'upload-file',
	component: () => import('./index.vue'),
	meta: {
		title: '文件上传',
		order: 1,
		isMenu: true,
		inMicro: false,
	},
};
