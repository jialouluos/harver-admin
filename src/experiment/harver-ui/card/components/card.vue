<script lang="ts" setup>
import ImgLazy from '@jialouluo/tools/src/components/vue/harver-ui/img-preview/index.vue';
</script>

<template>
	<div class="card">
		<header class="card-header">
			<div class="card-header-title">卡片标题</div>
			<div class="card-header-meta">
				<div class="card-header-meta-img">
					<img
						v-lazy
						src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
						alt="" />
				</div>
				<div class="card-header-meta-info">zuo</div>
			</div>
			<div class="card-header-desc">desc</div>
		</header>
		<main class="card-main"></main>
		<footer class="card-footer"></footer>
		<!-- <slot
			name="title"
			class="title">
		</slot>
		<slot name="desc"> </slot>
		<slot name="footer"> </slot> -->
	</div>
</template>
<style lang="scss">
@import '@jialouluo/tools/src/components/styles/global';

.card {
	width: rem(12);

	/* width: 100%; */
	height: rem(15);
	@include card;

	&-header {
		display: flex;
		width: 100%;
		height: rem(5);
		flex-wrap: wrap;
		gap: rem(0.4);

		&-title {
			width: 100%;
			height: rem(1);
			font-size: rem(1.2);
			font-weight: 500;
			@include flex_center;

			color: col(sub);
		}

		&-meta {
			display: flex;
			width: 100%;
			gap: rem(0.4);

			&-img {
				overflow: hidden;
				width: rem(2);
				height: rem(2);
				border-radius: 50%;

				img {
					width: 100%;
					height: 100%;
				}
			}

			&-info {
				flex: 3;
				width: 100%;
				height: rem(2);
			}

			& > div {
				background-color: antiquewhite;
			}
		}

		&-desc {
			width: 100%;
		}
	}

	&-main {
		height: rem(7);
		background-color: rgb(241 215 250);
	}

	&-footer {
		height: auto;
		background-color: rgb(215 250 217);
	}

	.title {
		@include flex_center;
	}
}
</style>
