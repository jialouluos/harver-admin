import { defineStore } from 'pinia';
import { PACKAGE_ENUM } from '@jialouluo/configs';
import { useRoute } from 'vue-router';

export const useBasicStore = defineStore(PACKAGE_ENUM.BASE, {
	persist: {
		// 修改存储中使用的键名称，默认为当前 Store的 id
		key: 'basic',
		// 修改为 sessionStorage，默认为 localStorage
		storage: window.sessionStorage,
		pick: [],
	},
	state: () => {
		return {
			isEmbed: false,
			demoKey: '',
		};
	},
	getters: {},
	actions: {
		init() {
			const route = useRoute();

			const embedString = route.query.embed;
			this.isEmbed = embedString === 'true';
			this.demoKey = typeof route.query.demoKey === 'string' ? route.query.demoKey : '';
		},
	},
});
