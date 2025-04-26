<script lang="ts" setup>
import { onMounted } from 'vue';
import { globalState } from './formats/globalState';
import { MindNode } from './formats/node';
import mockData from '@mind/mock/index';
onMounted(() => {
	globalState.initDrawContainer('#mind-map');
	const mindNode = new MindNode(mockData);
	mindNode.render();
});
</script>
<template>
	<div
		id="mind-map"
		style="width: 100vw; height: 100vh"></div>
</template>
