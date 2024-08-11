import { E_SupportType, HW, pipOptions } from './useInjectGlobalState';
interface RenderInfo {
	text: string;
	x: number;
	y: number;
	w: number;
	h: number;
	fontSize: number;
	i?: Awaited<ImageBitmap>;
	drawCtxStyle: Partial<CanvasTextDrawingStyles> & Partial<CanvasShadowStyles> & Partial<CanvasFillStrokeStyles>;
}
declare const hw: HW;
const PIP_SYMBOL = Symbol('pip');

const PREFIX_BILIBILI_DOM_SEARCH = (document?: Document) => {
	if (!document) return null;
	return (
		document.querySelector('.bpx-player-video-wrap')?.children[0] ||
		document.querySelector('.bilibili-player-video')?.children[0] ||
		document.querySelector('#live-player')?.children[0] ||
		document.querySelector('.container-video')?.children[0]
	);
};

const usePictureInPicture = (options: pipOptions = {}) => {
	const {
		scrolling = false,
		customTarget = false,
		supportTarget = E_SupportType.NONE,
		scrollingInfo = '',
		target = '',
		customScrollingTarget = false,
		supportType = E_SupportType.NONE,
	} = options;
	if (customTarget && target) {
		hw.utils.createCache(PIP_SYMBOL);

		const node = document.querySelector(target);

		if (!node) return alert('未找到该节点');
		const cacheInfo = hw.cacheMap.get(PIP_SYMBOL)!;
		cacheInfo.node = node! as HTMLElement;
		createPIP(PIP_SYMBOL, cacheInfo?.node!, {
			scrolling,
			scrollingInfo,
			customScrollingTarget,
			supportType,
		});
	} else if (supportTarget) {
		switch (supportTarget) {
			case E_SupportType.BILIBILI: {
				hw.utils.createCache(PIP_SYMBOL);
				const node = PREFIX_BILIBILI_DOM_SEARCH(document) || null;
				if (!node) return alert('未找到该节点(暂不支持iframe中节点查询)');

				const cacheInfo = hw.cacheMap.get(PIP_SYMBOL)!;
				cacheInfo.node = node! as HTMLElement;
				return createPIP(PIP_SYMBOL, cacheInfo?.node!, {
					scrolling,
					scrollingInfo,
					customScrollingTarget,
					supportType,
				});
			}
			default: {
				return;
			}
		}
	} else {
		alert('请移动鼠标选择DOM(框住的区域即为想要加入画中画的区域)！选择完成之后点击鼠标左键');

		hw.utils.useSelectDOM(PIP_SYMBOL, 'start');
		const cacheInfo = hw.cacheMap.get(PIP_SYMBOL);
		const handleClickDOM = async () => {
			const flag = await createPIP(PIP_SYMBOL, cacheInfo?.node!, {
				scrolling,
				scrollingInfo,
				customScrollingTarget,
				supportType,
			});
			if (flag) window.removeEventListener('click', handleClickDOM);
		};

		window.addEventListener('click', handleClickDOM);
	}
};

/**@PIP enable */
const createPIP = async (key: string | Symbol, dom: HTMLElement | null, options: pipOptions = {}) => {
	if (!dom) return false;

	hw.utils.useSelectDOM(key, 'close');
	switch (dom.nodeName) {
		case 'VIDEO': {
			videoPIP(dom as HTMLVideoElement, key, options);
			return true;
		}
		default: {
			otherPIP(dom, key);
			return true;
		}
	}
};

const videoPIP = async (videoDOM: HTMLVideoElement, key: string | Symbol, options: pipOptions = {}) => {
	const cacheInfo = hw.cacheMap.get(key);

	if (!cacheInfo || !videoDOM) return;
	const {
		scrolling = false,
		scrollingInfo = '',
		customScrollingTarget = false,
		supportType = E_SupportType.NONE,
	} = options;

	handleScrollingEventBind(key, videoDOM, scrolling); //bind event

	await videoDOM.requestPictureInPicture();
	if (scrolling) {
		cacheInfo.extraInfo.canvasEngine = canvasEngine;
		createScrolling(videoDOM, {
			scrollingInfo,
			customScrollingTarget,
			supportType,
		});
	}

	cacheInfo.extraInfo.pipWindow = null;
};

