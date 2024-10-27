import { PageEnum } from '@/enums/PageEnum';
import { DEFAULT_LAYOUT } from '@/router/constant';
import type { AppRouteModule } from '@jialouluo/configs';
import { importFileRouteSystem } from '@jialouluo/tools';
const modulesGlob = import.meta.glob('@/experiment/**/config.ts', { eager: true }); // import.meta.glob() 直接引入所有的模块 Vite 独有的功能

export default importFileRouteSystem<AppRouteModule>(modulesGlob, {
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
