import { RouteMeta } from '@jialouluo/configs';
import { RouteRecordRaw } from 'vue-router';
// export type Component<T = any> =
// 	| ReturnType<typeof defineComponent>
// 	| (() => Promise<typeof import('*.vue')>)
// 	| (() => Promise<T>);
export interface AppRouteModule extends Omit<RouteRecordRaw, 'meta' | 'children'> {
	meta: RouteMeta;
	children?: AppRouteModule[];
}
