<script lang="ts" setup></script>
<template>
	<div>123</div>
	<div class="create_render_layer">
		<p>
			<div>di </div>
		</p>
		<span>span</span>
	</div>
</template>
<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';

.create_render_layer {
	position: relative;

	p{
		position: relative;

		div{
			transform: translateZ(0);
		}
	}
}
</style>
