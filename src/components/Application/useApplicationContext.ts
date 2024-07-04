import { MediaEnum } from '@/enums/MediaEnum';
import { createContext, useContext } from '@/hooks/useContext';
import { InjectionKey, Ref } from 'vue';

export interface AppProviderContext {
	prefixCls: Ref<string>;
	mobileType: Ref<MediaEnum[]>;
}

const key: InjectionKey<AppProviderContext> = Symbol('ApplicationContext');

export const createAppProviderContext = (context: AppProviderContext) => {
	return createContext(context, key);
};

export const useAppProviderContext = () => {
	return useContext<AppProviderContext>(key);
};
