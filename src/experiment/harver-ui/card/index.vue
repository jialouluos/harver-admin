<script lang="ts" setup>
import Card from './components/card.vue';
</script>

<template>
	<div class="cards">
		<Card>
			<template #title></template>
		</Card>
		<Card></Card>
		<Card></Card>
		<Card></Card>
		<Card></Card>
		<Card></Card> <Card></Card> <Card></Card> <Card></Card> <Card></Card> <Card></Card>
		<Card></Card>
	</div>
</template>
<style lang="scss">
@import '@jialouluo/tools/src/components/styles/global';

.cards {
	display: flex;
	flex-wrap: wrap;
	gap: rem(1);
}
</style>
