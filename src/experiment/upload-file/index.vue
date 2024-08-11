<script lang="ts" setup>
import { useUploadFileByPick } from '@jialouluo/tools';
const handleUpload = async (type: 'single' | 'multiple' | 'dir') => {
	const res = await useUploadFileByPick({ type });
	console.log(res);
};
</script>
<template>
	<button @click="() => handleUpload('single')">上传单文件</button>
	<button @click="() => handleUpload('multiple')">上传多文件</button>
	<button @click="() => handleUpload('dir')">上传目录</button>
</template>
