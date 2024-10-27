<script lang="ts" setup>
import { CSSProperties } from 'vue';
import { useClassName, usePrefixCls } from '../../hooks';
withDefaults(defineProps<{
	content?: string;
	hasPadding?: boolean;
	containerStyle?: CSSProperties
	contentStyle?:CSSProperties
}>(), {
	containerStyle: () => ({}),
	contentStyle: () => ({}),
});
const CNGenerator = useClassName({
	split: '-',
	prefixClassName: usePrefixCls,
});
const CN = CNGenerator(Symbol('divider'));
</script>
<template>
	<div
		:class="CN.C('divider', 0)"
		:style="hasPadding ? {...containerStyle} : { padding: '0',...containerStyle }">
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
		align-items: center;
		clear: both;
		padding: 0 5%;
		margin: rem(1) 0;
		width: 100%;
		min-width: 100%;
		font-size: 14px;
		color: col(grey-9, 0.8);
		list-style: none;
		color-scheme: light;
		box-sizing: border-box;
		line-height: 1.5;
		align-content: center;

		&-left {
			display: flex;
			flex: 1;
			border-block-start: 1px solid col(grey-9, 0.1);
		}

		&-content {
			display: flex;
			margin: 0 rem(0.5);
			font-size: rem(1);
			text-align: center;
			white-space: nowrap;
			font-weight: 500;
		}

		&-right {
			display: flex;
			flex: 1;
			border-block-start: 1px solid col(grey-9, 0.1);
		}
	}
}
</style>
