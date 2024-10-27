import { deepHandleObjectFn } from '@jialouluo/tools';
import packagesConfig, { PACKAGE_ENUM } from '@jialouluo/configs';
import { AppRouteModule } from '@/types/Route';
import { DEFAULT_LAYOUT } from '@/router/constant';

const routeConfig = packagesConfig[PACKAGE_ENUM.BLOG_ADMIN].menuConfig!;
console.log(routeConfig,'routeConfig');
export default deepHandleObjectFn(routeConfig!, 'children', {
	handleFn: item => {
		return <AppRouteModule>{
			...item,
			component: DEFAULT_LAYOUT,
		};
	},
});
