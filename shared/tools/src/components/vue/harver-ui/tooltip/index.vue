<script lang="ts" setup>
import { ref, reactive, watch, nextTick, computed, onScopeDispose } from 'vue';
import { getCanPlacementList, ITooltip } from '@jialouluo/tools';
import {
	useClassName,
	usePrefixCls,
	useSharedGlobalEvent,
	on,
} from '@jialouluo/tools/src/components/vue/hooks/index.ts';
import { ITooltipProps } from '@jialouluo/tools/src/types/harver-ui.ts';
interface IState {
	show: boolean;
	placementInfo: null | ITooltip;
}
const props = withDefaults(defineProps<ITooltipProps>(), {
	trigger: 'hover',
	placement: 'top',
	width: 300,
	space: 15,
	disabled: false,
	content: '',
});
const eventId = Symbol('tooltip-event');
const triggerRef = ref<HTMLSpanElement>();
const contentRef = ref<HTMLDivElement>();

const state = reactive<IState>({
	show: false,
	placementInfo: null,
});

const disabled = computed(() => props.disabled);

const eventEngine = useSharedGlobalEvent();
const eventPool = eventEngine.value!.useScopedEventPool(eventId)!;

const CNGenerator = useClassName({
	split: '-',
	prefixClassName: usePrefixCls,
});
const CN = CNGenerator(Symbol('tooltip'));

const handleHover = () => {
	nextTick(() => {
		eventPool.clear('clearMouseEnter');
		eventPool.clear('clearMouseLeave');
		if (!triggerRef.value) return;
		let timer: NodeJS.Timeout | null = null;
		const clearMouseEnter = on(triggerRef, 'mouseenter', () => {
			timer && clearTimeout(timer);
			state.show = true;
			nextTick(() => {
				eventPool.clear('clearContentMouseEnter');
				eventPool.clear('clearContentMouseLeave');
				const clearContentMouseEnter = on(contentRef, 'mouseenter', () => {
					timer && clearTimeout(timer);
					state.show = true;
				});
				const clearContentMouseLeave = on(contentRef, 'mouseleave', () => {
					timer = setTimeout(() => {
						state.show = false;
						timer = null;
					}, 300);
				});
				eventPool.mark('clearContentMouseEnter', clearContentMouseEnter);
				eventPool.mark('clearContentMouseLeave', clearContentMouseLeave);
			});
		});

		const clearMouseLeave = on(triggerRef, 'mouseleave', () => {
			timer = setTimeout(() => {
				state.show = false;
				timer = null;
			}, 300);
		});
		eventPool.mark('clearMouseEnter', clearMouseEnter);
		eventPool.mark('clearMouseLeave', clearMouseLeave);
	});
};

const addClickCloseEvent = () => {
	if (disabled.value || !state.show) return;
	const clearDocClick = on(document, 'click', e => {
		if (!contentRef.value!.contains(e.target as HTMLElement)) {
			state.show = false;
			eventPool.clear('clearDocClick');
		}
	});

	eventPool.mark('clearDocClick', clearDocClick);
};
const handleClick = () => {
	nextTick(() => {
		eventPool.clear('clearClickTrigger');
		if (!triggerRef.value) return;

		const clearClickTrigger = on(triggerRef, 'click', e => {
			state.show = !state.show;

			e.stopPropagation();

			addClickCloseEvent();
		});

		eventPool.mark('clearClickTrigger', clearClickTrigger);
	});
};
const handleDispose = () => {
	state.show = false;
	state.placementInfo = null;
	eventPool.allClear();
};
const handleEnsurePlacement = () => {
	if (disabled.value || !state.show) return;

	nextTick(() => {
		if (!contentRef.value) return;
		if (!triggerRef.value) return;

		const placementList = getCanPlacementList(triggerRef.value, contentRef.value, props.space);

		const placementInfo = placementList.find(item => item.key === props.placement) || placementList[0];
		if (!placementInfo) return console.log('暂无');
		state.placementInfo = placementInfo;
	});
};
eventEngine.value?.onGlobal('resize', handleEnsurePlacement, { eventId });
//disable watch
watch(
	() => disabled.value,
	() => {
		handleDispose();

		if (disabled.value) return;

		switch (props.trigger) {
			case 'hover': {
				return handleHover();
			}
			case 'click': {
				return handleClick();
			}
			default: {
				break;
			}
		}
	},
	{
		immediate: true,
	}
);
//show watch
watch(
	() => state.show,
	() => handleEnsurePlacement()
);
watch(
	() => state.placementInfo,
	() => {
		if (!state.placementInfo) return;
		if (!contentRef.value) return;

		const placement = state.placementInfo;

		const styles = {
			left: placement.pos.x,
			top: placement.pos.y,
		};

		switch (placement.key) {
			case 'top':
			case 'bottom': {
				styles.left -= (placement.width - placement.targetWidth) / 2;
				break;
			}
			case 'left':
			case 'right': {
				styles.top -= (placement.height - placement.targetHeight) / 2;
				break;
			}
			default: {
				break;
			}
		}
		contentRef.value.style.inset = `${styles.top}px  auto auto ${styles.left}px  `;
	}
);
onScopeDispose(() => {
	eventEngine.value?.remove('resize', eventId);
	handleDispose();
});

// 父组件使用的话需要导出
defineExpose({
	triggerRef,
});
</script>
<template>
	<span
		ref="triggerRef"
		v-bind="$attrs">
		<slot name="default"></slot>

		<Teleport
			to="body"
			v-if="!disabled">
			<Transition :name="CN.C('tooltip', 0)">
				<div
					v-if="state.show"
					ref="contentRef"
					:class="[CN.C('tooltip', 0), state.placementInfo ? CN.C(state.placementInfo!.key, 1):'']">
					<div
						:class="CN.C('inner', 1)"
						:style="{
							maxWidth: width + 'px',
						}">
						<slot name="content">{{ content }}</slot>
					</div>
				</div>
			</Transition>
		</Teleport>
	</span>
</template>
<style lang="scss" scoped>
@import '@jialouluo/tools/src/components/styles/global';

.#{$prefixCls} {
	&-tooltip {
		position: fixed;
		z-index: 10;
		padding: rem(0.25);
		border: rem(0.1) solid col(primary, 0.9); // 最外层颜色
		background-color: col(grey-0);
		@include shadow('box');
		@include border_radius(0.3);
		@include grass;

		&-inner {
			display: flex;
			padding: rem(0.2) rem(0.25);
			background-color: inherit;
			font-size: rem(0.6);
			word-break: break-all;
			white-space: pre-wrap;
		}

		&-top {
			@include arrow('top', 0.75);
		}

		&-bottom {
			@include arrow('bottom', 0.75);
		}

		&-left {
			@include arrow('left', 0.75);
		}

		&-right {
			@include arrow('right', 0.75);
		}

		&-enter-active,
		&-leave-active {
			transition: all 0.1s ease-out;
			transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		}

		&-enter-from,
		&-leave-to {
			opacity: 0;
		}

		&-leave-from,
		&-enter-to {
			opacity: 1;
		}
	}
}
</style>
