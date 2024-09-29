<script lang="ts" setup>
import Text from '@jialouluo/tools/src/components/vue/harver-ui/text/index.vue';
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
				<h2>普通文本</h2>
				<Divider></Divider>
				<Text
					:content="'测试文本-|'.repeat(100)"
					:ellipsis="{
						tooltip: '测试',
						enableTooltip: true,
					}">
				</Text>
			</div>
		</div>
		<div class="display_box">
			<div>
				<h2>多行省略 + 单行省略</h2>
				<Divider></Divider>
				<Text
					:ellipsis="{ rows: 3 }"
					:content="'测试文本-|'.repeat(100)">
				</Text>
				<Divider></Divider>
				<Text
					:ellipsis="{ rows: 1 }"
					:content="'测试文本-|'.repeat(18)">
				</Text>
			</div>
		</div>
		<div class="display_box">
			<div>
				<h2>(单行省略 | 多行省略) + tooltip</h2>
				<Divider></Divider>
				<Text
					:ellipsis="{ rows: 3, }"
					:content="'测试文本-|'.repeat(50)">
				</Text>
				<Divider></Divider>
				<Text
					:ellipsis="{ rows: 1, }"
					:content="'测试文本-|'.repeat(18)">
				</Text>
			</div>
		</div>

		<div class="display_box">
			<div>
				<h2>(单行省略 | 多行省略) + tooltip(强制) + 展开收起</h2>
				<Divider></Divider>
				<Text
					:ellipsis="{ rows: 3, enableTooltip: true, expandable: true }"
					:content="'测试文本-|'.repeat(50)">
				</Text>
				<Divider></Divider>
				<Text
					:ellipsis="{ rows: 1, enableTooltip: true, expandable: true }"
					:content="'测试文本-|'.repeat(18)">
				</Text>
			</div>
		</div>
		<div class="display_box">
			<div>
				<h2>(单行省略 | 多行省略) + tooltip + 展开收起 + copy</h2>
				<Divider></Divider>
				<Text
					copy
					:ellipsis="{ rows: 3, expandable: true }"
					:content="'测试文本-|'.repeat(50)">
				</Text>
				<Divider></Divider>
				<Text
					copy
					:ellipsis="{ rows: 1, expandable: true }"
					:content="'测试文本-|'.repeat(18)">
				</Text>
			</div>
		</div>
		<div class="display_box">
			<div>
				<h2>(单行省略 | 多行省略) + tooltip + 展开收起 + copy + 最大展示字数</h2>
				<Divider></Divider>
				<Text
					copy
					:ellipsis="{ rows: 3, expandable: true, showMaxLength: 20 }"
					:content="'测试文本-|'.repeat(50)">
				</Text>
				<Divider></Divider>
				<Text
					:ellipsis="{ rows: 1, showMaxLength: 20 }"
					:content="'测试文本-|'.repeat(18)">
				</Text>
			</div>
		</div>
		<div class="display_box">
			<div>
				<h2>(单行省略 | 多行省略) + tooltip + 展开收起 + copy + 最大展示字数 + suffix</h2>
				<Divider></Divider>
				<Text
					copy
					:ellipsis="{ rows: 3, expandable: true, showMaxLength: 20, suffix: '----' }"
					:content="'测试文本-|'.repeat(50)">
				</Text>
				<Divider></Divider>
				<Text
					:ellipsis="{ rows: 1, showMaxLength: 20, suffix: '----' }"
					:content="'测试文本-|'.repeat(18)">
				</Text>
			</div>
		</div>
		<div class="display_box">
			<div>
				<h2>多行省略 lazy 【当前： {{ state.performanceType }}】</h2>
				<Divider></Divider>
				<div style="display: flex; justify-content: center; align-items: center; width: 100%">
					<button
						class="button"
						@click="() => handleChangeTextPerformance('low')">
						<span> performance(low)</span>
					</button>
					<button
						class="button"
						@click="() => handleChangeTextPerformance('high')">
						<span> performance(high)</span>
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
					<Text
						lazy
						:ellipsis="{
							rows: 3,
							enableTooltip: true,
							...(state.performanceType === 'high' ? { expandable: true, showMaxLength: 20, suffix: '----' } : {}),
						}"
						:content="'测试文本-|'.repeat(50)">
					</Text>
					<Divider></Divider>
				</template>
			</div>
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
