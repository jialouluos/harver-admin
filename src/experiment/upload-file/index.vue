<script lang="ts" setup>
import { useUploadFileByPick } from '@jialouluo/tools';
const handleUpload = async (type: 'single' | 'multiple' | 'dir') => {
	const res = await useUploadFileByPick({ type });
	console.log(res);
};
</script>
<template>
	<div class="example_display">
		<harver-button
			:shape="'round'"
			@click="() => handleUpload('single')"
			>上传单文件</harver-button
		>
		<harver-button @click="() => handleUpload('multiple')">上传多文件</harver-button>
		<harver-button @click="() => handleUpload('dir')">上传目录</harver-button>
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
