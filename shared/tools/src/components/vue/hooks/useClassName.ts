import { computed } from 'vue';
//    任务流
export const useClassName = (
	options: { split?: string; initValues?: string[]; prefixClassName?: string | (() => string) } = {}
) => {
	const namespaces = new Map<Symbol | string, string[]>();

	return (
		uid: Symbol | string,
		_options: { split?: string; initValues?: string[]; prefixClassName?: string | (() => string) } = options
	) => {
		return computed(() => {
			const { split = '-', initValues, prefixClassName = '' } = _options;
			if (Array.isArray(initValues) && initValues.length) {
				namespaces.set(uid, initValues);
			}
			const prefix = typeof prefixClassName === 'function' ? prefixClassName() : prefixClassName;
			const CN = (str: string, layer?: number, id: Symbol | string = uid) => {
				if (!namespaces.has(id)) {
					namespaces.set(id, [`${prefix + split + str}`]);
					return namespaces.get(id)!.at(-1);
				} else if (namespaces.has(id)) {
					const namespace = namespaces.get(id)!;
					if (typeof layer !== 'undefined' && layer < namespace.length) {
						const _layer = Math.max(layer, 0);
						if (_layer === 0) {
							return prefix + split + str;
						} else if (_layer < namespace.length) {
							return namespace[_layer - 1] + split + str;
						}
					} else {
						const className = namespace.at(-1) + split + str;
						namespace.push(className);
						return className;
					}
				}
			};
			const viewCN = (layer: number, id: Symbol | string = uid) => {
				return computed(() => {
					const namespace = namespaces.get(id)!;
					if (!namespace) return prefix;
					return namespace[Math.max(Math.min(layer, namespace.length - 1), 0)];
				});
			};
			const lenCN = (layer: number, id: Symbol | string = uid) => {
				return computed(() => {
					const namespace = namespaces.get(id)!;
					if (!namespace) return prefix;
					return namespace[Math.max(Math.min(layer, namespace.length - 1), 0)];
				});
			};

			return {
				R: CN,
				V: viewCN,
				L: lenCN,
			};
		});
	};
};
