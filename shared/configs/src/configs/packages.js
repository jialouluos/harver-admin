export const PACKAGE_ENUM = {
	BASE: 'base',
	DEMO: 'demo',
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
			name: '@jialouluo/demo',
			entry: '//localhost:5174',
			activeRule: `/${PACKAGE_ENUM.DEMO}`,
			container: '#micro_container',
			props: {},
		},
		menuConfig: {
			meta: {
				order: 1,
				title: '案例',
				icon: '',
				isMenu: true,
			},
			name: PACKAGE_ENUM.DEMO,
			path: `/${PACKAGE_ENUM.DEMO}`,
			children: [
				{
					name: `${PACKAGE_ENUM.DEMO}-SHOW`,
					path: `/:path(.*)*`,
					meta: {
						order: 0,
						title: '',
						icon: '',
						isMenu: false,
					},
				},
			],
		},
	},
};
