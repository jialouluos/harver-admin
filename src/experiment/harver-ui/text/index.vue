<script lang="ts" setup>
import Text from '@jialouluo/tools/src/components/vue/harver-ui/text/index.vue';
import Divider from '@jialouluo/tools/src/components/vue/harver-ui/divider/index.vue';
import { reactive, nextTick } from 'vue';

const state = reactive({
	performanceType: '',
	supperLazyPerformanceType: '',
});
const handleChangeTextPerformance = async (type: 'low' | 'high' | '') => {
	state.performanceType = '';
	await nextTick();
	state.performanceType = type;
};
const handleChangeTextSupperLazyPerformance = async (type: 'low' | 'high' | '') => {
	state.supperLazyPerformanceType = '';
	await nextTick();
	state.supperLazyPerformanceType = type;
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
					:tooltip="{
						content: '测试',
						enable: true,
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
					:tooltip="{ enable: false }"
					:content="'测试文本-|'.repeat(100)">
				</Text>
				<Divider></Divider>
				<Text
					:ellipsis="{ rows: 1 }"
					:tooltip="{ enable: false }"
					:content="'测试文本-|'.repeat(18)">
				</Text>
			</div>
		</div>
		<div class="display_box">
			<div>
				<h2>(单行省略 | 多行省略) + tooltip</h2>
				<Divider></Divider>
				<Text
					:ellipsis="{ rows: 3 }"
					:content="'测试文本-|'.repeat(50)">
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
				<h2>(单行省略 | 多行省略) + tooltip(强制) + 展开收起</h2>
				<Divider></Divider>
				<Text
					:ellipsis="{ rows: 3, expandable: true }"
					:tooltip="{
						enable: true,
					}"
					:content="'测试文本-|'.repeat(50)">
				</Text>
				<Divider></Divider>
				<Text
					:ellipsis="{ rows: 1, expandable: true }"
					:tooltip="{
						enable: true,
					}"
					:content="'测试文本-|'.repeat(18)">
				</Text>
			</div>
		</div>
		<div class="display_box">
			<div>
				<h2>(单行省略 | 多行省略) + tooltip + 展开收起 + copy</h2>
				<Divider></Divider>
				<Text
					:ellipsis="{ rows: 3, expandable: true, copy: true }"
					:content="'测试文本-|'.repeat(50)">
				</Text>
				<Divider></Divider>
				<Text
					copy
					:ellipsis="{ rows: 1, expandable: true, copy: true }"
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
					:ellipsis="{ rows: 3, expandable: true }"
					:measure="{
						maxLength: 20,
					}"
					:content="'测试文本-|'.repeat(50)">
				</Text>
				<Divider></Divider>
				<Text
					:ellipsis="{ rows: 1 }"
					:measure="{
						maxLength: 20,
					}"
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
					:ellipsis="{ rows: 3, expandable: true, suffix: '----' }"
					:measure="{
						maxLength: 20,
					}"
					:content="'测试文本-|'.repeat(50)">
				</Text>
				<Divider></Divider>
				<Text
					:ellipsis="{ rows: 1, suffix: '----' }"
					:measure="{
						maxLength: 20,
					}"
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

							...(state.performanceType === 'high' ? { expandable: true,  suffix: '----' } : {}),
						}"
					
						:measure="
							state.performanceType === 'high'
								? {
										lazy: true,
										maxLength: 20,
								  }
								: { lazy: true }
						"
						:content="'测试文本-|'.repeat(50)">
					</Text>
					<Divider></Divider>
				</template>
			</div>
		</div>
		<div class="display_box">
			<div>
				<h2>多行省略 supperLazy 【当前： {{ state.supperLazyPerformanceType }}】</h2>
				<Divider></Divider>
				<div style="display: flex; justify-content: center; align-items: center; width: 100%">
					<harver-button
						class="button"
						@click="() => handleChangeTextSupperLazyPerformance('low')">
						performance(low)
					</harver-button>
					<harver-button
						class="button"
						@click="() => handleChangeTextSupperLazyPerformance('high')">
						performance(high)
					</harver-button>
					<harver-button
						class="button"
						@click="() => handleChangeTextSupperLazyPerformance('')">
						销毁
					</harver-button>
				</div>
				<Divider></Divider>
				<template
					v-for="item in Array(100)"
					v-if="state.supperLazyPerformanceType">
					<Text
						lazy
						:ellipsis="{
							rows: 3,

							...(state.supperLazyPerformanceType === 'high' ? { expandable: true,  suffix: '----' } : {}),
						}"
						:tooltip="{
							enable: true,
						}"
						:measure="
							state.supperLazyPerformanceType === 'high'
								? {
										supperLazy: true,
										maxLength: 20,
								  }
								: { supperLazy: true }
						"
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
