export const isFalse = (target: any) => {
	if (!target) return true;
	if (typeof target === 'object') return !Object.keys(target).length;
	console.log(typeof target, target);
	return false;
};
export const isArray = <T>(target: unknown): target is T[] => {
	return Array.isArray(target);
};

/**@从一种类型中筛选出满足另一种类型的元素 */
type PickTypeFilter<T extends object, F> = {
	[U in keyof T as T[U] extends Function | F ? (T[U] extends F ? U : never) : never]-?: T[U];
};
type DeepType<T extends object, K extends keyof T, R extends object> =
	| {
			[U in keyof T as U extends K ? U : never]: (DeepType<T, K, R> & R)[];
	  } & R;
type DeepRequired<T extends object> = {
	[U in keyof T]-?: T[U] extends Function ? T[U] : T[U] extends object ? DeepRequired<T[U]> : T[U];
};
type GraftType<T extends object, K extends keyof T, R extends object> = R & Record<K, T[K]>;
type OmitType<T, F> = {
	[U in keyof T as T[U] extends F ? never : U]-?: T[U];
};
export const deepHandleObjectFn = <
	T extends DeepRequired<object>,
	K extends keyof OmitType<T, string | number | symbol | Function | boolean>,
	_R extends object = T,
	R extends DeepType<T, K, _R> = DeepType<T, K, _R>
>(
	target: T,
	prop: K,
	options: {
		handleFn?: (obj: T) => _R | T;
		breakFn?: (obj: T) => boolean;
	}
): R => {
	const { handleFn = obj => obj, breakFn = () => false } = options;
	const newObject = handleFn(target) as unknown as R;

	if (breakFn(target)) return newObject;

	if (prop in target) {
		if (isFalse(target[prop])) return newObject;

		const _children = target[prop];

		if (isArray<T>(_children)) {
			newObject[prop] = _children.map(item => {
				return deepHandleObjectFn(item, prop, options);
			}) as R[K];
		}
	}

	return newObject;
};
