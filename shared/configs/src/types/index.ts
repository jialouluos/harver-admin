export enum PACKAGE_ENUM {
	BASE = 'base',
	DEMO = 'demo',
	ADMIN = 'admin',
}
export enum PORT_ENUM {
	BASE = 5173,
	DEMO = 5174,
	ADMIN = 5175,
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
	name: `@jialouluo/${PACKAGE_ENUM}`;
	entry: `//localhost:${PORT_ENUM}`;
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
