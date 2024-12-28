<template>
	<div class="flex_root_fix">
		<div>测试</div>
		<div>测试</div>
		<div>
			<div style="min-width: 500px">321</div>
		</div>
		<div>测试</div>
	</div>
</template>
<style lang="scss" scoped>
.flex_root_fix {
	display: flex;

	& > div {
		flex: 1 1 0%;
		min-width: 0;
	}
}
</style>
