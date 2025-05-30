<script lang="ts" setup>
import { reactive, ref, toRefs, watch, nextTick } from 'vue';
import { on, useSharedGlobalEvent } from '../../hooks/useEventListener';
import { useClassName, usePrefixCls } from '../../hooks';

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
const eventId = Symbol('modal-event');
const eventEngine = useSharedGlobalEvent();
const eventPool = eventEngine.value!.useScopedEventPool(eventId)!;

const CNGenerator = useClassName({
	split: '-',
	prefixClassName: usePrefixCls,
});
const CN = CNGenerator(Symbol('modal'));
const { onCancel, onOk } = toRefs(props);

const modalRef = ref();
const addClickCloseEvent = () => {
	if (!open.value) return;
	nextTick(() => {
		console.log(eventEngine);
		setTimeout(() => {
			const clearDocClick = on(document, 'click', e => {
				if (!modalRef.value?.contains(e.target)) {
					open.value = false;
					eventPool.clear('clearDocClick');
					e.stopPropagation();
				}
			});
			eventPool.mark('clearDocClick', clearDocClick);
		});
	});
};
watch(
	() => open.value,
	() => {
		console.log(open.value);
		addClickCloseEvent();
	}
);

const handleCancel = () => {
	onCancel.value && onCancel.value();
	open.value = false;
};
const handleOk = () => {
	onOk.value && onOk.value();
	open.value = false;
};
</script>
<template>
	<Teleport to="body">
		<Transition :name="CN.C('modal', 0)">
			<div
				v-if="open"
				:class="[CN.C('modal', 0)]"
				ref="modalRef">
				<div :class="CN.C('header', 1)">
					<div :class="CN.C('content', 2)">
						<slot name="header">
							{{ title }}
						</slot>
					</div>
					<span
						v-if="showCloseIcon"
						:class="CN.C('close-icon', 2)"
						@click="handleCancel()"
						>✕</span
					>
				</div>
				<div :class="CN.C('content', 1)">
					<slot name="content">content</slot>
				</div>
				<div :class="CN.C('footer', 1)">
					<slot name="footer">
						<harver-button @click="handleOk"> 确定 </harver-button>
						<harver-button @click="handleCancel"> 取消 </harver-button>
					</slot>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>
<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';

.harver {
	&-modal {
		width: 60vw;
		height: 60vh;
		background-color: col(grey-1);
		@include card(0.5, 0.25) {
			position: fixed; // 单独形成一个合成层
			inset: 0;
			z-index: 999;
			margin: auto;
		}
		@include flex-center {
			flex-flow: column wrap;
			justify-content: space-between;
			align-items: flex-start;
		}

		&-header {
			display: flex;
			z-index: 10;
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
			display: flex;
			z-index: 10;
			flex-wrap: wrap;
			align-items: center;
			width: 100%;
			height: rem(3);
			place-content: center flex-end;
			@include divide('top');
		}

		&-enter-active,
		&-leave-active {
			transition: all 0.3s ease-out;
			transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		}

		&-enter-from,
		&-leave-to {
			opacity: 0;
			transform: translate(0, -20px);
		}

		&-leave-from,
		&-enter-to {
			opacity: 1;
			transform: scale(1, 1) translate(0, 0);
		}
	}
}
</style>
