import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
export const qiankunPublicPath = (_path: string) => {
	if (!qiankunWindow.__INJECTED_PUBLIC_PATH_BY_QIANKUN__) return _path;
	if ((qiankunWindow.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ as string).at(-1) === '/' && _path.at(0) === '/') {
		return (qiankunWindow.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ ?? '') + _path.slice(1);
	}
	return (qiankunWindow.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ ?? '') + _path;
};
