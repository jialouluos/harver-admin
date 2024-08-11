import { DeepArrayTreeRequired, DeepType, TreeNodeType } from '../types';

export const isFalse = (target: any) => {
	if (!target) return true;
	if (isArray(target)) return !target.length;
	if (typeof target === 'object') return !Object.keys(target).length;
	return false;
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
	}
): R => {
	const { handleFn = obj => obj, filterFn = () => true } = options;
	const newObject = handleFn(target) as R;

	if (prop in target) {
		if (isFalse(target[prop])) return newObject;

		const _children = target[prop];

		if (isArray<T>(_children)) {
			const newValue = _children
				.filter(item => filterFn(item))
				.map(item => {
					return deepHandleObjectFn(item, prop, options);
				}) as R[K];

			newObject[prop] = newValue;
		}
	}

	return newObject;
};
