import type { AppRouteModule } from '@jialouluo/configs';
import { importFileRouteSystem } from '@jialouluo/tools';
const modulesGlob = import.meta.glob('@blog_admin/pages/**/index.ts', { eager: true }); // import.meta.glob() 直接引入所有的模块 Vite 独有的功能

export default importFileRouteSystem<AppRouteModule>(modulesGlob, {
	ignorePath: '/src/pages/',
	exc: 'index.ts',
});
