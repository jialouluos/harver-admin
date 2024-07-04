import { RouteMeta } from '@jialouluo/configs/src/configs/packages';
import { RouteRecordRaw } from 'vue-router';

export interface AppRouteModule extends Omit<RouteRecordRaw, 'meta' | 'children'> {
	component?: () => Promise<typeof import('*.vue')>;
	meta: RouteMeta;
	children?: AppRouteModule[];
}
