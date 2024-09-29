<script lang="ts" setup>
import Measure from '@jialouluo/tools/src/components/vue/harver-ui/measure/index.vue';
</script>
<template>
	<div class="example_display">
		<div>
			<h4>2行</h4>
			<Measure
				:content="'测试文本-|'.repeat(50)"
				:disabled="false"
				:performance="'high'"
				:rows="3"
				:show-max-length="26"
			>
			</Measure>
			<!-- <Measure
				:rows="1"
				:disabled="false"
				:content="'测试文本-'.repeat(100)">
			</Measure> -->
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
		display: flex;
		flex-wrap: wrap;
		width: 100%;
	}
}
</style>
