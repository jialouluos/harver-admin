<script lang="ts" setup>
import { start } from '@/microApp';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
onMounted(() => {
	start();
});
const route = useRoute();
</script>
<template>
	<a-layout-content class="content">
		<div>
			<div
				id="micro-container"
				v-if="route.meta.inMicro"></div>
			<RouterView v-else />
		</div>
	</a-layout-content>
</template>

<style lang="scss">
@import '@jialouluo/tools/src/components/styles/global';

.content {
	@include card {
		background-color: col(grey-1);
		transform: translateZ(0); // 单独给一个合成层
		& > * {
			overflow: auto;
			padding: rem(0.5);
			width: 100%;
			height: 100%;
			@include scrollbar;
		}
	}

	#micro-container {
		height: 100%;

		& > div {
			width: 100%;
			height: 100%;
		}
	}
}
</style>
