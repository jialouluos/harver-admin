import { onMounted, ref, Ref, toRaw, toRef, UnwrapRef, watch } from 'vue';

type StateInit<T> = T extends any ? T | (() => void | T) : never;
interface IProps<T> {
	namespaces: string;
	onmessage?: (e: MessageEvent<T>) => void;
	onmessageerror?: (e: MessageEvent<T>) => void;
}
export const useSendBCState = <T>(namespaces: string, initState: T): Ref<UnwrapRef<T>> => {
	const state = ref(initState);

	const channel = new BroadcastChannel(`${namespaces}__broadcast`);
	watch(
		() => state.value,
		() => {
			channel.postMessage(toRaw(state.value));
		},
		{
			deep: true,
		}
	);
	return state;
};
export const useReceiveBCState = <T>(
	namespaces: string,
	{ onmessage, onmessageerror }: Omit<IProps<T>, 'namespaces'>
): Ref<UnwrapRef<T> | null> => {
	const state = ref<T | null>(null);
	const channel = new BroadcastChannel(`${namespaces}__broadcast`);

	const handleSuccess = (e: MessageEvent<T>) => {
		onmessage ? onmessage(e) : (state.value = ref(e.data).value);
	};

	const handleError = (e: MessageEvent<T>) => {
		onmessageerror ? onmessageerror(e) : console.error(e);
	};
	onMounted(() => {
		channel.addEventListener('message', handleSuccess);
		channel.addEventListener('messageerror', handleError);
		return () => {
			//dispose
			channel.removeEventListener('message', handleSuccess);
			channel.removeEventListener('messageerror', handleError);
		};
	});

	return state;
};
export const useSyncBCState = <T>(
	{ namespaces, onmessage, onmessageerror }: IProps<T>,
	initState: StateInit<T>
): Ref<UnwrapRef<T>> => {
	const state = ref<T>(typeof initState === 'function' ? initState() : initState);
	const channel = new BroadcastChannel(`${namespaces}__broadcast`);

	const handleSuccess = (e: MessageEvent<T>) => {
		onmessage ? onmessage(e) : (state.value = ref(e.data).value);
	};

	const handleError = (e: MessageEvent<T>) => {
		onmessageerror ? onmessageerror(e) : console.error(e);
	};

	onMounted(() => {
		channel.addEventListener('message', handleSuccess);
		channel.addEventListener('messageerror', handleError);
		return () => {
			//dispose
			channel.removeEventListener('message', handleSuccess);
			channel.removeEventListener('messageerror', handleError);
		};
	});
	watch(
		() => state.value,
		() => {
			channel.postMessage(toRaw(state));
		}
	);

	return state;
};
