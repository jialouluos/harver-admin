<script setup lang="ts">
import { onMounted, ref } from 'vue';

const boxRef = ref();
const widthInfo = ref();
onMounted(() => {
	const computedResult = window.getComputedStyle(boxRef.value);
	widthInfo.value = {
		width: computedResult.width,
		minWidth: computedResult.minWidth,
		maxWidth: computedResult.maxWidth,
	};
});
</script>
<template>
	<div
		class="box_root"
		ref="boxRef">{{widthInfo}}</div>
</template>
<style lang="scss" scoped>
.box_root {
	width: 199px;
	min-width: 200px;
	max-width: 199px;
}
</style>
