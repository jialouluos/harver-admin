<script lang="ts">
import { useClassName, usePrefixCls } from '../../hooks';
export default {
	name: 'harver-md',
};
</script>
<script lang="ts" setup>
const CNGenerator = useClassName({
	split: '-',
	prefixClassName: usePrefixCls,
});
const CN = CNGenerator(Symbol('md'));
</script>

<template>
	<div :class="[CN.C('md', 0)]">
		<slot></slot>
	</div>
</template>
<style lang="scss">
@import '@jialouluo/tools/src/components/styles/global';
@import '@jialouluo/tools/src/components/styles/article_style_primary';
.#{$prefixCls} {
	&-md {
		white-space: pre-wrap;
		@include export_style;
	}
}
</style>
