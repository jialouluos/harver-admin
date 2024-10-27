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
			/**
			 * @desc 会往当前的namespaces新增path
			 * @param str 需要附加的className path
			 * @param layer 层级
			 * @param id
			 * @returns 处理之后的className
			 *
			 * @`示例 例如 prefixCls为harver,split为-`
			 * @`如果层级超过最大层级(以0开始)，那么在生成className的同时还会往namespaces中添加最新的className`
			 * @`如果没有超过最大层级，那么只会生成以传入的layer层级对应的className`
			 * @```CN.C('modal'，0)``` -> ```harver-modal```    namespaces:['harver-modal']
			 * @继续使用  `CN.C('header',1)`  -> ```harver-modal-header```    namespace:['harver-modal','harver-modal-header']
			 * @`现在数组中存在两个值,那么最大层级就是1(数组长度-1)`
			 * @继续使用```CN.C('nomaxlayer',1)```  -> ```harver-modal-nomaxlayer```  namespace依旧为['harver-modal','harver-modal-header'],不会更新为['harver-modal','harver-modal-nomaxlayer']
			 */
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
			/**
			 * @desc 会覆盖掉已有的namespaces paths
			 * @param str 需要附加的className path
			 * @param layer 层级
			 * @param id
			 * @returns 处理之后的className
			 *
			 * @`示例 例如 prefixCls为harver,split为-`
			 * @`如果层级超过最大层级(以0开始)，那么在生成className的同时还会往namespaces中添加最新的className`
			 * @`如果没有超过最大层级，那么不仅会生成以传入的layer层级对应的className，还会更新当前的namespaces`
			 * @```CN.C('modal'，0)``` -> ```harver-modal```    namespaces:['harver-modal']
			 * @继续使用  `CN.C('header',1)`  -> ```harver-modal-header```    namespace:['harver-modal','harver-modal-header']
			 * @`现在数组中存在两个值,那么最大层级就是1(数组长度-1)`
			 * @继续使用```CN.R('nomaxlayer',1)```  -> ```harver-modal-nomaxlayer```  namespace会更新为['harver-modal','harver-modal-nomaxlayer']
			 */
			const RCN = (str: string, layer: number, id: Symbol | string = uid): string => {
				if (!namespaces.has(id)) {
					namespaces.set(id, [`${prefix + split + str}`]);
					return namespaces.get(id)!.at(-1)!;
				} else if (namespaces.has(id)) {
					const namespace = namespaces.get(id)!;
					if (typeof layer !== 'undefined' && layer < namespace.length) {
						const _layer = Math.max(layer, 0);
						if (_layer === 0) {
							return prefix + split + str;
						} else if (_layer < namespace.length) {
							namespace.length = _layer;
							return RCN(str, layer);
						}
					} else {
						const className = namespace.at(-1) + split + str;
						namespace.push(className);
						return className;
					}
				}
				return '';
			};
			/**
			 * @description 完成className时需要调用
			 * @param id
			 */
			const FCN = (id: Symbol | string = uid) => {
				if (namespaces.has(id)) {
					const namespace = namespaces.get(id)!;
					namespace.length = 1;
				}
				return '';
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
				R: RCN,
				C: CN,
				V: viewCN,
				L: lenCN,
				F: FCN,
			};
		});
	};
};
