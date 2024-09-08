<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		onOk: {
			type: Function,
			required: true,
		},
		onCancel: {
			type: Function,
			required: true,
		},
	},
});
</script>
<template>
	<div class="modal">
		<header>
			<slot name="header"></slot>
		</header>
		<main>
			<slot name="main">main</slot>
		</main>
		<footer>
			<slot name="footer">
				<button
					class="opt_button"
					@click="() => onCancel()">
					取消
				</button>
				<button
					class="opt_button"
					@click="() => onOk()">
					确定
				</button>
			</slot>
		</footer>
	</div>
</template>
<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';

.modal {
	@include supper_round_border {
		position: absolute;
		z-index: 9999;
		width: 60vw;
		height: 60vh;
		inset: 0;
		flex-direction: column;
		transform: translate3d(15vw, 15vh, 0);

		& > * {
			border-radius: 0;
		}
	}
	@include flex_center;

	header {
		display: flex;
		align-items: flex-start;
		width: 100%;
		height: 4rem;
		place-content: flex-start flex-start;
	}

	footer {
		display: flex;
		align-items: flex-start;
		width: 100%;
		height: 4rem;
		place-content: flex-start flex-start;
	}

	main {
		flex: auto;
		width: 100%;
	}

	.opt_button {
		@include button;
	}
}
</style>
