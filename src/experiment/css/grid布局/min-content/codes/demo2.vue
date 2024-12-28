<template>
	<div class="flex_root">
		<div>测试</div>
		<div>测试</div>
		<div>
			<div style="min-width: 500px">321</div>
		</div>
		<div>测试</div>
	</div>
</template>
<style lang="scss" scoped>
.flex_root {
	display: flex;

	& > div {
		flex: 1 1 0%;
	}
}
</style>
