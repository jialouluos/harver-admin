<script lang="ts">
import { defineComponent, onUnmounted, ref } from 'vue';
import { createAppProviderContext } from '@/components/Application/useApplicationContext.ts';
import { useMediaType } from '@/hooks/useMedia';
import { prefixCls } from '@/setting/designSetting';

export default defineComponent({
	name: 'AppProvider',

	setup(_, { slots }) {
		const { mediaState, stop } = useMediaType();

		createAppProviderContext({
			prefixCls: ref(prefixCls),
			mobileType: mediaState,
		});

		onUnmounted(() => {
			stop();
		});

		return () => slots.default?.();
	},
});
</script>
