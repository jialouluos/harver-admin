import { deepHandleObjectFn } from '@jialouluo/tools';
import packagesConfig, { PACKAGE_ENUM } from '@jialouluo/configs';
import { AppRouteModule } from '@/types/Route';
import { DEFAULT_LAYOUT } from '@/router/constant';

const demoRouteConfig = packagesConfig[PACKAGE_ENUM.ADMIN].menuConfig!;

export default deepHandleObjectFn(demoRouteConfig!, 'children', {
	handleFn: item => {
		return <AppRouteModule>{
			...item,
			component: DEFAULT_LAYOUT,
		};
	},
});
