<script lang="ts" setup>
import { useClassName, usePrefixCls } from '../../hooks';
withDefaults(
	defineProps<{
		valueRef?: string | HTMLElement;
	}>(),
	{
		valueRef: '',
	}
);
const CNGenerator = useClassName({
	split: '-',
	prefixClassName: usePrefixCls,
});
const CN = CNGenerator(Symbol('copy'));

const copyText = async (ref: string | HTMLElement) => {
	const val = ref instanceof HTMLElement ? ref.innerText : ref;

	try {
		if (navigator.clipboard && navigator.permissions) {
			await navigator.clipboard.writeText(val);
		}
	} catch (err) {
		try {
			const textArea = document.createElement('textArea') as HTMLTextAreaElement;
			textArea.value = val;
			textArea.style.width = '0px';
			textArea.style.position = 'fixed';
			textArea.style.left = '-999px';
			textArea.style.top = '10px';
			textArea.setAttribute('readonly', 'readonly');
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand('copy');
			document.body.removeChild(textArea);
		} catch (err2) {
			console.error(err || err2 || 'copy error');
		}
	}
};
</script>
<template>
	<span
		:class="CN.C('copy', 0)"
		@click="() => copyText(valueRef)">
		{{ '复制' }}
	</span>
</template>
<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';

.#{$prefixCls} {
	&-copy {
		padding: 0 rem(0.2);
		margin: 0 rem(0.4);
		font-size: rem(0.8);
		color: col(strong-primary);
		@include pointer;
		@include text_hover;
	}
}
</style>
