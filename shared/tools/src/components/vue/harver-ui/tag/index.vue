<script lang="ts" setup>
import Text from '../text/index.vue';
import { useClassName, usePrefixCls } from '../../hooks';
withDefaults(
	defineProps<{
		content?: string;
		rows?: number;
		tooltip?: string;
		width?: string | number; //文本宽度
	}>(),
	{
		content: '',
	}
);

const CNGenerator = useClassName({
	split: '-',
	prefixClassName: usePrefixCls,
});
const CN = CNGenerator(Symbol('tag'));
</script>
<template>
	<Text
		:class="[CN.R('tag', 0), CN.R('primary', 1)]"
		:content
		:performance="'low'"
		:width
		:ellipsis="{
			rows,
			tooltip,
			enableTooltip: !!tooltip,
		}"
		lazy
		:style="$attrs.style" />
</template>
<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';

.harver {
	&-tag {
		display: inline-block;
		overflow: hidden;
		padding: rem(0.1) rem(0.2);
		margin-inline-end:rem(0.4);

		/* width: 100%; */
		width: auto;
		height: auto;
		font-size: rem(0.8);

		/* white-space: nowrap; // 不换行 合并多空格 换行符无效 */
		line-height: calc(1.3 * rem(0.8));
		@include border_radius(0.2);

		&-primary {
			color: col(grey-7);
			background-color: col(primary, 0.3);
			border: 1px solid col(primary);
		}

		&-sub {
			color: col(grey-7);
			background-color: col(sub, 0.2);
			border: 1px solid col(sub);
		}
	}
}
</style>
