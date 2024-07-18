 /* eslint-disable */
export const PACKAGE_ENUM = {
	BASE: 'base',
	DEMO: 'demo',
	ADMIN: 'admin',
};

export const packagesConfig = {
	[PACKAGE_ENUM.BASE]: {
		name: PACKAGE_ENUM.BASE,
		port: 5173,
		alias: '基座',
		path: '/',
	},
	[PACKAGE_ENUM.DEMO]: {
		name: PACKAGE_ENUM.DEMO,
		port: 5174,
		alias: '案例',
		path: `/${PACKAGE_ENUM.DEMO}/`,
		microConfig: {
			name: `@jialouluo/${PACKAGE_ENUM.DEMO}`,
			entry: '//localhost:5174',
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
	[PACKAGE_ENUM.ADMIN]: {
		name: PACKAGE_ENUM.ADMIN,
		port: 5175,
		alias: '博客后台',
		path: `/${PACKAGE_ENUM.ADMIN}/`,
		microConfig: {
			name: `@jialouluo/${PACKAGE_ENUM.ADMIN}`,
			entry: '//localhost:5175',
			activeRule: `/${PACKAGE_ENUM.ADMIN}`,
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
			name: PACKAGE_ENUM.ADMIN,
			path: `/${PACKAGE_ENUM.ADMIN}`,
			children: [
				{
					name: PACKAGE_ENUM.ADMIN,
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
