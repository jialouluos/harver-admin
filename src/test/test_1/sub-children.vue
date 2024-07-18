<script lang="ts" setup>
const props = defineProps({
	name: {
		type: String,
	},
	age: {
		type: Number,
	},
	testKey: {
		type: String,
	},
});
console.log(props, 'sub-children');
</script>
<template>
	<div>{{ name }}</div>
</template>
