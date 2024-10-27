<script lang="ts" setup>
import tags from '@jialouluo/tools/src/components/vue/harver-ui/tags/index.vue';
</script>
<template>
	<div class="example_display">
		<div>
			<tags
				:ellipsis="{
					rows: 2,
					type: '+n',
				}"
				:measure="{}"
				:content="[
					{
						width: 100,
						content: '牛马杰杰爆',
					},
					{
						width: 100,
						content: '牛马杰杰爆',
					},
					{
						width: 100,
						content: '牛马杰杰爆',
					},
					{
						width: 100,
						content: '牛马杰杰爆',
					},
					{
						width: 100,
						content: '牛马杰杰爆',
					},
					{
						width: 100,
						content: '牛马杰杰爆',
					},
					{
						width: 100,
						content: '牛马杰杰爆',
					},
					{
						width: 100,
						content: '牛马杰杰爆',
					},
					{
						width: 100,
						content: '牛马杰杰爆',
					},
					{
						width: 100,
						content: '牛马杰杰爆',
					},
					{
						width: 100,
						content: '牛马杰杰爆',
					},
					{
						width: 100,
						content: '牛马杰杰爆',
					},
					{
						width: 100,
						content: '牛马杰杰爆',
					},
					{
						width: 100,
						content: '牛马杰杰爆',
					},
					{
						width: 100,
						content: '牛马杰杰爆',
					},
					{
						width: 100,
						content: '牛马杰杰爆',
					},
					{
						width: 100,
						content: '牛马杰杰爆',
					},
					{
						width: 100,
						content: '牛马杰杰爆',
					},
					{
						width: 100,
						content: '牛马杰杰爆',
					},
					{
						width: 100,
						content: '牛马杰杰爆',
					},
					{
						width: 100,
						content: '牛马杰杰爆',
					},
				]">
			</tags>
		</div>
	</div>
</template>
<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';

.example_display {
	display: flex;
	flex-wrap: wrap;
	align-items: flex-start;
	width: 100%;
	height: 100%;
	gap: rem(1);
}
</style>
