<template>
	<div class="flex_root_fix">
		<div class="text-overflow">
			<div>测试</div>
			<div>测试</div>
			<div>等宽布局</div>
			<div>测试</div>
			<div>测试</div>
		</div>
		<div class="fix">
			<div>测试</div>
			<div>测试</div>
			<div>等宽布局</div>
			<div>fix</div>
			<div>测试</div>
		</div>
	</div>
	<div class="overflow">
		<div class="container">
			<div>
				<img
					src="/public/imgs/small-image.jpg"
					v-for=" in Array(4)" />
			</div>
		</div>
		<aside class="aside">撑破弹性布局</aside>
	</div>
	<div class="overflow overflow-fix">
		<div class="container">
			<div>
				<img
					src="/public/imgs/small-image.jpg"
					v-for=" in Array(4)" />
			</div>
		</div>
		<aside class="aside">撑破弹性布局 fix</aside>
	</div>
</template>
<style lang="scss" scoped>
.flex_root_fix {
	display: flex;
	gap: 40px;
	align-items: flex-start;

	& > .text-overflow,
	& > .fix {
		display: flex;
		width: 300px;
		gap: 10px;

		& > div {
			display: inline-flex;
			justify-content: center;
			flex: 1 1 0%;
			background-color: skyblue;
			white-space: nowrap;
		}
	}

	.fix {
		& > div {
			min-width: 0;
		}
	}
}

.overflow {
	display: flex;
	margin-top: 20px;
	padding: 5px;
	width: 200px;
	background-color: red;
	gap: 10px;

	.container {
		display: flex;
		gap: 10px;

		& > div {
			// 模拟一个超长内容尺寸
			display: flex;
			overflow: auto;

			img {
				width: 100px;
			}
		}
	}

	.aside {
		flex-shrink: 0;
		width: 100px;
	}
}

.overflow-fix {
	.container {
		min-width: 0;
	}
}
</style>
