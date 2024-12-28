<script lang="ts">
import { useClassName, usePrefixCls } from '../../hooks';
export default {
	name: 'harver-i-code',
};
</script>
<script lang="ts" setup>
const CNGenerator = useClassName({
	split: '-',
	prefixClassName: usePrefixCls,
});
const CN = CNGenerator(Symbol('i-code'));
</script>

<template>
	<code :class="[CN.C('i-code', 0)]">
		<slot></slot>
	</code>
</template>
<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';
.#{$prefixCls} {
	&-i-code {
		@include tag;

		line-height: 1;
		font-family: jetbrains-mono, consolas, Menlo, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
		color: col(sub);
		margin-inline-end: 0;
	}
}
</style>
