<template>
	<div class="content_box">
		<div>我是测试我是测试我是测试我是测试我是测试</div>
		<div>我是测试我是测试我是测试我是测试我是测试</div>
		<div>hello world</div>
		<div>hello world</div>
		<div>
			<img src="/public/imgs/small-image.jpg" style="width: 100px;" />
			<p>
				我是测试我是测试我是测试我是测我是测试我是测试我是测试我是测试我是测试我是测试我是测试我是测试我是测试我是测试我是测试我是测试我是测试我是测试我是测试试我是测试
			</p>
		</div>
	</div>
</template>
<style lang="scss" scoped>
.content_box {
	display: flex;
	gap: 20px;

	& > :nth-child(1) {
		width: max-content;
		background-color: bisque;
		word-break: initial;
	}

	& > :nth-child(2) {
		width: min-content;
		background-color: aquamarine;
		word-break: initial;
	}

	& > :nth-child(3) {
		width: min-content;
		background-color: aquamarine;
		word-break: initial;
	}

	& > :nth-child(4) {
		width: min-content;
		background-color: aquamarine;
		word-break: break-all;
	}

	& > :nth-child(5) {
		width: min-content;
		background-color: beige;
		word-break: initial;
	}
}
</style>
