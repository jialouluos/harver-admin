import type { App, Component } from 'vue';
import { MediaEnum } from '@/enums/MediaEnum';
import { AppRouteModule } from '@/types/Route';

type EventShim = {
	new (...args: any[]): {
		$props: {
			onClick?: (...args: any[]) => void;
		};
	};
};

export type WithInstall<T> = T & {
	install(app: App): void;
} & EventShim;

export type CustomComponent = Component & { displayName?: string };
/**@提供一个额外可以全局注册组件的方式 */
export const withInstall = <T extends CustomComponent>(component: T, alias?: string) => {
	(component as Record<string, unknown>).install = (app: App) => {
		//install在被APP.use时被调用
		const compName = component.name || component.displayName;
		if (!compName) return;
		app.component(compName, component); //被vue实例注册
		if (alias) {
			app.config.globalProperties[alias] = component; //别名
		}
	};
	return component as WithInstall<T>;
};

export const mediaWidthStringTransform = (mediaList: Record<MediaEnum, [number, number] | number>) => {
	return Object.keys(mediaList).reduce((pre, cur) => {
		const value = mediaList[cur as MediaEnum];
		switch (cur) {
			case MediaEnum.PHONE:
			case MediaEnum.PAD:
			case MediaEnum.COMMAND:
			case MediaEnum.NOTEBOOK:
			case MediaEnum.DESKTOP:
			case MediaEnum.TV: {
				pre[cur] = Array.isArray(value)
					? `(min-width: ${value[0]}px) and (max-width: ${value[1]}px)`
					: `(min-width: ${value}px)`;
				return pre;
			}
			default: {
				return pre;
			}
		}
	}, <Record<MediaEnum, string>>{});
};
export function importFileRouteSystem(
	modules: Record<string, unknown>,
	options: {
		ignorePath?: string;
		exc?: string;
		rootNode?: undefined;
	}
): AppRouteModule[];
export function importFileRouteSystem(
	modules: Record<string, unknown>,
	options: {
		ignorePath?: string;
		exc?: string;
		rootNode?: AppRouteModule;
	}
): AppRouteModule;
export function importFileRouteSystem(
	modules: Record<string, unknown>,
	options: {
		ignorePath?: string;
		exc?: string;
		rootNode?: AppRouteModule;
	} = {}
): AppRouteModule[] | AppRouteModule {
	const { ignorePath = '', exc = 'route.config.ts', rootNode } = options;
	if (rootNode) {
		rootNode.children ??= [];
	}

	const map = new Map();
	const appModules: AppRouteModule[] = rootNode?.children ?? [];
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
			const module = (modules as Record<string, { default: AppRouteModule }>)[ignorePath + currentPath + exc]?.default;
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
