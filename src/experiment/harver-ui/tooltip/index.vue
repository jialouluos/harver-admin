<script lang="ts" setup>
import tooltip from '@jialouluo/tools/src/components/vue/harver-ui/tooltip/index.vue';
</script>
<template>
	<div class="example_display">
		<tooltip :trigger="'click'">
			<div>
				<span>click触发</span>
			</div>
			<template #content>
				<div>click触发</div>
			</template>
		</tooltip>

		<tooltip :trigger="'hover'">
			<div>
				<span>hover触发</span>
			</div>
			<template #content>
				<div>hover xxxxxx</div>
			</template>
		</tooltip>
	</div>
</template>
<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';

.example_display {
	display: flex;
	align-items: flex-start;
	width: 100%;

	/* height: 100%; */
	gap: rem(1);
	flex-wrap: wrap;
	align-content: flex-start;

	& > span {
		@include button;
	}
}
</style>
