import { deepHandleObjectFn } from '@jialouluo/tools';
import packagesConfig, { PACKAGE_ENUM } from '@jialouluo/configs';
import { AppRouteModule } from '@/types/Route';
import { DEFAULT_LAYOUT } from '@/router/constant'; //https://juejin.cn/post/7276408879364948028

const demoRouteConfig = packagesConfig[PACKAGE_ENUM.DEMO].menuConfig;

export default deepHandleObjectFn(demoRouteConfig!, 'children', {
	handleFn: item => {
		return <AppRouteModule>{
			...item,
			component: DEFAULT_LAYOUT,
		};
	},
});
