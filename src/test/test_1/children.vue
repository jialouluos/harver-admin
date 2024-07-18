<script lang="ts" setup>
import SubChildren from './sub-children.vue';
const props = defineProps({
	name: {
		type: String,
	},
	age: {
		type: Number,
	},
});
console.log(props, 'children');
</script>
<template>
	<SubChildren
		v-bind="{
			// ...$attrs,
			...$props,
			chidlrenKey: 'child',
		}"></SubChildren>
</template>
