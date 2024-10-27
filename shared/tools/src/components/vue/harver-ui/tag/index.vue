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
		display: inline-block;

		// overflow: hidden; // 会造成合成层增加
		padding: rem(0.1) rem(0.2);

		/* width: 100%; */

		/* width: auto; */
		height: auto;

		/* white-space: nowrap; // 不换行 合并多空格 换行符无效 */
		line-height: calc(1.3);
		font-size: rem(0.8);
		margin-inline-end: rem(0.4);
		@include border_radius(0.2);

		&-primary {
			border: 1px solid col(primary);
			background-color: col(bg-primary);
			color: col(strong-primary);
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
