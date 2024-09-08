import { FileHandleInfo, FileInfo, NAME_INFO_ENUM } from '../types';

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
	meta: {
		updateTime: number;
		parentDir: string;
		name: string;
		ext: string;
		type: NAME_INFO_ENUM;
		[ket: string]: string | number;
	};
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