const otherPIP = async (dom: HTMLElement, key: string | Symbol) => {
	const cacheInfo = hw.cacheMap.get(key);

	if (!cacheInfo || !dom) return;

	const pipOptions = {
		initialAspectRatio: dom.clientWidth / dom.clientHeight,
		lockAspectRatio: true,
		copyStyleSheets: true,
	};
	cacheInfo.extraInfo.pipWindow = await window.documentPictureInPicture.requestWindow(pipOptions);

	[...document.styleSheets].forEach(styleSheet => {
		try {
			const cssRules = [...styleSheet.cssRules].map(rule => rule.cssText).join('');
			const style = document.createElement('style');

			style.textContent = cssRules;
			cacheInfo.extraInfo.pipWindow.document.head.appendChild(style);
		} catch (e) {
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.type = styleSheet.type;
			link.media = styleSheet.media as unknown as string;
			link.href = styleSheet.href as unknown as string;
			cacheInfo.extraInfo.pipWindow.document.head.appendChild(link);
		}
	});

	const wapper = document.createElement('div');
	wapper.style.width = '100%';
	wapper.style.height = '100%';
	wapper.style.overflow = 'auto';
	cacheInfo.extraInfo.pipWindow.document.body.append(wapper);
	wapper.append(dom);
	cacheInfo.beMoved = true;
	cacheInfo.currentParent = wapper;

	// 监听PiP结束事件，将目标放回原位
	cacheInfo.extraInfo.pipWindow.addEventListener(
		'unload',
		() => {
			hw.utils.disCacheDOM(key);
			cacheInfo.extraInfo.pipWindow.close();
		},
		{
			once: true,
		}
	);
};
/**DanMu enable */
const createScrolling = (videoDOM: HTMLVideoElement, options: pipOptions = {}) => {
	const { scrollingInfo = '', customScrollingTarget = false, supportType = E_SupportType.NONE } = options;

	if (customScrollingTarget) {
		if (!scrollingInfo) return;
		const searchDom = document.querySelector(scrollingInfo)!;
		if (!searchDom) return alert('未找到该弹幕根节点');
		createCustomScrolling(videoDOM, searchDom as HTMLElement);
	} else {
		createSupportScrolling(supportType);
	}
};

const handleScrollingEventBind = (key: Symbol | string, videoDOM: HTMLVideoElement, isScrolling: boolean) => {
	if (isScrolling) {
		const _video = canvasEngine.video;
		if (!_video) return;
		canvasEngine.videoEl = videoDOM; //挂载

		_video.addEventListener('play', () => {
			if (videoDOM) {
				videoDOM.play();
			}
		});
		_video.addEventListener('pause', () => {
			if (videoDOM) {
				videoDOM.pause();
			}
		});
		videoDOM.addEventListener('play', () => {
			_video.play();
		});
		videoDOM.addEventListener('pause', () => {
			_video.pause();
		});

		_video.addEventListener(
			'leavepictureinpicture',
			() => {
				canvasEngine.requestAnimationFrameId && cancelAnimationFrame(canvasEngine.requestAnimationFrameId);
				canvasEngine.requestAnimationFrameId = 0;
				canvasEngine.dispose();
				hw.utils.disCacheDOM(key);
			},
			{
				once: true,
			}
		);

		videoDOM.addEventListener(
			'enterpictureinpicture',
			() => {
				render(videoDOM);
				_video.srcObject = canvasEngine.canvas[0].captureStream(60);
			},
			{ once: true }
		);

		_video.addEventListener(
			'loadedmetadata',
			() => {
				_video.requestPictureInPicture();
				_video.play();
			},
			{ once: true }
		);

		if (navigator.mediaSession) {
			try {
				navigator.mediaSession.setActionHandler('play', () => {
					videoDOM.play();
					_video.play();
				});
				navigator.mediaSession.setActionHandler('pause', () => {
					videoDOM.pause();
					_video.pause();
				});
			} catch (err) {
				console.warn('[哔哩哔哩画中画弹幕]', '绑定媒体功能键时发生错误');
			}
		}
	} else {
		videoDOM.addEventListener(
			'leavepictureinpicture',
			() => {
				hw.utils.disCacheDOM(key);
			},
			{
				once: true,
			}
		);
	}
};

const createSupportScrolling = (supportType: E_SupportType) => {
	switch (supportType) {
		case E_SupportType.BILIBILI: {
			const node =
				document.getElementsByClassName('bilibili-player-video-danmaku')[0] ||
				document.getElementsByClassName('bpx-player-row-dm-wrap')[0] ||
				document.getElementsByClassName('web-player-danmaku')[0] ||
				document.getElementsByClassName('danmaku-screen')[0];
			if (!node) return alert('b站根节点未找到，请等待后续修复或填写自定义根节点');

			const observer = createBILIBILIScrolling(node! as HTMLElement);
			//TODO
			return;
		}
	}
};

