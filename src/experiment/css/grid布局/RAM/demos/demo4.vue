<template>
	<div class="ram_root_bug_fix">
		<div
			v-for=" in Array(4)"
			class="item">
			<img src="/public/imgs/test.png" />
		</div>
	</div>
</template>
<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';

.ram_root_bug_fix {
	display: grid;
	gap: rem(2);
	grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));

	.item {
		display: flex;
		flex-direction: column;
		align-items: center;
		border: 1px solid rgb(0 0 0 / 1%);
		border-radius: 4px;
		background-color: col(primary);
		box-shadow: 0 0 0.25em 0.125em rgb(0 0 0 / 12.5%);

		img {
			display: block;
			border-radius: 4px 4px 0 0;
			max-width: 100%;
			object-fit: cover;
			object-position: center;
			aspect-ratio: 16 / 9;
		}
	}
}
</style>
