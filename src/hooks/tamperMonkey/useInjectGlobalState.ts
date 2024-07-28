type MyCSSStyleDeclaration = Omit<CSSStyleDeclaration, 'length' | 'parentRule'>;

interface CACHE<E extends object = Record<string, any>> {
	node: HTMLElement | null;
	styles: [keyof MyCSSStyleDeclaration, any][];
	nodeLastParent: HTMLElement | null; //之前的父节点
	currentParent: HTMLElement | null; //现在的父节点
	extraInfo: E;
	beMoved: boolean;
}

export interface pipOptions {
	scrolling?: boolean;
	scrollingInfo?: string;
	target?: string;
	supportTarget?: E_SupportType;
	customTarget?: boolean;
	customScrollingTarget?: boolean;
	supportType?: E_SupportType;
}
export enum E_SupportType {
	BILIBILI = 'bilibili',
	NONE = '',
}
export interface HW {
	config: {
		PIP: {
			selectedStyle: Partial<MyCSSStyleDeclaration>;
		};
	};
	globalCache: {
		inChoosing: boolean; //是否处于选择DOM阶段
		symbols: (Symbol | string)[];
	};
	utils: Record<string, (...args: any[]) => any>;
	cacheMap: Map<string | Symbol, CACHE>;
	hooks: {
		usePictureInPicture?: (options: pipOptions) => void;
	};
}
declare const hw: HW;

const _useSelectDOM = (action: 'start' | 'close', handleFn: (evt: MouseEvent) => void, clearFN?: () => void) => {
	if (action === 'start' && !hw.globalCache.inChoosing) {
		window.addEventListener('mousemove', handleFn);
		hw.globalCache.inChoosing = true;
	} else {
		window.removeEventListener('mousemove', handleFn);
		hw.globalCache.inChoosing = false;
		clearFN && clearFN();
	}
};
const createCache = (key: string | Symbol) => {
	if (!hw.cacheMap.has(key)) {
		hw.cacheMap.set(key, {
			node: null,
			styles: [],
			nodeLastParent: null,
			currentParent: null,
			extraInfo: {
				handleSelectFn: (evt: MouseEvent) => {
					handleSelectDOM(evt, key);
				},
			},
			beMoved: false,
		});
	}
};
const useSelectDOM = (key: string | Symbol, action: 'start' | 'close', clearFN?: () => void) => {
	//处理key
	createCache(key);
	_useSelectDOM(action, hw.cacheMap.get(key)!.extraInfo?.handleSelectFn, clearFN);
};

const handleSelectDOM = (evt: MouseEvent, key: string | Symbol) => {
	if (evt.target instanceof HTMLElement && hw.cacheMap.has(key)) {
		resetDOM(key);

		const node = evt.target as HTMLElement;
		const cacheInfo = hw.cacheMap.get(key)!;

		const rawDisplay = node.style.display;
		node.style.display = 'none';

		cacheInfo.node = node;
		cacheInfo.nodeLastParent = node.parentElement;

		const styleEntries = Object.entries(hw.config.PIP.selectedStyle) as unknown as [keyof MyCSSStyleDeclaration, any][];

		for (const item of styleEntries) {
			cacheInfo.styles.push([item[0], node.style[item[0]]]);
			node.style[item[0]] = item[1];
		}

		node.style.display = rawDisplay;
	}
};

const resetDOM = (key: string | Symbol) => {
	const cacheInfo = hw.cacheMap.get(key);

	if (!cacheInfo) return;

	//复原样式
	const node = cacheInfo.node;

	if (!node) return;

	for (const item of cacheInfo.styles) {
		node.style[item[0] as any] = item[1];
	}
	cacheInfo.styles = [];
	//复原树结构
	const beMoved = cacheInfo.beMoved;
	cacheInfo.beMoved = false;
	if (!beMoved) return;

	const parentNode = cacheInfo.nodeLastParent;
	cacheInfo.nodeLastParent = null;
	if (!parentNode) return;

	parentNode.append(node); //原节点同层级的顺序会不同，如果影响严重再change
	cacheInfo.node = null;
};

const disCacheDOM = (key: string | Symbol) => {
	resetDOM(key);
	hw.cacheMap.delete(key);
};

export const init = () => {
	window.hw = {
		config: {
			PIP: {
				selectedStyle: {
					border: '3px #9428e1 solid',
				},
			},
		},
		cacheMap: new Map(),
		globalCache: {
			inChoosing: false,
			symbols: [],
		},
		utils: {
			useSelectDOM,
			disCacheDOM,
			resetDOM,
			handleSelectDOM,
			createCache,
			_useSelectDOM,
		},
		hooks: {},
	};
	return window.hw;
};
