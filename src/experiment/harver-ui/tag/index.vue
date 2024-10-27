<script lang="ts" setup>
import Tag from '@jialouluo/tools/src/components/vue/harver-ui/tag/index.vue';
import Divider from '@jialouluo/tools/src/components/vue/harver-ui/divider/index.vue';


</script>
<template>
	<div class="example_display">
		<div class="display_box">
			<div>
				<h2>普通标签</h2>
				<Divider></Divider>
				<Tag :content="'测试文本-|'.repeat(1)"> </Tag>
				<Tag :content="'测试文本-|'.repeat(1)"> </Tag>
				<Tag :content="'测试文本-|'.repeat(1)"> </Tag>
				<Tag :content="'测试文本-|'.repeat(1)"> </Tag>
			</div>
		</div>
		<div class="display_box">
			<div>
				<h2>超出隐藏</h2>
				<Divider :content="'固定宽度超出'"></Divider>
				<Tag
					:style="{
						color: 'red',
					}"
					:content="'测试文222本-|'.repeat(20)"
					:width="40">
				</Tag>
				<Divider :content="'固定行数超出'"></Divider>
				<Tag
					:content="'测试文本-|'.repeat(40)"
					:rows="2">
				</Tag>
			</div>
		</div>
	</div>
</template>
<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';

.example_display {
	display: flex;
	flex-wrap: wrap;
	align-content: flex-start;
	align-items: flex-start;
	width: 100%;
	height: 100%;
	gap: rem(1);

	.display_box {
		display: flex;
		flex-wrap: wrap;
		margin: rem(1) 0;
		width: 100%;
		@include card {
			& > div {
				width: 100%;
			}
		}

		h2 {
			@include title {
				border-bottom: none;
			}

			width: 100%;
		}

		.button {
			@include button;
		}
	}
}
</style>
