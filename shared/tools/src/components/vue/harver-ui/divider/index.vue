<script lang="ts">
import { CSSProperties } from 'vue';
import { useClassName, usePrefixCls } from '../../hooks';
export default {
	name: 'harver-divider',
};
</script>
<script lang="ts" setup>
withDefaults(
	defineProps<{
		content?: string;
		hasPadding?: boolean;
		containerStyle?: CSSProperties;
		contentStyle?: CSSProperties;
	}>(),
	{
		containerStyle: () => ({}),
		contentStyle: () => ({}),
	}
);
const CNGenerator = useClassName({
	split: '-',
	prefixClassName: usePrefixCls,
});
const CN = CNGenerator(Symbol('divider'));
</script>
<template>
	<div
		:class="CN.C('divider', 0)"
		:style="hasPadding ? { ...containerStyle } : { padding: '0', ...containerStyle }">
		<div :class="CN.C('left', 1)"></div>
		<span
			v-if="content"
			:class="CN.C('content', 1)"
			:style="contentStyle"
			>{{ content }}</span
		>
		<div :class="CN.C('right', 1)"></div>
	</div>
</template>
<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';

.#{$prefixCls} {
	&-divider {
		display: flex;
		clear: both;
		list-style: none;
		align-content: center;
		align-items: center;
		box-sizing: border-box;
		margin: rem(1) 0;
		padding: 0 5%;
		width: 100%;
		min-width: 100%;
		line-height: 1.5;
		font-size: 14px;
		color: col(shadow, 0.2);
		color-scheme: light;

		&-left {
			display: flex;
			flex: 1;
			border-block-start: 2px solid col(shadow, 0.2);
		}

		&-content {
			display: flex;
			margin: 0 rem(0.5);
			text-align: center;
			font-weight: 500;
			font-size: rem(1);
			color: col(text-sub-color);
			white-space: nowrap;
		}

		&-right {
			display: flex;
			flex: 1;
			border-block-start: 2px solid col(shadow, 0.2);
		}
	}
}
</style>
