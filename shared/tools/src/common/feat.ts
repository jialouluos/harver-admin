import { FileHandleInfo, FileInfo, NAME_INFO_ENUM } from '../types';
import type { AppRouteModule } from '@jialouluo/configs';
export enum EDIR {
	LEFT = 'left',
	RIGHT = 'right',
	TOP = 'top',
	BOTTOM = 'bottom',
}
export interface ITooltip {
	key: EDIR;
	enable: boolean;
	pos: { x: number; y: number };
	width: number;
	height: number;
	targetWidth: number;
	targetHeight: number;
}
export interface ArticleMeta {
	updateTime: number;
	parentDir: string;
	name: string;
	ext: string;
	type: NAME_INFO_ENUM;
	[ket: string]: string | number;
}
export function openWindow(
	url: string,
	opt?: { target?: '_self' | '_blank' | string; noopener?: boolean; noreferrer?: boolean }
) {
	const { target = '__blank', noopener = true, noreferrer = true } = opt || {};
	const feature: string[] = [];

	noopener && feature.push('noopener=yes');
	noreferrer && feature.push('noreferrer=yes');

	window.open(url, target, feature.join(','));
}
export const useUploadFileByPick = async (
	options: {
		type?: 'multiple' | 'single' | 'dir';
		scope?: Window;
	} = {}
) => {
	const { type = 'single', scope = window } = options;

	switch (type) {
		case 'single':
		case 'multiple': {
			const handles = await handlePickFile({ type, scope });
			return await handleFiles(handles);
		}
		case 'dir': {
			const handles = await handlePickFileDir({ scope });
			return await handleFiles(handles);
		}
		default: {
			return [];
		}
	}
};
const handlePickFile = async (options: { type?: 'multiple' | 'single'; scope?: Window } = {}) => {
	const { type = 'single', scope = window } = options;
	return new Promise<FileHandleInfo[]>(async (res, rej) => {
		try {
			const handles = await scope.showOpenFilePicker({
				multiple: type === 'multiple',
			});

			res(
				handles.map((item: any) => {
					return {
						parentDir: '',
						handle: item,
					};
				})
			);
		} catch (err) {
			rej(err);
		}
	});
};
const handlePickFileDir = (options: { scope?: Window } = {}) => {
	const { scope = window } = options;
	return new Promise<FileHandleInfo[]>(async (res, rej) => {
		try {
			const handle = await scope.showDirectoryPicker();
			const result = await handleDeepDir(handle, '');
			res(result);
		} catch (err) {
			rej(err);
		}
	});
};
const handleDeepDir = async (handle: any, parentDir: string = '', list: { parentDir: string; handle: any }[] = []) => {
	if (handle.kind === 'file') {
		list.push({
			parentDir,
			handle,
		});
		return list;
	}
	const entries = handle.entries();
	for await (const item of entries) {
		await handleDeepDir(item[1], handle.name, list);
	}
	return list;
};
const loadFiles = (handleArray: FileHandleInfo[]) => {
	return new Promise<FileInfo[]>(async (res, rej) => {
		try {
			const fileArray: FileInfo[] = [];
			const len = handleArray.length;
			for await (const item of handleArray) {
				const file = await item.handle.getFile();
				const reader = new FileReader();

				reader.onload = e => {
					fileArray.push({
						parentDir: item.parentDir,
						context: (e.target?.result as string) ?? '',
						name: file.name,
						lastModified: file.lastModified,
					});
					if (fileArray.length === len) {
						res(fileArray);
					}
				};
				reader.readAsText(file, 'utf-8');
			}
		} catch (err) {
			rej(err);
		}
	});
};
const handleFiles = async (handles: FileHandleInfo[]) => {
	const fileInfos = await loadFiles(handles);
	return fileInfos.map(parseFileInfo);
};
const parseFileInfo = (
	fileInfo: FileInfo
): {
	context: string;
	meta: ArticleMeta;
} => {
	const nameInfo = handleFileName(fileInfo.name);
	if (!nameInfo) throw Error('存在未支持后缀文件！');
	const contextInfo = handleContext(fileInfo.context, nameInfo);
	return {
		context: contextInfo.context,
		meta: {
			...contextInfo.meta,
			...nameInfo,
			updateTime: fileInfo.lastModified,
			parentDir: fileInfo.parentDir,
		},
	};
};
const handleFileName = (name: string) => {
	const RegExpTemplate = (strings: TemplateStringsArray) => {
		return `(?<name>[^\/]*)\.(?<ext>${strings[0]})$`;
	};
	if (name.match(RegExp(RegExpTemplate`md|text|txt`))) {
		return {
			name: RegExp.$1,
			ext: RegExp.$2,
			type: NAME_INFO_ENUM.TEXT,
		};
	} else if (name.match(RegExp(RegExpTemplate`js|ts|jsx|tsx|vue|json`))) {
		return {
			name: RegExp.$1,
			ext: RegExp.$2,
			type: NAME_INFO_ENUM.CODE,
		};
	} else {
		return null;
	}
};
const handleContext = (
	context: string,
	nameInfo: {
		name: string;
		ext: string;
		type: NAME_INFO_ENUM;
	}
): { meta: Record<string, any>; context: string } => {
	if (nameInfo.type === NAME_INFO_ENUM.TEXT) {
		if (/(?<content>.*)##.*Meta.*```json(?<meta>.*)```/s.test(context)) {
			try {
				return { meta: JSON.parse(RegExp.$2.trim()), context: RegExp.$1 };
			} catch {
				console.log('meta信息格式异常');
				return { meta: {}, context };
			}
		} else if (/(?<content>.*)##.*Meta.*```(ts|js)(?<meta>.*)```/s.test(context)) {
			try {
				return { meta: eval(RegExp.$2.trim()), context: RegExp.$1 };
			} catch {
				console.log('meta信息格式异常');
				return { meta: {}, context };
			}
		}
		return { meta: {}, context: context };
	} else if (nameInfo.type === NAME_INFO_ENUM.CODE) {
		return { meta: {}, context: `\`\`\`${nameInfo.ext}\n${context}\n\`\`\`` };
	} else {
		return { meta: {}, context: context };
	}
};
export const getCanPlacementList = (dom: HTMLElement, contentRef: HTMLElement, space: number): ITooltip[] => {
	const { x, y, width: targetWidth, height: targetHeight } = dom.getBoundingClientRect();
	const { width: contentWidth, height: contentHeight } = contentRef.getBoundingClientRect();

	//left
	const leftX = x - (contentWidth + space);
	const leftY = y;
	//top
	const topX = x;
	const topY = y - (contentHeight + space);
	//right
	const rightX = x + targetWidth + space;
	const rightY = y;
	//bottom
	const bottomX = x;
	const bottomY = y + targetHeight + space;
	const flags = <Record<EDIR, ITooltip>>{
		[EDIR.LEFT]: {
			key: EDIR.LEFT,
			enable: true,
			pos: {
				x: leftX,
				y: leftY,
			},
			width: contentWidth,
			height: contentHeight,
			targetWidth: targetWidth,
			targetHeight: targetHeight,
		},
		[EDIR.TOP]: {
			key: EDIR.TOP,
			enable: true,
			pos: {
				x: topX,
				y: topY,
			},
			width: contentWidth,
			height: contentHeight,
			targetWidth: targetWidth,
			targetHeight: targetHeight,
		},
		[EDIR.RIGHT]: {
			key: EDIR.RIGHT,
			enable: true,
			pos: {
				x: rightX,
				y: rightY,
			},
			width: contentWidth,
			height: contentHeight,
			targetWidth: targetWidth,
			targetHeight: targetHeight,
		},
		[EDIR.BOTTOM]: {
			key: EDIR.BOTTOM,
			enable: true,
			pos: {
				x: bottomX,
				y: bottomY,
			},
			width: contentWidth,
			height: contentHeight,
			targetWidth: targetWidth,
			targetHeight: targetHeight,
		},
	}; //left top right bottom

	if (leftX < 0 || leftY + contentHeight > window.innerHeight || leftY < 0) flags.left.enable = false; //left
	if (topY < 0 || topX < 0 || topX + contentWidth > window.innerWidth) flags.top.enable = false; //top
	if (rightX + contentWidth > window.innerWidth || rightY + contentHeight > window.innerHeight || rightY < 0)
		flags.right.enable = false; //right
	if (bottomY + contentHeight > window.innerHeight || bottomX < 0 || bottomX + contentWidth > window.innerWidth)
		flags.bottom.enable = false; //bottom
	return Object.values(flags).filter(item => item.enable);
};

