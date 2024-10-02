<script lang="ts" setup></script>
<template>
	<a-layout-header class="layout_header">
		<div>
			<slot name="feat"></slot>
		</div>
	</a-layout-header>
</template>

<style scoped lang="scss">
@import '@jialouluo/tools/src/components/styles/global';

.layout_header {
	height: rem(6);
	@include card {
		background-color: col(grey-1);
		transform: translateZ(0); // 单独给一个合成层
		& > * {
			padding: rem(0.5) rem(1);
			width: 100%;
			height: 100%;
			@include flex_center {
				place-content: flex-start flex-start;
			}
		}
	}
}
</style>
