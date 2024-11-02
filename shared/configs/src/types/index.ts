export enum PACKAGE_ENUM {
	BASE = 'base',
	DEMO = 'demo',

	BLOG_ADMIN = 'blog_admin',
}
export enum PORT_ENUM {
	BASE = 5173,
	DEMO = 5174,
	BLOG_ADMIN = 5176,
}
export interface RouteMeta {
	order: number;
	title: string;
	icon?: string;
	isMenu: boolean;
	inMicro: boolean;
	microPath?: string;
}
export interface IMenuConfig {
	meta: RouteMeta;
	name: string;
	path: string;
	children: IMenuConfig[];
}
export interface IMicroConfig {
	name: `@jialouluo/${PACKAGE_ENUM}`;
	// entry: `//localhost:${PORT_ENUM}`;
	entry:string
	activeRule: `/${PACKAGE_ENUM}`;
	container: string;
	props: Record<string, any>;
}
export interface IPackagesConfig {
	name: string;
	port: PORT_ENUM;
	alias: string;
	path: string;
	microConfig?: IMicroConfig;
	menuConfig?: IMenuConfig;
}

import { RouteRecordRaw } from 'vue-router';
// export type Component<T = any> =
// 	| ReturnType<typeof defineComponent>
// 	| (() => Promise<typeof import('*.vue')>)
// 	| (() => Promise<T>);
export interface AppRouteModule extends Omit<RouteRecordRaw, 'meta' | 'children'> {
	meta: RouteMeta;
	children?: AppRouteModule[];
}
