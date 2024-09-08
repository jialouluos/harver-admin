<script lang="ts" setup>
import { useUploadFileByPick } from '@jialouluo/tools';
const handleUpload = async (type: 'single' | 'multiple' | 'dir') => {
	const res = await useUploadFileByPick({ type });
	console.log(res);
};
</script>
<template>
	<div class="example_display">
		<div @click="() => handleUpload('single')"><span>上传单文件</span></div>
		<div @click="() => handleUpload('multiple')"><span>上传多文件</span></div>
		<div @click="() => handleUpload('dir')"><span>上传目录</span></div>
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
		@include button;
	}
}
</style>
