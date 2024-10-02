<script lang="ts" setup></script>
<template>
	<div class="supper_round_border"><span> 战士们 </span></div>
	<div class="supper_round_border2">
		<div>你好世界</div>
	</div>
	<div class="supper_round_border2">你好世界</div>
	<div class="supper_round_border3">你好世界</div>
</template>
<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';

.supper_round_border {
	@include supper_border('rect', 'primary');
}

.supper_rect_border {
	@include supper_border('rect', 'primary');
}

.supper_round_border2 {
	@include supper_border('round', 'primary') {
		background-color: aquamarine;
	
	}
}

.supper_round_border3 {
	padding: rem(0.5);
	background-color: red;
	border-radius: 1rem;
}
</style>