export const getContentHeight = (dom: HTMLElement) => {
	if (!dom) return 0;
	const styleValues = window.getComputedStyle(dom, null);
	const height = dom.clientHeight;

	const attrs = <(keyof CSSStyleDeclaration)[]>['paddingTop', 'paddingBottom'];
	return height - attrs.reduce((total: number, cur) => total + parseFloat(styleValues[cur] as string), 0);
};
export const getContentWidth = (dom: HTMLElement) => {
	if (!dom) return 0;
	const styleValues = window.getComputedStyle(dom, null);
	const width = dom.clientWidth;

	const attrs = <(keyof CSSStyleDeclaration)[]>['paddingLeft', 'paddingRight'];
	return width - attrs.reduce((total: number, cur) => total + parseFloat(styleValues[cur] as string), 0);
};

export function styleToString(style: CSSStyleDeclaration) {
	const styleNames = Array.prototype.slice.apply(style);
	return styleNames.map(name => `${name}: ${style.getPropertyValue(name)};`).join('');
}

export function styleObjectToString(style: Record<string, string>) {
	return Object.keys(style).reduce((acc, name) => {
		const styleValue = style[name];
		if (typeof styleValue === 'undefined' || styleValue === null) {
			return acc;
		}

		acc += `${name}: ${style[name]};`;
		return acc;
	}, '');
}

