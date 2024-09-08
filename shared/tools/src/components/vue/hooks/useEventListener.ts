import { Ref, onBeforeUnmount, onMounted, unref } from 'vue';
//TODO 增加防抖
export function useEventListener<
	T extends Ref<HTMLElement | undefined>,
	K extends keyof HTMLElementEventMap,
	E extends HTMLElementEventMap[K]
>(scope: T, type: K, listener: (this: T, ev: E) => any, options?: boolean | AddEventListenerOptions): () => void;
export function useEventListener<T extends Window, K extends keyof WindowEventMap, E extends WindowEventMap[K]>(
	scope: T,
	type: K,
	listener: (this: T, ev: E) => any,
	options?: boolean | AddEventListenerOptions
): () => void;
export function useEventListener<
	T extends Document,
	K extends keyof HTMLElementEventMap,
	E extends HTMLElementEventMap[K]
>(scope: T, type: K, listener: (this: T, ev: E) => any, options?: boolean | AddEventListenerOptions): () => void;
export function useEventListener<
	T extends HTMLElement | Window | Document,
	K extends T extends Ref<HTMLElement> ? keyof HTMLElementEventMap : keyof WindowEventMap,
	E extends K extends keyof WindowEventMap
		? keyof WindowEventMap[K]
		: K extends keyof HTMLElementEventMap
		? keyof HTMLElementEventMap[K]
		: Event
>(scope: T | Ref<T>, type: K, listener: (this: T, ev: E) => any, options?: boolean | AddEventListenerOptions) {
	//TODO perf
	if (!scope) return () => {};

	onMounted(() => {
		const _scope = unref(scope);
		_scope.addEventListener(type, listener as (this: T, ev: Event) => any, options ?? {}); //TODO how to fix as?
	});
	onBeforeUnmount(() => {
		const _scope = unref(scope);
		_scope.removeEventListener(type, listener as (this: T, ev: Event) => any);
	});
	return () => {
		const _scope = unref(scope);
		_scope.removeEventListener(type, listener as (this: T, ev: Event) => any);
	};
}

export function on<T extends HTMLElement, K extends keyof HTMLElementEventMap, E extends HTMLElementEventMap[K]>(
	scope: T,
	type: K,
	listener: (this: T, ev: E) => any,
	options?: boolean | AddEventListenerOptions
): () => void;
export function on<T extends Window, K extends keyof WindowEventMap, E extends WindowEventMap[K]>(
	scope: T,
	type: K,
	listener: (this: T, ev: E) => any,
	options?: boolean | AddEventListenerOptions
): () => void;
export function on<T extends Document, K extends keyof HTMLElementEventMap, E extends HTMLElementEventMap[K]>(
	scope: T,
	type: K,
	listener: (this: T, ev: E) => any,
	options?: boolean | AddEventListenerOptions
): () => void;
export function on<
	T extends HTMLElement | Window | Document,
	K extends T extends HTMLElement ? keyof HTMLElementEventMap : keyof WindowEventMap,
	E extends K extends keyof WindowEventMap
		? keyof WindowEventMap[K]
		: K extends keyof HTMLElementEventMap
		? keyof HTMLElementEventMap[K]
		: Event
>(scope: Ref<T> | T, type: K, listener: (this: T, ev: E) => any, options?: boolean | AddEventListenerOptions) {
	if (!scope) return () => {};
	const _scope = unref(scope);
	_scope.addEventListener(type, listener as (this: T, ev: Event) => any, options); //TODO how to fix as ?
	return () => {
		const _scope = unref(scope);
		_scope.removeEventListener(type, listener as (this: T, ev: Event) => any);
	};
}
