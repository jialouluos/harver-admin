<script lang="ts" setup>
import { reactive, ref, toRefs, watch, nextTick } from 'vue';
import { on } from '../../hooks/useEventListener';
const open = defineModel<boolean, string>('open', { required: true });
const props = withDefaults(
	defineProps<{
		title?: string;
		showCloseIcon?: boolean;
		loading?: boolean;
		onCancel?: () => void;
		onOk?: () => void;
	}>(),
	{
		title: 'title',
		showCloseIcon: true,
		loading: false,
	}
);
const { onCancel, onOk } = toRefs(props);
const _open = ref(false);
const modalRef = ref();

watch(
	() => {
		return [open.value, props.loading];
	},
	() => {
		if (props.loading) return;
		nextTick(() => {
			on(
				modalRef.value,
				'animationend',
				() => {
					_open.value = open.value;
				},
				{
					once: true,
				}
			);
		});

		if (!open.value) return;
		setTimeout(() => {
			const clear = on(document, 'click', e => {
				if (!open.value) return;
				if (!modalRef.value) return;
				if (!modalRef.value.contains(e.target)) {
					open.value = false;
					clear();
				}
			});
		}, 300);
	}
);

const handleCancel = () => {
	if (onCancel.value) {
		return onCancel.value();
	} else {
		open.value = false;
	}
};
const handleOk = () => {
	if (onOk.value) {
		return onOk.value();
	} else {
		open.value = false;
	}
};
</script>
<template>
	<Teleport to="body">
		<div
			v-if="open || _open"
			:class="['harver-modal', open ? 'show' : 'hidden']"
			ref="modalRef">
			<div class="harver-modal-header">
				<div class="harver-modal-header-content">
					<slot name="header">
						{{ title }}
					</slot>
				</div>
				<span
					v-if="showCloseIcon"
					class="harver-modal-header-close-icon"
					@click="!loading && handleCancel()"
					>✕</span
				>
			</div>
			<div class="harver-modal-content">
				<slot name="content">content</slot>
			</div>
			<div class="harver-modal-footer">
				<slot name="footer">
					<button
						:disabled="loading"
						@click="handleOk">
						<span>确定</span>
					</button>
					<button
						:disabled="loading"
						@click="!loading && handleCancel()">
						<span> 取消</span>
					</button>
				</slot>
			</div>
		</div>
	</Teleport>
</template>
<style lang="scss" scoped>
@import '../../../styles/global';

.harver {
	&-modal {
		width: 60vw;
		height: 60vh;
		@include border_radius;
		@include supper_rect_border(0.25, 0.125) {
			& > * {
				padding: rem(0.25);
			}

			position: fixed;
			inset: 0;
			z-index: 999;
			margin: auto;
		}
		@include flex-center {
			justify-content: space-between;
			align-items: flex-start;
			flex-flow: column wrap;
		}

		&-header {
			z-index: 10;
			display: flex;
			width: 100%;
			height: rem(3);
			@include divide;

			&-content {
				padding: 0 rem(1);
				@include flex_center {
					justify-content: flex-start;
				}

				width: 100%;
			}

			&-close-icon {
				margin: rem(0.5) rem(0.5) 0 0;
				@include pointer;
				@include text_hover;

				user-select: none;
			}
		}

		&-content {
			flex: 1;
			padding: rem(1);
			width: 100%;
		}

		&-footer {
			z-index: 10;
			display: flex;
			justify-content: flex-end;
			width: 100%;
			height: rem(3);
			@include divide('top');

			button {
				@include button;

				width: rem(4);
			}
		}
	}
}

.show {
	@keyframes expand {
		from {
			transform: scale(0, 0);
			opacity: 0;
		}

		to {
			transform: scale(1, 1);
			opacity: 1;
		}
	}

	animation: expand 0.2s;
}

.hidden {
	@keyframes hidden {
		from {
			transform: scale(1, 1);
			opacity: 1;
		}

		to {
			transform: scale(0, 0);
			opacity: 0;
		}
	}

	animation: hidden 0.2s;
}
</style>
