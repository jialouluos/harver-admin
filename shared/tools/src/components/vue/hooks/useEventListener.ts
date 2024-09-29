import { reactive, watch, MaybeRef } from 'vue';
import { Ref, onBeforeUnmount, onMounted, unref } from 'vue';
import { useSharedScoped } from './useSharedScoped';
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

export function on<
	T extends MaybeRef<HTMLElement | undefined>,
	K extends keyof HTMLElementEventMap,
	E extends HTMLElementEventMap[K]
>(scope: T, type: K, listener: (this: T, ev: E) => any, options?: boolean | AddEventListenerOptions): () => void;
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
	T extends MaybeRef<HTMLElement | undefined> | Window | Document,
	K extends T extends HTMLElement ? keyof HTMLElementEventMap : keyof WindowEventMap,
	E extends K extends keyof WindowEventMap
		? keyof WindowEventMap[K]
		: K extends keyof HTMLElementEventMap
		? keyof HTMLElementEventMap[K]
		: Event
>(scope: T, type: K, listener: (this: T, ev: E) => any, options?: boolean | AddEventListenerOptions) {
	const _scope = unref<HTMLElement | Window | Document | undefined>(scope);
	if (!_scope) return () => {};
	_scope.addEventListener(type, listener as (this: T, ev: Event) => any, options); //TODO how to fix as ?
	return () => {
		_scope.removeEventListener(type, listener as (this: T, ev: Event) => any);
	};
}
export const useDebounce = (func: (...args: any[]) => any, wait: number, immediate?: boolean) => {
	let timer: ReturnType<typeof setTimeout> | null = null;

	return (...args: any) => {
		if (timer) clearTimeout(timer);
		if (immediate) {
			const callNow = !timer;
			timer = setTimeout(() => {
				timer = null;
			}, wait);
			if (callNow) func.apply(null, args);
		} else {
			timer = setTimeout(() => {
				func.apply(null, args);
			}, wait);
		}
	};
};
const useGlobalEvent = () => {
	const state = reactive<{
		globalEventMap: Map<
			keyof WindowEventMap,
			| {
					runTask: (...args: any[]) => any;
					uuid: number | string | symbol;
					debounce?: number;
			  }[]
		>;
		globalEventDisposeMap: Map<keyof WindowEventMap, ReturnType<typeof createEventTrigger>>;
		uuid: number;
		eventPool: Map<string | number | symbol, Record<string, any>>;
	}>({
		globalEventMap: new Map(),
		globalEventDisposeMap: new Map(),
		uuid: 0,
		eventPool: new Map(),
	});
	const createEventTrigger = (evt: keyof WindowEventMap) => {
		return (...args: any[]) => {
			state.globalEventMap.get(evt)?.forEach(item => {
				item.runTask(...args);
			});
		};
	};

	const onGlobal = <T extends keyof WindowEventMap>(
		evt: T,
		handler: (this: Window, ev: WindowEventMap[T]) => any,
		options: {
			eventOptions?: AddEventListenerOptions;
			eventId?: string | symbol;
			debounce?: number;
		} = {}
	) => {
		const { eventOptions, eventId, debounce } = options;

		if (!state.globalEventMap.has(evt)) {
			state.globalEventMap.set(evt, []);
			const handleEventTypeTrigger = createEventTrigger(evt);
			window.addEventListener(evt, handleEventTypeTrigger, eventOptions ?? {});
			state.globalEventDisposeMap.set(evt, handleEventTypeTrigger);
		}
		const id = eventId ? eventId : state.uuid++;
		state.globalEventMap.get(evt)?.push({
			uuid: id,
			runTask: debounce ? useDebounce(handler, debounce, false) : handler,
		});
		return id;
	};
	const remove = <T extends keyof WindowEventMap>(evt: T, uuid: string | number | symbol) => {
		if (state.globalEventMap.has(evt)) {
			const filterItem = state.globalEventMap.get(evt)?.filter(item => {
				return item.uuid !== uuid;
			});

			state.globalEventMap.set(evt, filterItem ?? []);
			if (!filterItem?.length) {
				offGlobal(evt);
			}
		}
	};

	const offGlobal = (evt: keyof WindowEventMap) => {
		if (state.globalEventDisposeMap.has(evt)) {
			window.removeEventListener(evt, state.globalEventDisposeMap.get(evt)!);
			state.globalEventDisposeMap.delete(evt);
			state.globalEventMap.delete(evt);
		}
	};
	const useScopedEventPool = (scopedId: string | number | symbol) => {
		return {
			mark(eventId: string | number, clearEvent: (...args: any[]) => any) {
				if (!state.eventPool.has(scopedId)) {
					state.eventPool.set(scopedId, {});
				}
				const eventPool = state.eventPool.get(scopedId)!;
				if (eventPool && typeof eventPool[eventId] === 'function') {
					//防止监听事件由于逻辑错误导致原本监听并未清除又被重新赋值
					eventPool[eventId]();
				}
				eventPool && (eventPool[eventId] = clearEvent);
			},
			clear(eventClearKey: string | number) {
				const eventPool = state.eventPool.get(scopedId)!;
				eventPool && typeof eventPool[eventClearKey] === 'function' && eventPool[eventClearKey]();
				eventPool && (eventPool[eventClearKey] = undefined);
			},
			allClear() {
				const eventPool = state.eventPool.get(scopedId)!;
				if (!eventPool) return;
				Object.keys(eventPool).forEach(eventClearKey => {
					typeof eventPool[eventClearKey] === 'function' && eventPool[eventClearKey]();
				});
				state.eventPool.delete(scopedId);
			},
		};
	};
	return {
		state,
		onGlobal,
		remove,
		offGlobal,
		useScopedEventPool,
	};
};
export const useSharedGlobalEvent = useSharedScoped(useGlobalEvent);
