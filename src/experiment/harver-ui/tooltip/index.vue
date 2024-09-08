<script lang="ts" setup>
import tooltip from '@jialouluo/tools/src/components/vue/harver-ui/tooltip/index.vue';
</script>
<template>
	<div class="example_display">
		<div>
			<tooltip :trigger="'click'">
				click触发
				<template #content>
					<div>click xxxxxx</div>
				</template>
			</tooltip>
		</div>
		<div>
			<tooltip :trigger="'hover'">
				hover触发
				<template #content>
					<div>hover xxxxxx</div>
				</template>
			</tooltip>
		</div>
	</div>
</template>
<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';

.example_display {
	display: flex;
	align-items: flex-start;
	width: 100%;
	height: 100%;
	gap: rem(1);
	flex-wrap: wrap;

	& > div {
		@include button;
	}
}
</style>
