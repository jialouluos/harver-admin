import { PageEnum } from '@/enums/PageEnum';
import { DEFAULT_LAYOUT } from '@/router/constant';

import { importFileRouteSystem } from '@/utils';
const modulesGlob = import.meta.glob('@/experiment/**/config.ts', { eager: true }); // import.meta.glob() 直接引入所有的模块 Vite 独有的功能

export default importFileRouteSystem(modulesGlob, {
	ignorePath: '/src/',
	exc: 'config.ts',
	rootNode: {
		path: PageEnum.EXPERIMENT,
		name: 'ExperimentRoute',
		component: DEFAULT_LAYOUT,
		meta: {
			title: '实验室',
			order: 1,
			isMenu: true,
			inMicro: false,
		},
	},
});