import { EffectScope, effectScope, onScopeDispose, ref, nextTick } from 'vue';

export const useSharedScoped = <T extends (...args: any[]) => any>(composable: T) => {
	const count = ref(0);
	const state = ref<ReturnType<typeof composable> | null>();
	const scope = ref<EffectScope | null>();
	const dispose = () => {
		if (scope.value && --count.value <= 0) {
			nextTick(() => {
				scope.value!.stop();
				state.value = scope.value = null;
			});
		}
	};
	return (...args: any[]) => {
		count.value++;
		if (!state.value) {
			scope.value = effectScope(true);
			state.value = scope.value.run(() => composable(...args));
		}

		onScopeDispose(dispose);
		return state;
	};
};
