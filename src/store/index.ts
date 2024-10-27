import { useBlogAdminStore } from './adminStore';
import { useBasicStore } from './basicStore';

export const useStore = () => ({
	basicStore: useBasicStore(),
	blogAdminStore: useBlogAdminStore(),
});
export type TStore = ReturnType<typeof useStore>;
export type FixSStore<T extends TStore = TStore> = T;
