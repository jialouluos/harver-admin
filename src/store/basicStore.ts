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
		};
	},
	getters: {},
	actions: {
		init() {
			const route = useRoute();

			const embedString = route.query.embed;
			if (embedString === 'true') {
				this.isEmbed = true;
			} else {
				this.isEmbed = false;
			}
			console.log(this.isEmbed);
		},
	},
});
