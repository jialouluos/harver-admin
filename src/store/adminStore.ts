import { defineStore } from 'pinia';
import  { PACKAGE_ENUM } from '@jialouluo/configs';

export const useBlogAdminStore = defineStore(PACKAGE_ENUM.BLOG_ADMIN, {
	persist: {
		// 修改存储中使用的键名称，默认为当前 Store的 id
		key: 'admin-blog',
		// 修改为 sessionStorage，默认为 localStorage
		storage: window.sessionStorage,
		pick: ['token', 'currentUser'],
	},
	state: () =>
		<
			{
				routeMenu: any[];
				showMicroRouteMenu: boolean;
				token: string;
				currentUser: string;
			}
		>{
			token: '',
			currentUser: '',
			routeMenu: [],
			showMicroRouteMenu: false,
		},
	getters: <
		{
			hasToken: (state: any) => boolean;
			microRouteMenu: (state: any) => any[];
		}
	>{
		hasToken: state => state.token.startsWith('Bearer '),
		microRouteMenu: state => (state.showMicroRouteMenu ? state.routeMenu : undefined),
	},
	actions: <
		{
			setToken(this: any, token: string): void;
			clear(this: any): void;
		}
	>{
		setToken(token: string) {
			this.$state.token = token;
		},
		clear() {
			const cacheBlogAdminRoutes = this.microRouteMenu;
			this.$reset();
			this.routeMenu = cacheBlogAdminRoutes;
			window.sessionStorage.clear();
		},
	},
});
