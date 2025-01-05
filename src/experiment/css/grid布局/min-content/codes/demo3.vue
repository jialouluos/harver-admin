<template>
	<div class="height-auto-root">
		<div class="wrapper">
			<harver-button class="hover-btn-basic">普通展开</harver-button>
			<div class="content">我是内容我是内容我是内容我是内容</div>
		</div>
		<div class="wrapper">
			<harver-button class="hover-btn-interpolate-size">interpolate-size展开</harver-button>
			<div class="content">我是内容我是内容我是内容我是内容</div>
		</div>
		<div class="wrapper">
			<harver-button class="hover-btn-calc-size">calc-size展开</harver-button>
			<div class="content">我是内容我是内容我是内容我是内容</div>
		</div>
	</div>
</template>
<style lang="scss" scoped>
.height-auto-root {
	display: flex;
	align-items: flex-start;
	width: 100%;
	height: 300px;
	gap: 20px;

	.wrapper {
		display: flex;
		position: relative;
		flex-wrap: wrap;
		justify-content: center;
		width: 100px;
		gap: 10px;
	}

	.hover-btn-basic:hover ~ .content {
		height: auto;
	}

	.hover-btn-interpolate-size ~ .content {
		interpolate-size: allow-keywords;
	}

	.hover-btn-interpolate-size:hover ~ .content {
		height: auto;
	}

	.hover-btn-calc-size:hover ~ .content {
		height: auto;
		height: calc-size(auto);
	}

	.content {
		display: inline-flex;
		overflow: hidden;
		box-sizing: border-box;
		border-radius: 5px;
		width: 60px;
		height: 0;
		background-color: rgb(0 0 0 / 65%);
		color: #fff;
		transition: 1s;
	}
}
</style>
