<script lang="ts">
import { useClassName, usePrefixCls } from '../../hooks';
export default {
	name: 'harver-blockquote',
};
</script>
<script lang="ts" setup>
const CNGenerator = useClassName({
	split: '-',
	prefixClassName: usePrefixCls,
});
const CN = CNGenerator(Symbol('blockquote'));
</script>

<template>
	<blockquote :class="[CN.C('blockquote', 0)]">
		<slot></slot>
	</blockquote>
</template>
<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';
.#{$prefixCls} {
	&-blockquote {
		margin: rem(1) 0;
		padding: rem(0.3) rem(1);
		border: 2px solid col(primary);
		background-color: col(bg-highlight);
		backdrop-filter: blur(4px);
		font-size: rem(0.8);
		color: col(text-color);
		@include border_radius(0.4);
	}
}
</style>
