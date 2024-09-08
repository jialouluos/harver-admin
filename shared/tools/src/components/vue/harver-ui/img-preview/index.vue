<script lang="ts" setup>
import { reactive } from 'vue';
const handleClick = () => {
	console.log("后续支持")
};
</script>

<template>
	<img @click="handleClick" style="cursor: pointer;"/>
</template>
