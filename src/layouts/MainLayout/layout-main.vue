<script lang="ts" setup>
import { start } from '@/microApp';
import { useStore } from '@/store';
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const { basicStore } = useStore();
const microRef = ref();
const isEmbed = computed(() => basicStore.isEmbed);
onMounted(() => {
	start();
});
</script>
<template>
	<a-layout-content :class="['content', isEmbed ? 'embed' : '']">
		<div ref="microRef">
			<div
				id="micro-container"
				v-if="route.meta.inMicro"></div>
			<RouterView v-else />
		</div>
	</a-layout-content>
</template>

<style lang="scss" scoped>
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

.embed {
	overflow: auto;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	@include scrollbar_hover;
	@include scrollbar;
}
</style>
