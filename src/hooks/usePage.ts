import { useRouter, type RouteLocationRaw, type Router } from 'vue-router';
import { mergeRoutePath, openWindow } from '@jialouluo/tools';

function handleError(e: Error) {
	console.error(e);
}

export const useGo = (options: { prefixPath?: string; router?: Router } = {}) => {
	const { prefixPath = '', router = useRouter() } = options;

	const { push, replace } = router;

	const go = (opt: RouteLocationRaw, isReplace: boolean = false, _prefixPath: string = prefixPath) => {
		const _path = typeof opt === 'string' ? opt : opt.path;
		const mergePath = mergeRoutePath(_prefixPath, _path);
		if (/^http/.test(mergePath)) return openWindow(mergePath);

		if (isReplace) {
			replace(typeof opt === 'string' ? mergePath : opt).catch(handleError);
		} else {
			push(typeof opt === 'string' ? mergePath : opt).catch(handleError);
		}
	};
	return go;
};
