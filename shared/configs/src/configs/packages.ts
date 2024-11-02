import { IPackagesConfig, PACKAGE_ENUM, PORT_ENUM } from '../types';

export default <Record<PACKAGE_ENUM, IPackagesConfig>>{
	[PACKAGE_ENUM.BASE]: {
		name: PACKAGE_ENUM.BASE,
		port: PORT_ENUM.BASE,
		alias: '基座',
		path: '/',
	},
	[PACKAGE_ENUM.DEMO]: {
		name: PACKAGE_ENUM.DEMO,
		port: PORT_ENUM.DEMO,
		alias: '案例',
		path: `/${PACKAGE_ENUM.DEMO}/`,
		microConfig: {
			name: `@jialouluo/${PACKAGE_ENUM.DEMO}`,
			entry: process.env.NODE_ENV === 'production' ? `/${PACKAGE_ENUM.DEMO}` : `//localhost:${PORT_ENUM.DEMO}`,
			activeRule: `/${PACKAGE_ENUM.DEMO}`,
			container: '#micro-container',
			props: {},
		},
		menuConfig: {
			meta: {
				order: 1,
				title: '案例',
				icon: '',
				isMenu: true,
				inMicro: true,
			},
			name: PACKAGE_ENUM.DEMO,
			path: `/${PACKAGE_ENUM.DEMO}`,
			children: [
				{
					name: PACKAGE_ENUM.DEMO,
					path: `:path(.*)*`,
					meta: {
						order: 0,
						title: '',
						icon: '',
						isMenu: false,
						inMicro: true,
					},
				},
			],
		},
	},
	[PACKAGE_ENUM.BLOG_ADMIN]: {
		name: PACKAGE_ENUM.BLOG_ADMIN,
		port: PORT_ENUM.BLOG_ADMIN,
		alias: '博客后台',
		path: `/${PACKAGE_ENUM.BLOG_ADMIN}/`,
		microConfig: {
			name: `@jialouluo/${PACKAGE_ENUM.BLOG_ADMIN}`,
			entry:
				process.env.NODE_ENV === 'production' ? `/${PACKAGE_ENUM.BLOG_ADMIN}` : `//localhost:${PORT_ENUM.BLOG_ADMIN}`,

			activeRule: `/${PACKAGE_ENUM.BLOG_ADMIN}`,
			container: '#micro-container',
			props: {},
		},
		menuConfig: {
			meta: {
				order: 1,
				title: '博客后台',
				icon: '',
				isMenu: true,
				inMicro: true,
			},
			name: PACKAGE_ENUM.BLOG_ADMIN,
			path: `/${PACKAGE_ENUM.BLOG_ADMIN}`,
			children: [
				{
					name: PACKAGE_ENUM.BLOG_ADMIN,
					path: `:path(.*)*`,
					meta: {
						order: 0,
						title: '',
						icon: '',
						isMenu: false,
						inMicro: true,
					},
				},
			],
		},
	},
};
