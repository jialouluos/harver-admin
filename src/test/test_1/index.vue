<script lang="ts" setup>
const demoObject = { name: '321312', age: 18, testKey: 'test' };
import Children from './children.vue';
</script>
<template>
	<Children v-bind="{ ...demoObject }"></Children>
</template>
