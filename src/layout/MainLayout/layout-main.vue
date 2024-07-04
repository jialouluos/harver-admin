<script lang="ts" setup>
import { start } from '@/microApp';
import { onMounted } from 'vue';
onMounted(() => {
	start();
});
</script>
<template>
	<a-layout-content class="content">
		<div>
			<!-- <RouterView /> -->
			<div id="micro_container"></div>
		</div>
	</a-layout-content>
</template>

<style lang="scss">
@import '@/styles/global.scss';

.content {
	@include supper_box(0.5) {
		& > * {
			width: 100%;
			height: 100%;
			overflow: auto;
			padding: rem(0.5);
		}
	}
	#micro_container {
		height: 100%;
		& > div {
			width: 100%;
			height: 100%;
		}
	}
}
</style>
