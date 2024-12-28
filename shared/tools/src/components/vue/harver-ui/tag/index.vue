<script lang="ts">
import Text from '../text/index.vue';
import { useClassName, usePrefixCls } from '../../hooks';
import { CSSProperties } from 'vue';
export default {
	name: 'harver-tag',
};
import { ITagProps } from '@jialouluo/tools/src/types/harver-ui.ts';
</script>

<script lang="ts" setup>
withDefaults(defineProps<ITagProps>(), {
	content: '',
	type: 'primary',
});

const CNGenerator = useClassName({
	split: '-',
	prefixClassName: usePrefixCls,
});
const CN = CNGenerator(Symbol('tag'));
</script>
<template>
	<Text
		v-if="content"
		:class="[CN.C('tag', 0), CN.C(type, 1)]"
		:content
		:width
		:maxWidth
		:ellipsis="{
			rows,
		}"
		:tooltip="tooltip"
		:measure="{
			maxLength,
			supperLazy: true,
		}"
		:style="containerStyle"
		:contentStyle="{...$attrs.style as CSSProperties}" />
</template>
<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';

.harver {
	&-tag {
		@include tag;

		&-primary {
			border: 1px solid col(primary);
			background-color: col(bg-highlight);
			color: col(primary);
		}

		&-sub {
			border: 1px solid col(sub);
			background-color: col(sub, 0.2);
			color: col(text-color);
		}

		&-grey {
			background-color: col(grey-3);
			color: col(text-color);

			/* border: 1px solid col(sub); */
		}
	}
}
</style>
