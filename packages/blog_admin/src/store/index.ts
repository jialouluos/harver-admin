/**
 * @see packages\blog_admin\src\main.ts
 * @see src\store\index.ts
 */

import { reactive } from 'vue';

import { FixSStore } from '../../../../src/store';
//how to fix no action type ?

const useGlobalStore = () => {
	const globalStore = () => reactive({}); //如果处理子应用中，则接收上层主应用的store，否则使用自身的store，自身的store无持久存储
	return { globalStore };
};
const sharedStore = useGlobalStore();

export const insertGlobalStore = (store: FixSStore) => {
	sharedStore.globalStore = () => store;
};

export const useStore = (): FixSStore => {
	return sharedStore.globalStore() as FixSStore;
	// const instance = getCurrentInstance();
	// return instance?.appContext?.config?.globalProperties?.useStore?.() ?? {};
};