const createBILIBILIScrolling = (dom: HTMLElement) => {
	const observer = new MutationObserver(e => {
		e.forEach(o => {
			if (o.type == 'childList') {
				o.addedNodes.forEach(ele => {
					if (ele.nodeType === 1) {
						const node: any = ele;
						//Node.ELEMENT_NODE :<p>、<div>
						const text = String(node.innerText) || String(ele.textContent) || '';
						const color = node.style.color || node.style.getPropertyValue('--color');
						const opacity = node.style.opacity || node.style.getPropertyValue('--opacity') || '1';
						if (opacity != '0')
							addScrolling(text.split('\n')[0], {
								drawCtxStyle: {
									fillStyle: color || `rgba(255,255,255,${opacity})`,
								},
							});
					} else if (ele.nodeType === 3) {
						//text
						const node: any = ele;
						//Node.ELEMENT_NODE :<p>、<div>
						const text = String(ele.textContent) || '';

						const color = node.parentNode?.style.color || node.parentNode?.style.getPropertyValue('--color');
						const opacity =
							node.parentNode?.style.opacity || node.parentNode?.style.getPropertyValue('--opacity') || '1';
						if (opacity != '0')
							addScrolling(text.split('\n')[0], {
								drawCtxStyle: {
									fillStyle: color || `rgba(255,255,255,${opacity})`,
								},
							});
					}
				});
			}
		});
	});
	observer.observe(dom, { childList: true, subtree: true });
	canvasEngine.observer = observer;
	return observer;
};

const createCustomScrolling = (videoDOM: HTMLVideoElement, dom: HTMLElement) => {};

const addScrolling = (
	text: string,
	options: {
		fontSize?: number;
		drawCtxStyle?: RenderInfo['drawCtxStyle'];
	} = {}
) => {
	if (!text) return;

	const { fontSize, drawCtxStyle = {} } = options;
	canvasEngine.push({ text, fontSize, drawCtxStyle });
};

class CanvasEngine {
	#canvas: [HTMLCanvasElement, CanvasRenderingContext2D] | null = null;
	#video: HTMLVideoElement | null = null;
	currentRenderQueue: RenderInfo[] = [];
	space: number = 40;
	maxRow: number = 6;
	fontSizeScale: number = 18;
	#canvasInfo: Record<string, any> = {};
	oldTime: number = performance.now();
	requestAnimationFrameId: number = 0;
	static instance: CanvasEngine | null = null;
	observer: MutationObserver | null = null;
	renderLocks = Array.from({ length: this.maxRow })
		.fill(0)
		.map((_, index) => ({
			index: index,
			lock: false,
			offsetWidth: 0,
		}));
	renderQueue: { text: string; fontSize?: number; drawCtxStyle: RenderInfo['drawCtxStyle'] }[] = [];
	constructor() {
		if (CanvasEngine.instance) return CanvasEngine.instance;
		CanvasEngine.instance = this;
	}
	getCanRenderRow(offsetWidth: number) {
		for (const item of this.renderLocks) {
			if (item.lock) continue;
			item.lock = true;
			item.offsetWidth = offsetWidth;
			return item;
		}
		return null;
	}
	unLockRenderRow(subValue: number) {
		for (const item of this.renderLocks) {
			if (item.lock) {
				item.offsetWidth -= subValue;
				if (item.offsetWidth < 0) {
					item.offsetWidth = 0;
					item.lock = false;
				}
			}
		}
	}
	push(info: { text: string; fontSize?: number; drawCtxStyle: RenderInfo['drawCtxStyle'] }) {
		this.renderQueue.push(info);
	}
	dispose() {
		this.observer && this.observer.disconnect();
		this.observer = null;
		this.#canvas = null;
		this.#video = null;
		this.#canvasInfo = {};
	}
	build() {
		if (!this.renderQueue.length) return;

		const item = this.renderQueue.shift()!;

		const info = buildDrawInfo(item.text, { fontSize: item.fontSize, drawCtxStyle: item.drawCtxStyle });

		this.currentRenderQueue.push({ ...info, text: item.text });
	}
	get canRender() {
		return this.renderLocks.some(item => !item.lock);
	}
	get canvas() {
		if (this.#canvas) {
			return this.#canvas;
		} else {
			return this.createCanvas();
		}
	}
	get video() {
		if (this.#video) {
			return this.#video;
		} else {
			return this.createPIPVideo();
		}
	}
	set videoEl(dom: HTMLVideoElement) {
		this.computedCanvasInfo(dom);
	}

	get canvasInfo() {
		// this.computedCanvasInfo(this.#videoEl!);
		return this.#canvasInfo;
	}

	get baseFontSize() {
		return Math.floor(Math.min(this.canvas[0].width, this.canvas[0].height) / this.fontSizeScale);
	}

