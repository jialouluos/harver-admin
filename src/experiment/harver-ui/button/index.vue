<script lang="ts" setup></script>
<template>
	<div class="example_display">
		<div>
			<harver-button
				:shape="'round'"
				:size="'small'"
				>r S</harver-button
			>
			<harver-button
				:shape="'round'"
				:size="'small'"
				>round Small</harver-button
			>
			<harver-button :shape="'round'">r M</harver-button>
			<harver-button :shape="'round'">round Middle</harver-button>
			<harver-button
				:shape="'round'"
				:size="'large'"
				>r L</harver-button
			>
			<harver-button
				:shape="'round'"
				:size="'large'"
				>round Large</harver-button
			>
		</div>
		<div>
			<harver-button
				:shape="'rect'"
				:size="'small'"
				>r S</harver-button
			>
			<harver-button
				:shape="'rect'"
				:size="'small'"
				>rect Small</harver-button
			>
			<harver-button :shape="'rect'">r M</harver-button>
			<harver-button :shape="'rect'">rect Middle</harver-button>
			<harver-button
				:shape="'rect'"
				:size="'large'"
				>r L</harver-button
			>
			<harver-button
				:shape="'rect'"
				:size="'large'"
				>rect Large</harver-button
			>
		</div>
	</div>
</template>
<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';

.example_display {
	display: flex;
	flex-wrap: wrap;
	align-content: flex-start;
	align-items: flex-start;
	width: 100%;
	height: 100%;
	gap: rem(1);

	& > div {
		display: flex;
		width: 100%;

		& > button {
			align-self: flex-start;
		}
	}
}
</style>
