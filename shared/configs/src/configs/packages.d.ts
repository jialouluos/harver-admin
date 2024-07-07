export declare enum PACKAGE_ENUM {
	BASE = 'base',
	DEMO = 'demo',
}
export interface RouteMeta {
	order: number;
	title: string;
	icon?: string;
	isMenu: boolean;
	inMicro: boolean;
}
export interface IMenuConfig {
	meta: RouteMeta;
	name: string;
	path: string;
	children: IMenuConfig[];
}
export interface IMicroConfig {
	name: string;
	entry: string;
	activeRule: string;
	container: string;
	props: Record<string, any>;
}
export interface IPackagesConfig {
	name: string;
	port: number;
	alias: string;
	path: string;
	microConfig?: IMicroConfig;
	menuConfig?: IMenuConfig;
}
export declare const packagesConfig: Record<PACKAGE_ENUM, IPackagesConfig>;
