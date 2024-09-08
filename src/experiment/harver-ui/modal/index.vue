<script lang="ts" setup>
import modal from '@jialouluo/tools/src/components/vue/harver-ui/modal/index.vue';
import { ref } from 'vue';
const open = ref(false);
const handleClick = () => {
	open.value = true;
};
</script>
<template>
	<div class="example_display">
		<div @click="handleClick">
			<span>打开弹窗</span>
		</div>
	</div>
	<modal v-model:open="open">
		click触发
		<template #content>
			<div>click xxxxxx</div>
		</template>
	</modal>
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
