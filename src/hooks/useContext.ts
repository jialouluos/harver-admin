
import { InjectionKey, reactive, readonly as defineReadonly, inject, provide, UnwrapRef } from "vue";
export interface CreateContextOptions {
    readonly?: boolean;
    native?: boolean;
    createProvider?: boolean;
}
export type ShallowUnWrap<T> = {
    [U in keyof T]: UnwrapRef<T[U]>
};
export const createContext = <T>(context: any, key: InjectionKey<T> = Symbol(), options: CreateContextOptions = {}) => {
    const { readonly = true, native = false, createProvider = true } = options;

    const state = reactive(context);

    const providerState = readonly ? defineReadonly(state) : state;

    createProvider && provide(key, native ? context : providerState);

    return state;
};
export const useContext = <T>(key: InjectionKey<T>, defaultValue?: any): ShallowUnWrap<T> => {
    return inject(key, defaultValue || {});
};