<script lang="ts" setup>
import Tag from '@jialouluo/tools/src/components/vue/harver-ui/tag/index.vue';
import Divider from '@jialouluo/tools/src/components/vue/harver-ui/divider/index.vue';
import { reactive, nextTick } from 'vue';

const state = reactive({
	performanceType: '',
});
const handleChangeTextPerformance = async (type: 'low' | 'high' | '') => {
	state.performanceType = '';
	await nextTick();
	state.performanceType = type;
};
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
		<!-- <div class="display_box">
			<div>
				<h2>lazy 【当前： {{ state.performanceType }}】</h2>
				<Divider></Divider>
				<div style="display: flex; justify-content: center; align-items: center; width: 100%">
					<button
						class="button"
						@click="() => handleChangeTextPerformance('low')">
						<span> performance(low)</span>
					</button>

					<button
						class="button"
						@click="() => handleChangeTextPerformance('')">
						<span> 销毁</span>
					</button>
				</div>
				<Divider></Divider>
				<template
					v-for="item in Array(100)"
					v-if="state.performanceType">
					<Divider></Divider>
				</template>
			</div>
		</div> -->
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
	align-content: flex-start;

	.display_box {
		display: flex;
		margin: rem(1) 0;
		width: 100%;
		flex-wrap: wrap;
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
