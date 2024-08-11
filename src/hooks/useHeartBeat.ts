import { watch } from 'vue';
import { useWebWorker } from './useWebWorker';
import { useReceiveBCState } from './useBCState';

export const useHeartBeat = async (
	namespaces: string,
	handleFn: (value: any) => void,
	options: {
		space?: number;
	}
) => {
	const { space = 5000 } = options;
	const state = useReceiveBCState(namespaces, {});
	watch(
		() => state.value,
		() => {
			const hasFocus = document.hasFocus();

			if (hasFocus) return;
			handleFn(state.value);
		}
	);

	const porxy = useWebWorker(() => {
		return {
			heartCheck: (namespaces: string, space: number) => {
				const channel = new BroadcastChannel(`${namespaces}__broadcast`);
				const state = { key: namespaces, type: 'heart_beat', value: null };

				setInterval(() => {
					channel.postMessage(state);
				}, space);
			},
		};
	});
	await porxy.heartCheck(namespaces, space);
};
