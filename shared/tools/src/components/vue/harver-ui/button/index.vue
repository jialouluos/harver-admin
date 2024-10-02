<script lang="ts">
import { useClassName, usePrefixCls } from '../../hooks';
export default {
	name: 'harver-button',
};
</script>
<script lang="ts" setup>
withDefaults(
	defineProps<{
		size?: 'small' | 'middle' | 'large';
		shape?: 'round' | 'rect';
	}>(),
	{
		size: 'middle',
		shape: 'rect',
	}
);

const CNGenerator = useClassName({
	split: '-',
	prefixClassName: usePrefixCls,
});
const CN = CNGenerator(Symbol('button'));
</script>

<template>
	<button :class="[CN.R('button', 0), CN.R(shape, 1), CN.R(size, 1)]">
		<span>
			<slot name="default"></slot>
		</span>
	</button>
</template>
<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';
.#{$prefixCls} {
	&-button {
		&-rect {
			@include button(0, 0.25, 'rect');
		}

		&-round {
			@include button(0, 0.2, 'round', 'vivi', 1);
		}

		&-small {
			padding: rem(0.25) rem(0.5);
			font-size: rem(0.6);
		}

		&-middle {
			padding: rem(0.4) rem(0.75);
			font-size: rem(0.8);
		}

		&-large {
			padding: rem(0.5) rem(1);
			font-size: rem(1);
		}
	}
}
</style>