	createCanvas = () => {
		const canvasDOM = document.createElement('canvas');
		const context2D = canvasDOM.getContext('2d')!;

		this.#canvas = [canvasDOM, context2D!];
		// document.body.append(canvasDOM);
		// canvasDOM.style.width = '500px';
		// canvasDOM.style.height = '500px';
		// canvasDOM.style.position = 'absolute';
		// canvasDOM.style.top = '10px';
		// canvasDOM.style.zIndex = '9999';
		return this.#canvas;
	};
	createPIPVideo = () => {
		this.#video = document.createElement('video');
		return this.#video;
	};
	computedCanvasInfo = (video: HTMLVideoElement) => {
		if (!video) return;
		this.#canvasInfo.width = this.canvas[0].width = video.videoWidth;
		this.#canvasInfo.height = this.canvas[0].height = video.videoHeight;
		this.#canvasInfo.speedScale = 0.3;
	};
	setConfig(config: Record<string, any>) {
		const { space = this.space, maxRow = this.maxRow, fontSizeScale = this.fontSizeScale } = config;
		this.space = space;
		this.fontSizeScale = fontSizeScale;
		if (maxRow !== this.maxRow) {
			if (maxRow < this.maxRow) {
				this.renderLocks = this.renderLocks.slice(0, maxRow);
			} else if (maxRow > this.maxRow) {
				const _renderLocks = Array.from({ length: maxRow - this.maxRow })
					.fill(0)
					.map((_, index) => ({
						index: this.maxRow + index,
						lock: false,
						offsetWidth: 0,
					}));
				this.renderLocks = [...this.renderLocks, ..._renderLocks];
			}
			this.maxRow = maxRow;
		}
	}
	help() {
		console.table({
			space: `弹幕之间的间距'(${this.space})`,
			maxRow: `最大弹幕行数'(${this.maxRow})`,
			fontSizeScale: `弹幕字体大小'(${this.fontSizeScale})`,
		});
	}
}
const canvasEngine = new CanvasEngine();

const buildDrawInfo = (
	text: string,
	options: {
		fontSize?: number;
		drawCtxStyle?: RenderInfo['drawCtxStyle'];
	} = {}
): Omit<RenderInfo, 'text' | 'color'> => {
	const [_, context] = canvasEngine.canvas;
	const { fontSize = canvasEngine.baseFontSize, drawCtxStyle = {} } = options;

	context.font = `${fontSize}px SimHei,"Microsoft JhengHei",Arial,Helvetica,sans-serif`;

	const textWidth = context.measureText(text).width;

	const minOffsetItem = canvasEngine.getCanRenderRow(textWidth + canvasEngine.space);
	if (!minOffsetItem) {
		alert('行信息丢失');
		return {
			x: 0,
			y: 0,
			w: 0,
			h: 0,
			fontSize,
			drawCtxStyle,
		};
	}

	return {
		x: canvasEngine.canvasInfo.width,
		y: fontSize * minOffsetItem.index,
		w: textWidth,
		h: fontSize,
		fontSize,
		drawCtxStyle: {
			textBaseline: 'top',
			shadowBlur: 3,
			shadowColor: 'rgb(0, 0, 0)',
			font: `${fontSize}px SimHei,"Microsoft JhengHei",Arial,Helvetica,sans-serif`,
			...drawCtxStyle,
		},
	};
};

const render = (video: HTMLVideoElement) => {
	if (!video) return;
	const nowTime = performance.now();
	const diffTime = nowTime - canvasEngine.oldTime;
	canvasEngine.oldTime = nowTime;
	const [_, context] = canvasEngine.canvas;
	context.globalAlpha = 1;

	const width = canvasEngine.canvasInfo.width;
	const height = canvasEngine.canvasInfo.height;
	context.clearRect(0, 0, width, height);

	context.drawImage(video, 0, 0, width, height, 0, 0, width, height); //绘制视频

	if (video.readyState >= 1 && !video.paused) {
		//can play
		if (canvasEngine.canRender) {
			//有空闲行
			canvasEngine.build();
		}
		canvasEngine.currentRenderQueue = canvasEngine.currentRenderQueue.filter(item => {
			const rightX = item.x + item.w;
			if (rightX <= 0) return false;
			return true;
		});
		const subValue = diffTime * canvasEngine.canvasInfo.speedScale;
		canvasEngine.unLockRenderRow(subValue);
		for (const item of canvasEngine.currentRenderQueue) {
			item.x -= subValue;
			const { x, y, text, drawCtxStyle } = item;
			const cacheStyle: Record<string, any> = {};
			for (const [key, value] of Object.entries(drawCtxStyle)) {
				cacheStyle[key] = (context as any)[key];
				(context as any)[key] = value;
			}
			context.fillText(text, x, y);
			//复原
			for (const [key, value] of Object.entries(cacheStyle)) {
				(context as any)[key] = value;
			}
		}
	}
	canvasEngine.requestAnimationFrameId = requestAnimationFrame(() => render(video));
};
export const init = () => {
	window.hw.hooks = { ...window.hw.hooks, usePictureInPicture };
	window.hw.globalCache.symbols.push(PIP_SYMBOL);
	return window.hw;
};