function resetDomStyles(target: HTMLElement, origin: HTMLElement) {
	target.setAttribute('aria-hidden', 'true');
	const originStyle = window.getComputedStyle(origin);
	const originCSS = styleToString(originStyle);

	// Set shadow
	target.setAttribute('style', originCSS);
	target.style.position = 'fixed';
	target.style.left = '0';
	target.style.height = 'auto';
	target.style.minHeight = 'auto';
	target.style.maxHeight = 'auto';
	target.style.top = '-999999px';
	target.style.zIndex = '-1000';

	//debug
	// target.style.top = '0px';
	// target.style.zIndex = '1000';

	// clean up css overflow
	target.style.textOverflow = 'clip';
	target.style.whiteSpace = 'normal';
	target.style.webkitLineClamp = 'none';
}
const binarySearch = (text: string | ChildNode[], cb: (index: number) => number) => {
	let min = 0,
		max = text.length - 1;

	while (min <= max) {
		const mid = Math.round((max + min) / 2);
		const result = cb(mid);
		max = result > 0 ? mid - 1 : max;
		min = result < 0 ? mid + 1 : min;

		if (result === 0) return mid;
	}
};
export const computedEllipsis = (dom: HTMLElement, contentDOM: HTMLElement, content: string, rows: number) => {
	console.log(312312);
	if (typeof rows === 'undefined' || !dom || !contentDOM)
		return {
			cutIndex: undefined,
			needEllipsis: false,
			needUpdateCutIndex: false,
		};
	//为了拿到clone之后的contentDOM
	const measureId = `__harver_measure__`;
	contentDOM.classList.add(measureId);

	//fix 一行resize时，裁切计算时measureDOM的最大宽度被处理为当前宽度
	const oldWidth = dom.style.width;
	//只有当用户没有显示指定宽度时，才辅助设置宽度100%
	if (!oldWidth) {
		dom.style.width = '100%';
	}

	const measureDOM = dom.cloneNode(true) as HTMLElement;
	const measureHeightDOMByCSS = dom.cloneNode(true) as HTMLElement;

	contentDOM.classList.remove(measureId);

	//由于要脱离原节点，插入到body中，所以需要计算style，避免放入body造成的一些样式丢失，例如width与原容器不一致等
	resetDomStyles(measureHeightDOMByCSS, dom);
	resetDomStyles(measureDOM, dom);
	dom.style.width = oldWidth;

	/**
	 * @ 使用CSS来测量原生多行省略的总高度避免混合行高的场景（比如添加了图片、嵌入不同大小的文字等等）出现错误的裁剪位置
	 */
	const measureHeightContentDOM = measureHeightDOMByCSS.querySelector(`.${measureId}`)! as HTMLElement;

	measureHeightContentDOM.style.display = 'inline'; //为block时 webkitLineClamp 不生效
	measureHeightDOMByCSS.style.webkitBoxOrient = 'vertical';
	measureHeightDOMByCSS.style.display = '-webkit-box';
	measureHeightDOMByCSS.style.overflow = 'hidden';
	measureHeightDOMByCSS.style.webkitLineClamp = `${rows}`;

	//获取预期行数的总高度

	//在style修改完毕之后 添加进body,避免造成多次回流重绘
	document.body.appendChild(measureHeightDOMByCSS);

	const contentHeight = getContentHeight(measureHeightDOMByCSS);
	// const originHeight = getContentHeight(dom);
	document.body.removeChild(measureHeightDOMByCSS);

	if (isNaN(contentHeight) || !contentHeight)
		return {
			cutIndex: undefined,
			needEllipsis: false,
			needUpdateCutIndex: false,
		};

	//开始进行文本裁剪测量
	document.body.appendChild(measureDOM);

	// dom.parentNode?.replaceChild(measureDOM, dom); // 会造成重绘 严重影响性能

	const cloneContentDOM = measureDOM.querySelector(`.${measureId}`)! as HTMLElement;

	const lineHeight = contentHeight / rows;

	const isHasChildrenNodes = cloneContentDOM instanceof HTMLElement && cloneContentDOM.children.length;

	const measureTarget = isHasChildrenNodes
		? Array.prototype.slice.call(cloneContentDOM.childNodes, 0).filter(item => item.nodeType !== 3)
		: content || cloneContentDOM.innerText;
	const idx = binarySearch(measureTarget, cur => {
		if (isHasChildrenNodes) {
			cloneContentDOM.innerHTML = '';
			cloneContentDOM.append(...measureTarget.slice(0, cur));
		} else {
			cloneContentDOM.innerText = measureTarget.slice(0, cur) as string;
		}

		let textHeight = getContentHeight(measureDOM);

		let curRows = Math.round(textHeight / lineHeight);

		if (curRows !== rows) return curRows - rows;

		if (isHasChildrenNodes) {
			cloneContentDOM.innerHTML = '';
			cloneContentDOM.append(...measureTarget.slice(0, cur + 1));
		} else {
			cloneContentDOM.innerText = measureTarget.slice(0, cur + 1) as string;
		}
		textHeight = getContentHeight(measureDOM);

		curRows = Math.round(textHeight / lineHeight);

		return curRows - rows - 1;
	});

	document.body.removeChild(measureDOM);

	return {
		cutIndex: idx,
		needEllipsis: typeof idx === 'undefined' ? false : true,
		needUpdateCutIndex: true,
	};
};
export function importFileRouteSystem<T extends { children?: T[] } = AppRouteModule>(
	modules: Record<string, unknown>,
	options: {
		ignorePath?: string;
		exc?: string;
		rootNode?: undefined;
	}
): T[];
export function importFileRouteSystem<T extends { children?: T[] } = AppRouteModule>(
	modules: Record<string, unknown>,
	options: {
		ignorePath?: string;
		exc?: string;
		rootNode?: T;
	}
): T;
export function importFileRouteSystem<T extends { children?: T[] } = AppRouteModule>(
	modules: Record<string, unknown>,
	options: {
		ignorePath?: string;
		exc?: string;
		rootNode?: T;
	} = {}
): T[] | T {
	const { ignorePath = '', exc = 'route.config.ts', rootNode } = options;
	if (rootNode) {
		rootNode.children ??= [];
	}

	const map = new Map();
	const appModules: T[] = rootNode?.children ?? [];
	const buildModuleTree = (path: string) => {
		const findIndex = path.indexOf(ignorePath);
		const startIndex = findIndex + ignorePath.length;
		let tempPath = '';

		const paths = path
			.slice(findIndex === -1 ? 0 : startIndex)
			.split('/')
			.slice(0, -1)
			.map(item => {
				const parentPath = tempPath;
				tempPath += item + '/';
				return {
					parentPath,
					currentPath: tempPath,
				};
			});

		for (const { parentPath, currentPath } of paths) {
			const module = (modules as Record<string, { default: T }>)[ignorePath + currentPath + exc]?.default;
			if (map.get(parentPath) && !map.has(currentPath)) {
				const parentNode = map.get(parentPath);
				parentNode && (parentNode.children ??= []);
				module && parentNode.children.push(module);
				map.set(currentPath, module);
			} else if (!map.has(currentPath)) {
				module && appModules.push(module);
				map.set(currentPath, module);
			}
		}
	};

	for (const moduleKey of Object.keys(modules)) {
		buildModuleTree(moduleKey);
	}

	return rootNode ? rootNode : appModules;
}
