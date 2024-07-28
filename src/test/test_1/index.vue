<script lang="ts" setup>
const demoObject = { name: '321312', age: 18, testKey: 'test' };
import Children from './children.vue';
import Mokey from '@/hooks/tamperMonkey/tools/src/index.vue';
</script>
<template>
	<Mokey></Mokey>
</template>
