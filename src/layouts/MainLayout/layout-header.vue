<script lang="ts" setup></script>
<template>
	<a-layout-header class="layout_header">
		<div>
			<slot name="feat"></slot>
		</div>
	</a-layout-header>
</template>

<style scoped lang="scss">
@import '@/styles/global';

.layout_header {
	height: rem(6);

	@include supper_box(0.5) {
		& > * {
			padding: rem(0.5) rem(1);
			width: 100%;
			height: 100%;

			@include flex_center {
				justify-content: flex-start;
			}
		}
	}
}
</style>
