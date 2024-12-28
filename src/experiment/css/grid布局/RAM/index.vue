<script lang="ts" setup>
import ArticleLayout from '@/components/article-template/index.vue';

import demo1String from './demos/demo1.vue?raw';
import demo1 from './demos/demo1.vue';

import demo2String from './demos/demo2.vue?raw';
import demo2 from './demos/demo2.vue';

import demo3String from './demos/demo3.vue?raw';
import demo3 from './demos/demo3.vue';

import demo4String from './demos/demo4.vue?raw';
import demo4 from './demos/demo4.vue';

import { reactive } from 'vue';
import { Input } from 'ant-design-vue';
const state = reactive({
	_demo2Count: 4,
	demo2Count: 4,
	_demo1Count: 4,
	demo1Count: 4,
});
</script>
<template>
	<ArticleLayout
		:articleTitle="'RAM布局'"
		:articleUrl="'https://harver.cn/article/1'">
		<harver-blockquote>
			<harver-i-code>RAM</harver-i-code> 布局技术指的是在定义网格时，使用了<harver-i-code>repeat()</harver-i-code> 和
			<harver-i-code>minmax()</harver-i-code>函数，并且在<harver-i-code>repeat()</harver-i-code>函数中使用
			<harver-i-code>auto-fit</harver-i-code>或 <harver-i-code>auto-fill</harver-i-code>关键词来指定网格轨道数量。
			<p>名词扫盲</p>
			<ul>
				<li>轨道指的就是元素</li>
			</ul>
		</harver-blockquote>

		<harver-b-code
			:code="demo1String"
			:demoKey="'ram-demo-1'">
			<demo1 :count="state.demo1Count" />
			<template #desc>
				<div style="display: flex; justify-content: center; width: 100%">
					<harver-blockquote>
						第一个案例 auto-fill ：当使用 minmax() 函数时，auto-fill
						在不改变网格项目宽度的情况下保留可用空间。</harver-blockquote
					>
				</div>
			</template>
			<template #gui>
				<div style="display: flex; align-items: center">
					<span>渲染个数:</span>
					<Input
						placeholder="请输入渲染个数"
						v-model:value="state._demo1Count"
						style="margin: 0 10px; width: 100px"></Input>
					<harver-button
						:size="'small'"
						@click="state.demo1Count = Number(state._demo1Count)"
						>确定</harver-button
					>
				</div>
			</template>
		</harver-b-code>

		<harver-b-code
			:code="demo2String"
			:demoKey="'ram-demo-2'">
			<demo2 :count="state.demo2Count" />
			<template #desc>
				<div style="display: flex; justify-content: center; width: 100%">
					<harver-blockquote>
						第二个案例 auto-fit ：当使用 minmax() 函数时，auto-fit
						关键词将扩展网格项目来填充可用空间。</harver-blockquote
					>
				</div>
			</template>
			<template #gui>
				<div style="display: flex; align-items: center">
					<span>渲染个数:</span>
					<Input
						placeholder="请输入渲染个数"
						v-model:value="state._demo2Count"
						style="margin: 0 10px; width: 100px"></Input>
					<harver-button
						:size="'small'"
						@click="state.demo2Count = Number(state._demo2Count)"
						>确定</harver-button
					>
				</div>
			</template>
		</harver-b-code>

		<harver-b-code
			:code="demo3String"
			:demoKey="'ram-demo-3'">
			<demo3 />
			<template #desc>
				<div style="display: flex; justify-content: center; width: 100%">
					<harver-blockquote>
						RAM的缺点: RAM也有一定的缺陷，当浏览器视窗的宽度小于 minmax(MIN, MAX) 中的 MIN
						值时，浏览器就会出现水平滚动条或溢出内容被裁剪</harver-blockquote
					>
				</div>
			</template>
		</harver-b-code>

		<harver-b-code :code="demo4String"  :demoKey="'ram-demo-4'">
			<demo4 />
			<template #desc>
				<div style="display: flex; justify-content: center; width: 100%">
					<harver-blockquote>
						RAM的缺点修复: 如果不想让卡片溢出容器或容器出现水平滚动条，只需要在 minmax(MIN, MAX) 函数中嵌套 CSS
						的比较函数（min() 、max() 、clamp()），可以让该布局更为完美。比如，你可以在 minmax(MIN, MAX) 函数中嵌套一个
						min() 函数</harver-blockquote
					>
				</div>
			</template>
		</harver-b-code>
	</ArticleLayout>
</template>
