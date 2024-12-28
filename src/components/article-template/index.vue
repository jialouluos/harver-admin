<script lang="ts" setup>
defineProps<{
	articleUrl: string;
	articleTitle: string;
}>();
</script>
<template>
	<harver-md>
		<h1>{{ articleTitle }}</h1>
		<div class="read-time">
			<span
				>对应文章链接:<a :href="articleUrl">{{ articleTitle }}</a></span
			>
		</div>
		<slot></slot>
	</harver-md>
</template>
<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';

.read-time {
	@include flex_center;

	justify-content: flex-start;
	margin-top: rem(1);
	margin-bottom: rem(4);
	padding: rem(0.5);
	border: 2px dashed col(primary);
	border-radius: rem(0.25);
	height: rem(2);
	line-height: 1;
	font-size: rem(0.8);
	color: col(text-sub-color);
	gap: rem(2);

	a {
		text-decoration: underline;
	}
}
</style>
