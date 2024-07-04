import { deepHandleObjectFn } from '@jialouluo/tools/src/utils/object';
import { packagesConfig, PACKAGE_ENUM } from '@jialouluo/configs/src/configs/packages';
import { AppRouteModule } from '@/types/Route';
import { DEFAULT_LAYOUT } from '@/router/constant';

const demoRouteConfig = packagesConfig[PACKAGE_ENUM.DEMO].menuConfig;

export default deepHandleObjectFn(demoRouteConfig!, 'children', {
	handleFn: item => {
		return <AppRouteModule>{
			...item,
			component: DEFAULT_LAYOUT,
		};
	},
});
