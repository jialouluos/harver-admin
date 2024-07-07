import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import { mergeRoutePath } from './string';
export const qiankunPublicPath = (_path: string) => {
	if (!qiankunWindow.__INJECTED_PUBLIC_PATH_BY_QIANKUN__) return _path;
	return mergeRoutePath(qiankunWindow.__INJECTED_PUBLIC_PATH_BY_QIANKUN__, _path);
};
