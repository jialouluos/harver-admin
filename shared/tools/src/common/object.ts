import { DeepArrayTreeRequired, DeepType, TreeNodeType } from '../types';

export const isFalsy = (target: any) => {
	if (!target) return true;
	if (isArray(target)) return !target.length;
	if (typeof target === 'object') return !Object.keys(target).length;
	return false;
};
export const isNoZeroFalsy = (target: any) => {
	return !Number.isFinite(target) && isFalsy(target);
};
export const isPositiveInit = (target: any): target is number => {
	return Number.isFinite(target) && target > 0;
};
export const isArray = <T>(target: unknown): target is T[] => {
	return Array.isArray(target);
};
/**
 *
 * @param target
 * @param prop
 * @param options object
 * @options dropFn:返回值决定当前项的哪些子项被filter出去
 *
 *
 * @returns
 */
export const deepHandleObjectFn = <
	T extends object,
	_T extends DeepArrayTreeRequired<T> = DeepArrayTreeRequired<T>,
	K extends Extract<keyof TreeNodeType<_T>, string> = Extract<keyof TreeNodeType<_T>, string>,
	_R extends object = T,
	R extends DeepType<_T, K, _R> = DeepType<_T, K, _R>
>(
	target: T,
	prop: K,
	options: {
		handleFn?: (obj: T) => _R;
		filterFn?: (obj: T) => boolean;
		handleNextNodes?: (obj: R[K]) => R[K];
	}
): R => {
	const { handleFn = obj => obj, filterFn = () => true, handleNextNodes = obj => obj } = options;
	const newObject = handleFn(target) ;

	if (target[prop] || newObject[prop] ) {
		if (isFalsy(target[prop]) && isFalsy(newObject[prop])) return newObject as R;

		const _children = newObject[prop] ||  target[prop] ;

		if (isArray<T>(_children)) {
			const newValue = _children
				.filter(item => filterFn(item))
				.map(item => {
					return deepHandleObjectFn(item, prop, options);
				}) as R[K];

			newObject[prop] = handleNextNodes(newValue);
		}
	}

	return newObject as R;
};

export const deepFilterTree = <
	T extends object,
	_T extends DeepArrayTreeRequired<T> = DeepArrayTreeRequired<T>,
	K extends Extract<keyof TreeNodeType<_T>, string> = Extract<keyof TreeNodeType<_T>, string>
>(
	target: T | T[] = [],
	prop: K,
	options: {
		filterFn?: (obj: T) => boolean;
	}
): T | T[]|undefined => {
	const { filterFn = () => true } = options;

	const resultArray: T[] = [];

	const handleArray = (Array.isArray(target) ? target : target[prop]) ?? [];

	for (const object of handleArray as T[]) {
		if (filterFn(object)) {
			resultArray.push(...([deepFilterTree(object, prop, options)].flat(2) as T[]));
		} else {
			resultArray.push(...(deepFilterTree(object[prop] as T[], prop, options) as T[]));
		}
	}

	if (Array.isArray(target)) {
		return resultArray
	} else {
		return filterFn(target)
			? {
					...target,
					[prop]:  isFalsy(resultArray) ? undefined : resultArray
			  }
			: resultArray;
	}
};
