import type { App, Component } from 'vue';

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
export const useWithInstall = <T extends CustomComponent>(component: T, alias?: string) => {
	(component as Record<string, unknown>).install = (app: App) => {
		//install在被APP.use时被调用
		console.log(component.name);
		const compName = component.name || component.displayName;
		if (!compName) return;
		app.component(compName, component); //被vue实例注册
		if (alias) {
			app.config.globalProperties[alias] = component; //别名
		}
	};
	return component as WithInstall<T>;
};
