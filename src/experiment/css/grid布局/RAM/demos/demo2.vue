<script lang="ts" setup>
withDefaults(
	defineProps<{
		count?: number;
	}>(),
	{
		count: 4,
	}
);
</script>
<template>
	<div class="ram_root_auto_fit">
		<div
			v-for="(_, index) in Array(count)"
			class="item">
			{{ index + 1 }}
		</div>
	</div>
</template>
<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';

.ram_root_auto_fit {
	display: grid;
	overflow: auto;
	height: 440px;
	gap: rem(1);
	grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
	@include scrollbar;
	@include scrollbar_hover;

	.item {
		display: flow-root;
		height: 200px;
		background-color: col(primary);
		color: col(text-color);
		@include border_radius(0.5);
		@include flex_center;
	}
}
</style>
