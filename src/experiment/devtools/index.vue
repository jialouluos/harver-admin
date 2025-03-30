<script lang="ts" setup>
import { ref } from 'vue';
import DisableDevtool from 'disable-devtool';
import { useRoute } from 'vue-router';

const value = ref(-1);
const isSuccess = ref(false);
const route = useRoute();
const detectors = ((route.query.detectors ?? '') as string).split(',').filter(Boolean).map(Number) as any;
console.log(detectors, 'detectors');
console.log(
	'%c+',
	`
  background-image: url(http://localhost:3000/api/blog/article/front/list);
  background-size: contain;
  background-repeat: no-repeat;
  color: transparent;`
);

if (detectors && Array.isArray(detectors) && detectors.length) {
	DisableDevtool({
		// 7可以监听到安卓 vconsole
		// 6可以监听到 PC
		disableMenu: false,
		detectors: detectors,
		clearLog: false,
		ondevtoolopen: type => {
			const info = 'devtool opened!; type =' + type;
			value.value = type;
			isSuccess.value = true;
			console.log(info, '监听到了'); // If you are worried about blocking the page, use console.warn(info); and open the console to view
		},
		ondevtoolclose: () => {
			alert('关闭了');
		},
	});
}

// Object.prototype.toString = function () {
// 	console.log(2312);
// 	return Object.prototype.toString.bind(this)();
// };
// const a = Object.create({
// 	toString: () => {
// 		console.log(1312);
// 	},
// });
// const a = /./;
// // Object.getPrototypeOf(a).toString = function () {
// // 	console.log(2312);
// // 	return 'devtools';
// // };

// console.log(a);
// a.toString = function () {
// 	alert(1);
// 	va.value = 2;
// 	return 'da';
// };
// console.log(a);
</script>
<template>
	<harver-md>
		<harver-b-code
			:code="`export enum DetectorType {
	Unknown = -1,
	RegToString = 0, // 根据正则检测
	DefineId, // 根据dom id检测 1
	Size, //根据窗口尺寸检测 2
	DateToString, // 根据Date.toString 检测 3
	FuncToString, // 根据Function.toString 检测 4
	Debugger, // 根据断点检测，仅在ios chrome 真机情况下有效 5
	Performance, // 根据log大数据性能检测 6 
	DebugLib, // 检测第三方调试工具
};`">
		</harver-b-code>
	</harver-md>
	<div class="example_display">
		<div>(query的key为detectors)</div>

		<div
			v-if="isSuccess"
			style="width: 100%; font-size: 20px; color: red">
			监听到了 类型为{{ value ?? '-1' }}
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
}
</style>
