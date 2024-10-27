<script lang="ts" setup></script>
<template>
	<div>123</div>
	<div class="create_render_layer">
		<p>
			<div>di </div>
		</p>
		<span>span</span>
	</div>

		<div class="create_render_layer_flex_qa">
<div class="left">left</div>
<div class="right">
	<div>2321</div>
</div>

		</div>

</template>
<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';

.create_render_layer {
	position: relative;

	p{
		position: relative;

		div{
			transform: translateZ(0);
		}
	}
}

.create_render_layer_flex_qa{
	display: flex;
				align-items: center;
				width: 100%;
				gap: rem(0.4);

	.left{
					box-sizing: border-box;
					width: rem(1.5);
					height: rem(1.5);
					@include flex_center;
					@include supper_border('round', 'sub', 0.25, 0.1, 0.75);
					@include pointer;

					background-color: green;
	}

	.right{
		align-items: center;
					width: 100%;
					background-color:red;
					flex: 3;
					gap: rem(0.4);
					@include flex_wrap;

					&-catalog {
						display: flex;
						align-items: center;
					}

					&>div{
						width: 20px;
						height:20px;
						background-color: aliceblue;
					}
	}
}
</style>
