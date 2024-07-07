import type { App, Component } from 'vue';
import { MediaEnum } from '@/enums/MediaEnum';

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
